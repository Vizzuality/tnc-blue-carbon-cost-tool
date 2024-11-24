import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { decimalTransformer } from "@shared/entities/base-data.view";

@Entity("model_assumptions_registry")
export class ModelAssumptions extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { name: "name" })
  name: string;

  @Column("varchar", { name: "unit", nullable: true })
  unit: string;

  @Column("varchar", { name: "value" })
  value: string;
}
