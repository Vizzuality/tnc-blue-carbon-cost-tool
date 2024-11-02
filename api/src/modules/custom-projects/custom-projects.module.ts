import { Module } from '@nestjs/common';
import { CustomProjectsService } from './custom-projects.service';

@Module({
  providers: [CustomProjectsService]
})
export class CustomProjectsModule {}
