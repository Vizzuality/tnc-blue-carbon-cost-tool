// Does not work without * as uid
import * as uid from 'uid-safe';
import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '@api/modules/users/users.service';
import { User } from '@shared/entities/users/user.entity';
import * as bcrypt from 'bcrypt';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { UserWithAuthTokens } from '@shared/dtos/users/user.dto';
import { TOKEN_TYPE_ENUM } from '@shared/schemas/auth/token-type.schema';
import { CreateUserDto } from '@shared/dtos/users/create-user.dto';
import { randomBytes } from 'crypto';
import { SendWelcomeEmailCommand } from '@api/modules/notifications/email/commands/send-welcome-email.command';
import { JwtManager } from '@api/modules/auth/services/jwt.manager';
import { SignUpDto } from '@shared/schemas/auth/sign-up.schema';
import { NewUserEvent } from '@api/modules/admin/events/new-user.event';
import { UpdateUserPasswordDto } from '@shared/dtos/users/update-user-password.dto';
import { RequestEmailUpdateDto } from '@shared/dtos/users/request-email-update.dto';
import { SendEmailConfirmationEmailCommand } from '@api/modules/notifications/email/commands/send-email-confirmation-email.command';
import { PasswordManager } from '@api/modules/auth/services/password.manager';
import { API_EVENT_TYPES } from '@api/modules/api-events/events.enum';
import { Repository } from 'typeorm';
import {
  BACKOFFICE_SESSIONS_TABLE,
  BackOfficeSession,
} from '@shared/entities/users/backoffice-session';
import { ROLES } from '@shared/entities/users/roles.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { TimeUtils } from '@api/utils/time.utils';
import { AuthTokenPair } from '@shared/dtos/auth-token-pair.dto';

@Injectable()
export class AuthenticationService {
  logger: Logger = new Logger(AuthenticationService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtManager: JwtManager,
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly passwordManager: PasswordManager,
    @InjectRepository(BackOfficeSession)
    private readonly backOfficeSessionRepository: Repository<BackOfficeSession>,
    private readonly config: ApiConfigService,
  ) {}

  async refreshAuthTokens(refreshToken: string): Promise<AuthTokenPair> {
    return this.jwtManager.refreshAuthTokens(refreshToken);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (user?.isActive && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException(`Invalid credentials`);
  }

  async addUser(origin: string, dto: CreateUserDto) {
    const { newUser, plainTextPassword } = await this.createUser(dto);
    try {
      await this.commandBus.execute(
        new SendWelcomeEmailCommand(newUser, plainTextPassword, origin),
      );
    } catch (e) {
      await this.usersService.delete(newUser);
      this.logger.error(e);
      throw e;
    }
  }

  async createUser(
    createUser: CreateUserDto,
  ): Promise<{ newUser: User; plainTextPassword: string }> {
    // TODO: This is sync, check how to improve it
    const { email, name, partnerName, role } = createUser;
    const plainTextPassword = randomBytes(8).toString('hex');
    const passwordHash = await bcrypt.hash(plainTextPassword, 10);
    const existingUser = await this.usersService.findByEmail(createUser.email);
    if (existingUser) {
      throw new ConflictException(`User with email ${email} already exists`);
    }
    const newUser = await this.usersService.saveUser({
      name,
      email,
      password: passwordHash,
      partnerName,
      isActive: false,
      role,
    });
    this.eventBus.publish(
      new NewUserEvent(newUser.id, newUser.email, API_EVENT_TYPES.USER_CREATED),
    );
    return {
      newUser,
      plainTextPassword,
    };
  }

  private async createBackOfficeSession(
    user: User,
    accessToken: string,
  ): Promise<BackOfficeSession> {
    // We replicate what adminjs does by default using postgres as session storage (the default in memory session storage is not production ready)
    // This implementation is not compatible with many devices per user
    await this.backOfficeSessionRepository
      .createQueryBuilder()
      .delete()
      .from(BACKOFFICE_SESSIONS_TABLE)
      .where(`sess -> 'adminUser' ->> 'id' = :id`, { id: user.id })
      .execute();

    // Same expiration time as the refresh token
    const expiresInDuration = this.config.getJWTConfigByType(
      TOKEN_TYPE_ENUM.REFRESH,
    ).expiresIn;
    const expiresInSeconds =
      TimeUtils.parseDurationToSeconds(expiresInDuration);
    const expiresAt = Date.now() + expiresInSeconds * 1000;

    const backofficeSession: BackOfficeSession = {
      sid: await uid(24),
      sess: {
        cookie: {
          secure: false,
          httpOnly: true,
          path: '/',
          maxAge: expiresAt,
        },
        adminUser: {
          id: user.id,
          email: user.email,
          name: user.name,
          partnerName: user.partnerName,
          isActive: true,
          role: user.role,
          createdAt: user.createdAt,
          accessToken,
        },
      },
      expire: new Date(expiresAt),
    };
    await this.backOfficeSessionRepository.insert(backofficeSession);
    return backofficeSession;
  }

  async logIn(user: User): Promise<[UserWithAuthTokens, BackOfficeSession?]> {
    const tokenPair = await this.jwtManager.createAuthTokenPair(user.id);
    if (user.role !== ROLES.ADMIN) {
      return [{ user, ...tokenPair }];
    }

    // An adminjs session needs to be created for the admin user
    const backofficeSession = await this.createBackOfficeSession(
      user,
      tokenPair.accessToken,
    );
    return [{ user, ...tokenPair }, backofficeSession];
  }

  async signUp(user: User, signUpDto: SignUpDto): Promise<void> {
    const { oneTimePassword, newPassword } = signUpDto;
    if (!(await this.passwordManager.isPasswordValid(user, oneTimePassword))) {
      throw new UnauthorizedException();
    }
    user.isActive = true;
    user.password = await this.passwordManager.hashPassword(newPassword);
    await this.usersService.saveUser(user);
    this.eventBus.publish(
      new NewUserEvent(user.id, user.email, API_EVENT_TYPES.USER_SIGNED_UP),
    );
  }

  async verifyToken(token: string, type: TOKEN_TYPE_ENUM): Promise<boolean> {
    if (await this.jwtManager.isTokenValid(token, type)) {
      return true;
    }
    throw new UnauthorizedException();
  }

  async updatePassword(user: User, dto: UpdateUserPasswordDto): Promise<User> {
    const { password, newPassword } = dto;
    if (await this.passwordManager.isPasswordValid(user, password)) {
      user.password = await this.passwordManager.hashPassword(newPassword);
      return this.usersService.saveUser(user);
    }
    throw new UnauthorizedException();
  }

  async resetPassword(user: User, newPassword: string): Promise<void> {
    user.password = await this.passwordManager.hashPassword(newPassword);
    await this.usersService.saveUser(user);
  }

  async requestEmailUpdate(
    user: User,
    dto: RequestEmailUpdateDto,
    origin: string,
  ) {
    const { newEmail } = dto;
    const existingUser = await this.usersService.findByEmail(newEmail);
    if (existingUser) {
      throw new ConflictException(`Email already in use`);
    }
    if (user.email === newEmail) {
      throw new ConflictException(
        'New email must be different from the current one',
      );
    }

    await this.commandBus.execute(
      new SendEmailConfirmationEmailCommand(user, newEmail, origin),
    );
  }

  async confirmEmail(user: User, newEmail: string): Promise<User> {
    const existingUser = await this.usersService.findByEmail(newEmail);
    if (existingUser) {
      throw new ConflictException(`Email already in use`);
    }
    user.email = newEmail;
    return this.usersService.saveUser(user);
  }
}
