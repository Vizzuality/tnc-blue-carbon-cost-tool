import { ModelComponentSource } from "@shared/entities/methodology/model-component-source.entity";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";

@Entity({ name: "model_component_source_m2m" })
export class ModelComponentSourceM2M extends BaseEntity {
  @PrimaryColumn({ name: "entity_name", type: "varchar", length: 255 })
  entityName: string;

  @PrimaryColumn({ name: "entity_id", type: "varchar" })
  entityId: string;

  @PrimaryColumn({ name: "source_type", type: "varchar", length: 255 })
  sourceType: string;

  @Column({ name: "source_id", type: "int4" })
  @ManyToOne(
    () => ModelComponentSource,
    (modelComponentSource) => modelComponentSource.modelComponentSourceM2M,
    {
      onDelete: "CASCADE",
    },
  )
  @JoinColumn({ name: "source_id" })
  source: ModelComponentSource;
}
