export class EmailFailedEvent {
  constructor(
    public readonly email: string,
    public readonly errorMessage: string,
  ) {}
}
