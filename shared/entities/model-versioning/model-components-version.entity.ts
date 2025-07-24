import { CustomProject } from "@shared/entities/custom-project.entity";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from "typeorm";

@Entity("mode_components_versions")
export class ModelComponentsVersionEntity extends BaseEntity {
  @PrimaryColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  @Column({ name: "version_name", type: "varchar" })
  versionName: string;

  @Column({ name: "version_notes", type: "text", nullable: true })
  versionNotes: string | null;

  @Column({ name: "file_path", type: "varchar", nullable: true })
  filePath: string | null;

  @OneToMany("CustomProject", "version")
  customProjects: CustomProject[];
}
