import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@api/modules/users/users.service';
import { User } from '@shared/entities/users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '@api/modules/auth/strategies/jwt.strategy';
import { EventBus } from '@nestjs/cqrs';
import { UserSignedUpEvent } from '@api/modules/events/user-events/user-signed-up.event';
import { UserWithAccessToken } from '@shared/dtos/user.dto';
import { TOKEN_TYPE_ENUM } from '@shared/schemas/auth/token-type.schema';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { CreateUserDto } from '@shared/schemas/users/create-user.schema';
import { randomBytes } from 'node:crypto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
    private readonly apiConfig: ApiConfigService,
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
    });
    this.eventBus.publish(new UserSignedUpEvent(newUser.id, newUser.email));
  }

  async logIn(user: User): Promise<UserWithAccessToken> {
    const payload: JwtPayload = { id: user.id };
    const accessToken: string = this.jwt.sign(payload);
    return { user, accessToken };
  }

  async verifyToken(token: string, type: TOKEN_TYPE_ENUM): Promise<boolean> {
    const { secret } = this.apiConfig.getJWTConfigByType(type);
    try {
      await this.jwt.verify(token, { secret });
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
