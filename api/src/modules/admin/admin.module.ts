import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '@api/modules/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AdminController],
})
export class AdminModule {}
