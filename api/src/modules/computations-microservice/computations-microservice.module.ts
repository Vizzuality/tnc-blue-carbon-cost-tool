import { Module } from '@nestjs/common';
import { ComputationsMicroserviceProxy } from './computations-microservice.proxy';
import { HttpModule } from '@nestjs/axios';
import { ComputationsMicroserviceHttpConfig } from '@api/modules/computations-microservice/computations-microservice.http-config';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: ComputationsMicroserviceHttpConfig,
    }),
  ],
  providers: [ComputationsMicroserviceProxy],
  exports: [ComputationsMicroserviceProxy],
})
export class ComputationsMicroserviceModule {}
