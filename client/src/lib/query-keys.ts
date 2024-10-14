import {
  createQueryKeys,
  mergeQueryKeys,
} from "@lukemorales/query-key-factory";

export const authKeys = createQueryKeys("auth", {
  resetPasswordToken: (token: string) => ["reset-password-token", token],
  confirmEmailToken: (token: string) => ["confirm-email-token", token],
});

export const userKeys = createQueryKeys("user", {
  me: (token: string) => ["me", token],
});
export const queryKeys = mergeQueryKeys(authKeys, userKeys);
