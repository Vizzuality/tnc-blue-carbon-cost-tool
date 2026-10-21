import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AuthModule } from '@api/modules/auth/auth.module';
import { ImportModule } from '@api/modules/import/import.module';
import { AdminExportService } from '@api/modules/admin/admin-export.service';

@Module({
  imports: [AuthModule, ImportModule],
  controllers: [AdminController],
  providers: [AdminExportService],
})
export class AdminModule {}
