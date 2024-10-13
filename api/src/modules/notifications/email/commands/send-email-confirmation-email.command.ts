import { User } from '@shared/entities/users/user.entity';

export class SendEmailConfirmationEmailCommand {
  constructor(
    public readonly user: User,
    public readonly newEmail: string,
    public readonly origin: string,
  ) {}
}
