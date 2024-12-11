import { BackofficeService } from '@api/modules/backoffice/backoffice.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackOfficeSession } from '@shared/entities/users/backoffice-session';

@Module({
  imports: [TypeOrmModule.forFeature([BackOfficeSession])],
  controllers: [],
  providers: [BackofficeService],
  exports: [BackofficeService, TypeOrmModule],
})
export class BackofficeModule {}
