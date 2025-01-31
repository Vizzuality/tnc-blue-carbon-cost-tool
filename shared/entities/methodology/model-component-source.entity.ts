import { ProjectSize } from "@shared/entities/cost-inputs/project-size.entity";
import { EmissionFactorsSource } from "@shared/entities/methodology/emission-factor-source.entity";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "model_component_sources" })
export class ModelComponentSource extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "name", type: "varchar" })
  name: string;

  @Column({ name: "reviewed_at", type: "timestamptz" })
  reviewedAt: Date;

  @OneToMany("ProjectSize", "source")
  projectSizes: ProjectSize[];

  @OneToMany("EmissionFactorsSource", "source")
  emissionFactorsSources: EmissionFactorsSource[];
}
