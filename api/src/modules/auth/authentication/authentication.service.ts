import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@api/modules/users/users.service';
import { User } from '@shared/entities/users/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '@api/modules/auth/dtos/login.dto';
import { JwtPayload } from '@api/modules/auth/strategies/jwt.strategy';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException(`Invalid credentials`);
  }

  async signUp(signupDto: LoginDto): Promise<void> {
    const passwordHash = await bcrypt.hash(signupDto.password, 10);
    await this.usersService.createUser({
      email: signupDto.email,
      password: passwordHash,
    });
  }

  async logIn(user: User): Promise<{ user: User; accessToken: string }> {
    const payload: JwtPayload = { id: user.id };
    const accessToken: string = this.jwt.sign(payload);
    return { user, accessToken };
  }
}
