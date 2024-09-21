import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@shared/entities/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findOneBy(id: string) {
    return this.repo.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async createUser(createUserDto: { email: string; password: string }) {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException(
        `Email ${createUserDto.email} already exists`,
      );
    }
    return this.repo.save(createUserDto);
  }

  async updatePassword(user: User, newPassword: string) {
    user.password = newPassword;
    return this.repo.save(user);
  }
}
