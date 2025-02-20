import { ModelComponentSource } from "@shared/entities/methodology/model-component-source.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  ManyToOne,
  RelationId,
} from "typeorm";

@Entity("model_assumptions")
export class ModelAssumptions extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { name: "name" })
  name: string;

  @Column("varchar", { name: "unit", nullable: true })
  unit: string;

  @Column("varchar", { name: "value" })
  value: string;

  @Column({ name: "source_id", type: "int4", nullable: true })
  @ManyToOne("ModelComponentSource", "modelAssumptions", {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "source_id" })
  source?: ModelComponentSource;
}
