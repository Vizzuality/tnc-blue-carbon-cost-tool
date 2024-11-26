import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

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
}
