import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@shared/entities/users/user.entity';
import { UsersController } from '@api/modules/users/users.controller';
import { AuthModule } from '@api/modules/auth/auth.module';
import { UserUploadCostInputs } from '@shared/entities/users/user-upload-cost-inputs.entity';
import { UserUploadRestorationInputs } from '@shared/entities/users/user-upload-restoration-inputs.entity';
import { UserUploadConservationInputs } from '@shared/entities/users/user-upload-conservation-inputs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserUploadCostInputs,
      UserUploadRestorationInputs,
      UserUploadConservationInputs,
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
