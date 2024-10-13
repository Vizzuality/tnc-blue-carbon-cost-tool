export class RequestPasswordRecoveryCommand {
  constructor(
    public readonly email: string,
    public readonly origin: string,
  ) {}
}
