import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@api/modules/users/users.service';
import { User } from '@shared/entities/users/user.entity';
import * as bcrypt from 'bcrypt';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { UserWithAccessToken } from '@shared/dtos/user.dto';
import { TOKEN_TYPE_ENUM } from '@shared/schemas/auth/token-type.schema';
import { CreateUserDto } from '@shared/schemas/users/create-user.schema';
import { randomBytes } from 'node:crypto';
import { SendWelcomeEmailCommand } from '@api/modules/notifications/email/commands/send-welcome-email.command';
import { JwtManager } from '@api/modules/auth/services/jwt.manager';
import { SignUpDto } from '@shared/schemas/auth/sign-up.schema';
import { UserSignedUpEvent } from '@api/modules/events/user-events/user-signed-up.event';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtManager: JwtManager,
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
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

  async signUp(user: User, signUpDto: SignUpDto): Promise<void> {
    const { password, newPassword } = signUpDto;
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }
    user.isActive = true;
    await this.usersService.updatePassword(user, newPassword);
    this.eventBus.publish(new UserSignedUpEvent(user.id, user.email));
  }

  async verifyToken(token: string, type: TOKEN_TYPE_ENUM): Promise<boolean> {
    if (await this.jwtManager.isTokenValid(token, type)) {
      return true;
    }
    throw new UnauthorizedException();
  }
}