import { z } from "zod";
import { RequestEmailUpdateSchema } from "@shared/schemas/users/request-email-update.schema";

export type RequestEmailUpdateDto = z.infer<typeof RequestEmailUpdateSchema>;
