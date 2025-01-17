import { User } from '@shared/entities/users/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

export enum IssuedRefreshTokenStatus {
  VALID = 'valid',
  USED = 'used',
  REVOKED = 'revoked',
}

@Entity('issued_refresh_tokens')
@Index('expires_at_id_idx', ['expiresAt', 'id'])
export class IssuedRefreshToken extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.issuedRefreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('enum', { enum: IssuedRefreshTokenStatus })
  status: IssuedRefreshTokenStatus;

  @Column('timestamp')
  issuedAt: Date;

  @Column('timestamp')
  expiresAt: Date;
}
