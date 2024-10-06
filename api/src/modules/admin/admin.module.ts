import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AuthModule } from '@api/modules/auth/auth.module';

import { ImportModule } from '@api/modules/import/import.module';

@Module({
  imports: [AuthModule, ImportModule],
  controllers: [AdminController],
})
export class AdminModule {}
