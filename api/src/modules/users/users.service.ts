import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@shared/entities/users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AppBaseService } from '@api/utils/app-base.service';
import { CreateUserDto } from '@shared/dtos/users/create-user.dto';
import { UpdateUserDto } from '@shared/dtos/users/update-user.dto';
import { AppInfoDTO } from '@api/utils/info.dto';
@Injectable()
export class UsersService extends AppBaseService<
  User,
  CreateUserDto,
  UpdateUserDto,
  AppInfoDTO
> {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super(userRepository, 'user', 'users');
  }

  async findOneBy(id: string) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(newUser: Partial<User>) {
    const existingUser = await this.findByEmail(newUser.email);
    if (existingUser) {
      throw new ConflictException(`Email ${newUser.email} already exists`);
    }
    return this.userRepository.save(newUser);
  }

  async saveNewHashedPassword(user: User, newPassword: string) {
    user.password = await bcrypt.hash(newPassword, 10);
    return this.userRepository.save(user);
  }

  async delete(user: User) {
    return this.userRepository.remove(user);
  }

  async isUserActive(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    return user.isActive;
  }
}
