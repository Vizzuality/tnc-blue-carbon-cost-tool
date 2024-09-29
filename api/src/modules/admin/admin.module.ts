import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AuthModule } from '@api/modules/auth/auth.module';
import { ImportController } from '@api/modules/import/import.controller';

@Module({
  imports: [AuthModule],
  controllers: [AdminController, ImportController],
})
export class AdminModule {}
