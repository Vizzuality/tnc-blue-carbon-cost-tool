import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ControllerResponse } from '@api/types/controller-response.type';

@Controller()
export class AppController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
  ) {}

  @Get('/')
  public root(): ControllerResponse {
    return null;
  }

  @Get('/health')
  @HealthCheck({ noCache: true })
  public checkHealth(): ControllerResponse {
    return this.health.check([
      // TODO: Right now importing the excel blocks the event loop making this check unhealthy in prod. Temporarily bumping it to avoid
      //       forced restarts until we decide if we offload the excel import from the main thread
      async () => this.db.pingCheck('database', { timeout: 3600 }),
    ]);
  }
}
