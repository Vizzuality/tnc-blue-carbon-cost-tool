import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiConfigModule } from '@api/modules/config/app-config.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '@api/modules/auth/auth.module';
import { JwtAuthGuard } from '@api/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@api/modules/auth/guards/roles.guard';
import { NotificationsModule } from '@api/modules/notifications/notifications.module';

@Module({
  imports: [ApiConfigModule, AuthModule, NotificationsModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
