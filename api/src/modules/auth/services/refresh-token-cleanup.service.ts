import { IssuedRefreshToken } from '@api/modules/auth/entities/issued-refresh-token.entity';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';

@Injectable()
export class TokenCleanupService {
  private readonly logger = new Logger(TokenCleanupService.name);

  constructor(
    @InjectRepository(IssuedRefreshToken)
    private readonly refreshTokenRepository: Repository<IssuedRefreshToken>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async cleanExpiredTokens() {
    this.logger.log('Starting cleanup of expired issued refresh tokens.');

    const result = await this.refreshTokenRepository.delete({
      expiresAt: LessThan(new Date()),
    });

    this.logger.log(
      `Cleanup complete. ${result.affected} expired issued refresh tokens removed.`,
    );
  }
}
