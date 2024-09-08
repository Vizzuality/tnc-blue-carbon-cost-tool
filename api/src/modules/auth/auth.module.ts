import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@api/modules/auth/authentication/authentication.module';
import { AuthorisationModule } from '@api/modules/auth/authorisation/authorisation.module';

@Module({
  imports: [AuthenticationModule, AuthorisationModule],
  controllers: [],
  providers: [],
})
export class AuthModule {}
