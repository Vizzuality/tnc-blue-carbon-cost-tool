import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as process from 'node:process';

@Injectable()
export class AppService {
  constructor(private config: ConfigService) {}
  getHello(): string {
    console.log(this.config.get('JWT_SECRET'));
    console.log('process', process.env.JWT_SECRET);
    return 'Hello Blue Coast Carbon Tool!';
  }
}
