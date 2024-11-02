import { Module } from '@nestjs/common';
import { CalculationsService } from './calculations.service';

@Module({
  providers: [CalculationsService]
})
export class CalculationsModule {}
