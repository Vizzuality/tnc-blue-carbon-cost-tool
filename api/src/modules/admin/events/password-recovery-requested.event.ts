export class PasswordRecoveryRequestedEvent {
  constructor(
    public readonly email: string,
    public readonly userId?: string,
  ) {}
}
