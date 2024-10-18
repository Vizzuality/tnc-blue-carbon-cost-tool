import { API_EVENT_TYPES } from '@api/modules/api-events/events.enum';

export class NewUserEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly type:
      | API_EVENT_TYPES.USER_CREATED
      | API_EVENT_TYPES.USER_SIGNED_UP,
  ) {}
}
