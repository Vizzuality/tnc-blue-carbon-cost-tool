import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigModule } from '@api/modules/config/app-config.module';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { UsersService } from '@api/modules/users/users.service';
import { UsersModule } from '@api/modules/users/users.module';
import { LocalStrategy } from '@api/modules/auth/strategies/local.strategy';
import { JwtStrategy } from '@api/modules/auth/strategies/jwt.strategy';
import { TOKEN_TYPE_ENUM } from '@shared/schemas/auth/token-type.schema';
import { ResetPasswordJwtStrategy } from '@api/modules/auth/strategies/reset-password.strategy';
import { JwtManager } from '@api/modules/auth/services/jwt.manager';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ApiConfigModule],
      inject: [ApiConfigService],
      useFactory: (config: ApiConfigService) => ({
        secret: config.getJWTConfigByType(TOKEN_TYPE_ENUM.ACCESS).secret,
        signOptions: {
          expiresIn: config.getJWTConfigByType(TOKEN_TYPE_ENUM.ACCESS)
            .expiresIn,
        },
      }),
    }),
    UsersModule,
  ],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtManager,
    {
      provide: JwtStrategy,
      useFactory: (users: UsersService, config: ApiConfigService) => {
        return new JwtStrategy(users, config);
      },
      inject: [UsersService, ApiConfigService],
    },
    {
      provide: ResetPasswordJwtStrategy,
      useFactory: (users: UsersService, config: ApiConfigService) => {
        return new ResetPasswordJwtStrategy(users, config);
      },
      inject: [UsersService, ApiConfigService],
    },
  ],
  exports: [UsersModule, AuthenticationService, JwtManager],
})
export class AuthenticationModule {}
