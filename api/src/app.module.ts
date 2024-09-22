import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiConfigModule } from '@api/modules/config/app-config.module';
import { AuthModule } from '@api/modules/auth/auth.module';
import { NotificationsModule } from '@api/modules/notifications/notifications.module';
import { EventsModule } from '@api/modules/events/events.module';
import { AdminModule } from '@api/modules/admin/admin.module';

@Module({
  imports: [
    ApiConfigModule,
    AuthModule,
    NotificationsModule,
    EventsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
