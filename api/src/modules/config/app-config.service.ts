import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  /**
   * @note We could abstract this to a data layer access config specific class within database module, as well for other configs when the thing gets more complex.
   * we could also abstract the underlying engine type, which is now set in the main app module
   */
  getDatabaseConfig() {
    return {
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
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
