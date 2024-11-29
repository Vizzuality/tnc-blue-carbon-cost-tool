export class SaveCustomProjectEvent {
  constructor(
    public readonly userId: string,
    public readonly success: boolean,
    public readonly payload: any = {},
  ) {}
}
