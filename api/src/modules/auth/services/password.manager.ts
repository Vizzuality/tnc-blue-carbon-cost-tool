import { Injectable } from '@nestjs/common';
import { User } from '@shared/entities/users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordManager {
  constructor() {}

  async isPasswordValid(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
