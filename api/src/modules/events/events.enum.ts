export enum API_EVENT_TYPES {
  USER_SIGNED_UP = 'user.signed_up',
  USER_PASSWORD_RECOVERY_REQUESTED = 'user.password_recovery_requested',
  USER_PASSWORD_RECOVERY_REQUESTED_NON_EXISTENT = 'user.password_recovery_requested_non_existent',

  EMAIL_FAILED = 'system.email.failed',
  // More events to come....
}

// More enums non related to events that we want to register in DB
