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

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ApiConfigModule],
      inject: [ApiConfigService],
      useFactory: (config: ApiConfigService) => ({
        secret: config.getJWTConfig().secret,
        signOptions: { expiresIn: config.getJWTConfig().expiresIn },
      }),
    }),
    UsersModule,
  ],
  providers: [
    AuthenticationService,
    LocalStrategy,
    {
      provide: JwtStrategy,
      useFactory: (users: UsersService, config: ApiConfigService) => {
        return new JwtStrategy(users, config);
      },
      inject: [UsersService, ApiConfigService],
    },
  ],
  exports: [JwtModule, UsersModule, AuthenticationService],
})
export class AuthenticationModule {}
