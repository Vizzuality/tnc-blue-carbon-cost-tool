import { Module } from '@nestjs/common';
import { MethodologyController } from './methodology.controller';
import { MethodologyService } from './methodology.service';
import { CalculationsModule } from '@api/modules/calculations/calculations.module';

@Module({
  imports: [CalculationsModule],
  controllers: [MethodologyController],
  providers: [MethodologyService],
})
export class MethodologyModule {}
