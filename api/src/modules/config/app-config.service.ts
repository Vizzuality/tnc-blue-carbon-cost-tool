import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DATABASE_ENTITIES } from '@shared/entities/database.entities';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  /**
   * @note We could abstract this to a data layer access config specific class within database module, as well for other configs when the thing gets more complex.
   * we could also abstract the underlying engine type, which is now set in the main app module
   *
   * @note: Maybe it's a good idea to move the datasource config to shared folder, to be used potentially for a e2e test agent
   */
  getDatabaseConfig() {
    return {
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      entities: DATABASE_ENTITIES,
      synchronize: true,
      ssl: this.isProduction()
        ? { require: true, rejectUnauthorized: false }
        : false,
    };
  }

  private isProduction(): boolean {
    return this.configService.get('NODE_ENV') === 'production';
  }
}
