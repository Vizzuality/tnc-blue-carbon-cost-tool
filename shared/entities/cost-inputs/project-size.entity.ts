import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  Unique,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Country } from "../country.entity";
import { ECOSYSTEM } from "../ecosystem.enum";
import { ACTIVITY } from "../activity.enum";

@Entity("project_size")
@Unique(["country", "ecosystem", "activity"])
export class ProjectSize extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  @JoinColumn()
  country: Country;

  @Column({ name: "ecosystem", enum: ECOSYSTEM, type: "enum" })
  ecosystem: ECOSYSTEM;

  @Column({ name: "activity", enum: ACTIVITY, type: "enum" })
  activity: ACTIVITY;

  @Column("decimal", { name: "size" })
  sizeHa: number;
}
