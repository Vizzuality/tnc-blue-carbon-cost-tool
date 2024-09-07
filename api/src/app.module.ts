import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiConfigModule } from '@api/modules/config/app-config.module';

@Module({
  imports: [ApiConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
