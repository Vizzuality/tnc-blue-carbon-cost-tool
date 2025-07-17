import { ACTIVITY } from "@shared/entities/activity.enum";
import {
  ConservationCustomProjectSchemaFE,
  CreateCustomProjectSchema,
  CustomProjectBaseLooseSchema,
  RestorationCustomProjectSchema,
  ValidateConservationSchema,
  ValidateRestorationSchema,
} from "@shared/schemas/custom-projects/create-custom-project.schema";
import { z } from "zod";

const ConservationCustomProjectFormSchema =
  ConservationCustomProjectSchemaFE.partial();

const RestorationCustomProjectFormSchema =
  RestorationCustomProjectSchema.partial();

const ValidateLooseConservationSchema = (
  data: z.infer<typeof CustomProjectFormSchema>,
  ctx: z.RefinementCtx,
) => {
  if (data.parameters)
    ValidateConservationSchema(
      data as z.infer<typeof CreateCustomProjectSchema>,
      ctx,
    );
};

const ValidateLooseRestorationSchema = (
  data: z.infer<typeof CustomProjectFormSchema>,
  ctx: z.RefinementCtx,
) => {
  if (data.parameters)
    ValidateRestorationSchema(
      data as z.infer<typeof CreateCustomProjectSchema>,
      ctx,
    );
};

/**
 * Looser schema derived from the CreateCustomProjectSchema
 */
const CustomProjectFormSchema = z
  .discriminatedUnion("activity", [
    z.object({
      ...CustomProjectBaseLooseSchema.shape,
      activity: z.literal(ACTIVITY.CONSERVATION),
      parameters: ConservationCustomProjectFormSchema.optional(),
    }),
    z.object({
      ...CustomProjectBaseLooseSchema.shape,
      activity: z.literal(ACTIVITY.RESTORATION),
      parameters: RestorationCustomProjectFormSchema.optional(),
    }),
  ])
  .superRefine((data, ctx) => {
    if (data.activity === ACTIVITY.CONSERVATION) {
      ValidateLooseConservationSchema(data, ctx);
    } else if (data.activity === ACTIVITY.RESTORATION) {
      ValidateLooseRestorationSchema(data, ctx);
    }
  });

export { CustomProjectFormSchema };
