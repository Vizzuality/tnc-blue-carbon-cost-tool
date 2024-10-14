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
import { UserWithAccessToken } from '@shared/dtos/users/user.dto';
import { TOKEN_TYPE_ENUM } from '@shared/schemas/auth/token-type.schema';
import { CreateUserDto } from '@shared/dtos/users/create-user.dto';
import { randomBytes } from 'node:crypto';
import { SendWelcomeEmailCommand } from '@api/modules/notifications/email/commands/send-welcome-email.command';
import { JwtManager } from '@api/modules/auth/services/jwt.manager';
import { SignUpDto } from '@shared/schemas/auth/sign-up.schema';
import { UserSignedUpEvent } from '@api/modules/admin/events/user-signed-up.event';
import { UpdateUserPasswordDto } from '@shared/dtos/users/update-user-password.dto';
import { RequestEmailUpdateDto } from '@shared/dtos/users/request-email-update.dto';
import { SendEmailConfirmationEmailCommand } from '@api/modules/notifications/email/commands/send-email-confirmation-email.command';
import { PasswordManager } from '@api/modules/auth/services/password.manager';

@Injectable()
export class AuthenticationService {
  logger: Logger = new Logger(AuthenticationService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtManager: JwtManager,
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly passwordManager: PasswordManager,
  ) {}
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
    const { email, name, partnerName } = createUser;
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
    });
    return {
      newUser,
      plainTextPassword,
    };
  }

  async logIn(user: User): Promise<UserWithAccessToken> {
    const { accessToken } = await this.jwtManager.signAccessToken(user.id);
    return { user, accessToken };
  }

  async signUp(user: User, signUpDto: SignUpDto): Promise<void> {
    const { oneTimePassword, newPassword } = signUpDto;
    if (!(await this.passwordManager.isPasswordValid(user, oneTimePassword))) {
      throw new UnauthorizedException();
    }
    user.isActive = true;
    user.password = await this.passwordManager.hashPassword(newPassword);
    await this.usersService.saveUser(user);
    this.eventBus.publish(new UserSignedUpEvent(user.id, user.email));
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
    const { email, newEmail } = dto;
    const existingUser = await this.usersService.findByEmail(newEmail);
    if (existingUser) {
      throw new ConflictException(`Email already in use`);
    }
    if (email === newEmail) {
      throw new ConflictException(
        'New email must be different from the current one',
      );
    }
    if (user.email !== email) {
      this.logger.warn(
        `User ${user.id} tried to update email without providing the correct email`,
      );
      throw new UnauthorizedException('Invalid email provided');
    }

    await this.commandBus.execute(
      new SendEmailConfirmationEmailCommand(user, newEmail, origin),
    );
  }
}
