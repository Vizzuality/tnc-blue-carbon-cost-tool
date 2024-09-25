import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@api/modules/users/users.service';
import { User } from '@shared/entities/users/user.entity';
import * as bcrypt from 'bcrypt';
import { CommandBus } from '@nestjs/cqrs';
import { UserWithAccessToken } from '@shared/dtos/user.dto';
import { TOKEN_TYPE_ENUM } from '@shared/schemas/auth/token-type.schema';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { CreateUserDto } from '@shared/schemas/users/create-user.schema';
import { randomBytes } from 'node:crypto';
import { SendWelcomeEmailCommand } from '@api/modules/notifications/email/commands/send-welcome-email.command';
import { JwtManager } from '@api/modules/auth/services/jwt.manager';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
    private readonly jwtManager: JwtManager,
    private readonly apiConfig: ApiConfigService,
    private readonly commandBus: CommandBus,
  ) {}
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException(`Invalid credentials`);
  }

  async createUser(createUser: CreateUserDto): Promise<void> {
    // TODO: This is sync, check how to improve it
    const { email, name, partnerName } = createUser;
    const plainTextPassword = randomBytes(8).toString('hex');
    const passwordHash = await bcrypt.hash(plainTextPassword, 10);
    const newUser = await this.usersService.createUser({
      name,
      email,
      password: passwordHash,
      partnerName,
      isActive: false,
    });
    await this.commandBus
      .execute(new SendWelcomeEmailCommand(newUser, plainTextPassword))
      .catch(() => this.usersService.delete(newUser));
  }

  async logIn(user: User): Promise<UserWithAccessToken> {
    const { accessToken } = await this.jwtManager.signAccessToken(user.id);
    return { user, accessToken };
  }

  async isTokenValid(token: string, type: TOKEN_TYPE_ENUM): Promise<boolean> {
    const { secret } = this.apiConfig.getJWTConfigByType(type);
    try {
      const { id } = await this.jwt.verifyAsync(token, { secret });
      switch (type) {
        case TOKEN_TYPE_ENUM.EMAIL_CONFIRMATION:
          return !(await this.usersService.isUserActive(id));
        default:
          break;
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
