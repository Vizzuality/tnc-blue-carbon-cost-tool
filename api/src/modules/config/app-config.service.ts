import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { COMMON_DATABASE_ENTITIES } from '@shared/entities/database.entities';
import { TOKEN_TYPE_ENUM } from '@shared/schemas/auth/token-type.schema';
import { JwtConfigHandler } from '@api/modules/config/auth-config.handler';
import { ApiEventsEntity } from '@api/modules/api-events/api-events.entity';
import { BaseData } from '@api/modules/model/base-data.entity';
import { Country } from '@api/modules/model/entities/country.entity';
import { CostInput } from '@api/modules/model/entities/cost-input.entity';
import { CarbonInputEntity } from '@api/modules/model/entities/carbon-input.entity';

export type JWTConfig = {
  secret: string;
  expiresIn: string;
};

export type EmailConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  domain: string;
};

@Injectable()
export class ApiConfigService {
  constructor(
    private configService: ConfigService,
    private readonly jwtConfigHandler: JwtConfigHandler,
  ) {}

  /**
   * @note We could abstract this to a data layer access config specific class within database module, as well for other configs when the thing gets more complex.
   * we could also abstract the underlying engine type, which is now set in the main app module
   *
   * @note: Maybe it's a good idea to move the datasource config to shared folder, to be used potentially for a e2e test agent
   */
  getDatabaseConfig() {
    return {
      host: this.configService.getOrThrow('DB_HOST'),
      port: this.configService.getOrThrow('DB_PORT'),
      username: this.configService.getOrThrow('DB_USERNAME'),
      password: this.configService.getOrThrow('DB_PASSWORD'),
      database: this.configService.getOrThrow('DB_NAME'),
      entities: [
        ...COMMON_DATABASE_ENTITIES,
        ApiEventsEntity,
        Country,
        BaseData,
        CostInput,
        CarbonInputEntity,
      ],
      synchronize: true,
      ssl: this.isProduction()
        ? { require: true, rejectUnauthorized: false }
        : false,
    };
  }

  private isProduction(): boolean {
    return this.configService.get('NODE_ENV') === 'production';
  }

  getJWTConfigByType(type: TOKEN_TYPE_ENUM): JWTConfig {
    return this.jwtConfigHandler.getJwtConfigByType(type);
  }

  getEmailConfig(): EmailConfig {
    return {
      accessKeyId: this.configService.getOrThrow('AWS_SES_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow(
        'AWS_SES_ACCESS_KEY_SECRET',
      ),
      region: this.configService.getOrThrow('AWS_SES_REGION'),
      domain: this.configService.getOrThrow('AWS_SES_DOMAIN'),
    };
  }

  get(envVarName: string): string {
    return this.configService.get(envVarName);
  }
}
