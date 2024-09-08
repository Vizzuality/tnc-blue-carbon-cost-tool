import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiConfigModule } from '@api/modules/config/app-config.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '@api/modules/auth/auth.module';
import { JwtAuthGuard } from '@api/modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [ApiConfigModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
