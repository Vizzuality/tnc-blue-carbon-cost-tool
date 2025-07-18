import { z } from "zod";

export const UploadFileSchema = z.object({
  version_name: z
    .string()
    .min(1, "Version name is required and cannot be empty"),
  version_notes: z.string().optional(),
});

export type UploadFileDto = z.infer<typeof UploadFileSchema>;
