import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '@api/modules/config/app-config.service';

/**
 * @description: This class is used to configure the HTTP module for the computations microservice.
 */

@Injectable()
export class ComputationsMicroserviceHttpConfig
  implements HttpModuleOptionsFactory
{
  constructor(private readonly apiConfig: ApiConfigService) {}
  createHttpOptions(): HttpModuleOptions {
    const baseURL = this.apiConfig.getComputationsMicroserviceUrl();

    return {
      baseURL,
      // ⏱ Maximum time (in ms) to wait for the microservice response before throwing an error.
      // Helps prevent the NestJS app from hanging if the microservice is slow or unresponsive.
      timeout: 5000,

      // 🔁 Maximum number of HTTP redirects to follow automatically.
      // Protects against redirect loops and misconfigured services.
      maxRedirects: 5,
    };
  }
}
