import { User } from '@shared/entities/users/user.entity';

export class SendWelcomeEmailCommand {
  constructor(
    public readonly user: User,
    public readonly plainPassword: string,
  ) {}
}
