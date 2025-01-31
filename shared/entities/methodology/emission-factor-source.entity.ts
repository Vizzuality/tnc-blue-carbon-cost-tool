import { EmissionFactors } from "@shared/entities/carbon-inputs/emission-factors.entity";
import { EmissionFactorType } from "@shared/entities/methodology/emission-factor.type";
import { ModelComponentSource } from "@shared/entities/methodology/model-component-source.entity";
import {
  Entity,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
  BaseEntity,
} from "typeorm";

@Entity({ name: "emission_factors_sources" })
export class EmissionFactorsSource extends BaseEntity {
  @PrimaryColumn({ name: "emission_factor_id", type: "uuid" })
  @ManyToOne(
    () => EmissionFactors,
    (emissionFactor) => emissionFactor.sources,
    {
      onDelete: "CASCADE",
    },
  )
  @JoinColumn({ name: "emission_factor_id" })
  emissionFactor: EmissionFactors;

  @PrimaryColumn({ name: "source_id", type: "int4" })
  @ManyToOne(
    () => ModelComponentSource,
    (modelComponentSource) => modelComponentSource.sources,
    {
      onDelete: "CASCADE",
    },
  )
  @JoinColumn({ name: "source_id" })
  source: ModelComponentSource;

  @PrimaryColumn({ name: "emission_factor_type", type: "varchar", length: 255 })
  emissionFactorType: EmissionFactorType;
}
