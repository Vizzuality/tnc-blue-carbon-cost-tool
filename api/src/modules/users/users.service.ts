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

  async createUser(newUser: Partial<User>) {
    const existingUser = await this.findByEmail(newUser.email);
    if (existingUser) {
      throw new ConflictException(`Email ${newUser.email} already exists`);
    }
    return this.repo.save(newUser);
  }

  async updatePassword(user: User, newPassword: string) {
    user.password = newPassword;
    return this.repo.save(user);
  }

  async delete(user: User) {
    return this.repo.remove(user);
  }

  async isUserActive(id: string) {
    const user = await this.repo.findOneBy({ id });
    return user.isActive;
  }
}
