import { InfoDTO } from 'nestjs-base-service';
import { User } from '@shared/entities/users/user.entity';

export type AppInfoDTO = InfoDTO<User>;
