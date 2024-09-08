import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@auth/authentication/authentication.module';
import { AuthorisationModule } from '@auth/authorisation/authorisation.module';

@Module({
  imports: [AuthenticationModule, AuthorisationModule],
  controllers: [],
  providers: [],
})
export class AuthModule {}
