import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  Unique,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { Country } from "../country.entity";

export enum INPUT_SELECTION {
  INPUT_1 = "Input 1",
  INPUT_2 = "Input 2",
  INPUT_3 = "Input 3",
}

@Entity("blue_carbon_project_planning")
@Unique(["country"])
export class BlueCarbonProjectPlanning extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  country: Country;

  @Column({
    type: "enum",
    enum: INPUT_SELECTION,
    nullable: false,
    default: INPUT_SELECTION.INPUT_1,
  })
  inputSelection: INPUT_SELECTION;

  @Column("decimal", { name: "input_1_cost_per_project" })
  input1: number;

  @Column("decimal", { name: "input_2_cost_per_project" })
  input2: number;

  @Column("decimal", { name: "input_3_cost_per_project" })
  input3: number;

  @Column("decimal", { name: "blue_carbon" })
  blueCarbon: number;

  @BeforeInsert()
  @BeforeUpdate()
  setBlueCarbonValue() {
    if (this.inputSelection === INPUT_SELECTION.INPUT_1) {
      this.blueCarbon = this.input1;
    } else if (this.inputSelection === INPUT_SELECTION.INPUT_2) {
      this.blueCarbon = this.input2;
    } else if (this.inputSelection === INPUT_SELECTION.INPUT_3) {
      this.blueCarbon = this.input3;
    }
  }
}
