import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@shared/entities/users/user.entity';
import { Repository } from 'typeorm';

import { AppBaseService } from '@api/utils/app-base.service';
import { CreateUserDto } from '@shared/dtos/users/create-user.dto';
import { UpdateUserDto } from '@shared/dtos/users/update-user.dto';
import { AppInfoDTO } from '@api/utils/info.dto';
import { RequestEmailUpdateDto } from '@shared/dtos/users/request-email-update.dto';
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

  async saveUser(newUser: Partial<User>) {
    return this.userRepository.save(newUser);
  }

  async delete(user: User) {
    return this.userRepository.remove(user);
  }

  async isUserActive(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    return user.isActive;
  }

  async requestEmailUpdate(user: User, dto: RequestEmailUpdateDto) {
    const { email, newEmail } = dto;
    if (user.email !== email) {
      throw new UnauthorizedException();
    }
  }
}
