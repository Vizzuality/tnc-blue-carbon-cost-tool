import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@shared/entities/users/user.entity';
import { UsersController } from '@api/modules/users/users.controller';
import { AuthModule } from '@api/modules/auth/auth.module';
import { UserUploadedData } from '@shared/entities/user-project-data.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserUploadedData]),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
