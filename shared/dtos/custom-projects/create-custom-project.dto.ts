import { CreateCustomProjectSchema } from "@shared/schemas/custom-projects/create-custom-project.schema";
import { z } from "zod";

export type CreateCustomProjectDto = z.infer<typeof CreateCustomProjectSchema>;
