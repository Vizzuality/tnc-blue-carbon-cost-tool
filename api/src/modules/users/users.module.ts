import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@shared/entities/users/user.entity';
import { UsersController } from '@api/modules/users/users.controller';
import { AuthModule } from '@api/modules/auth/auth.module';
import { UserUpload } from '@shared/entities/users/user-upload';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserUpload]),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
