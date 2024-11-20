import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "@shared/entities/users/user.entity";

@Entity("user_upload_conservation_inputs")
export class UserUploadConservationInputs extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userUploadConservationInputs)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "varchar", length: 255, nullable: true })
  projectName: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  country: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  cityOrRegion: string;

  @Column({ type: "int", nullable: true })
  projectStartYear: number;

  @Column({ type: "int", nullable: true })
  mostRecentYearOfData: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  ecosystem: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  projectActivity: string;

  @Column({ type: "int", nullable: true })
  projectSizeAreaStudied: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  categories: string;

  @Column({ type: "int", nullable: true })
  projectArea: number;

  @Column({ type: "int", nullable: true })
  abovegroundBiomassStock: number;

  @Column({ type: "int", nullable: true })
  belowgroundBiomassStock: number;

  @Column({ type: "int", nullable: true })
  soilOrganicCarbonStock: number;

  @Column({ type: "int", nullable: true })
  methaneEmissions: number;

  @Column({ type: "int", nullable: true })
  nitrousOxideEmissions: number;

  @Column({ type: "int", nullable: true })
  abovegroundBiomassEmissionsFactor: number;

  @Column({ type: "int", nullable: true })
  belowgroundBiomassEmissionsFactor: number;

  @Column({ type: "int", nullable: true })
  soilOrganicCarbonEmissionsFactor: number;
}
