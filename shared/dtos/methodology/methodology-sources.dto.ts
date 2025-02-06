import { ModelComponentSource } from "@shared/entities/methodology/model-component-source.entity";

export type MethodologySourcesDto = {
  category: "Carbon" | "Costs";
  sourcesByComponentName: {
    name: string;
    sources:
      | Partial<ModelComponentSource>
      | Record<string, Partial<ModelComponentSource>>;
  }[];
}[];
