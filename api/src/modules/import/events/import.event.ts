import { API_EVENT_TYPES } from '@api/modules/api-events/events.enum';

export class ImportEvent {
  constructor(
    public readonly kind:
      | API_EVENT_TYPES.EXCEL_IMPORT_FAILED
      | API_EVENT_TYPES.EXCEL_IMPORT_STARTED
      | API_EVENT_TYPES.EXCEL_IMPORT_SUCCESS,
    public readonly userId: string,
    public readonly payload: Record<any, any>,
  ) {}
}
