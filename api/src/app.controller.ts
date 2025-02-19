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

  @Get('/test')
  public test() {
    return 'test';
  }

  @Get('/health')
  @HealthCheck({ noCache: true })
  public checkHealth(): ControllerResponse {
    return this.health.check([
      async () => this.db.pingCheck('database', { timeout: 1500 }),
    ]);
  }
}
