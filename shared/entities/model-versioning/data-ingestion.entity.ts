import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity("data_ingestions")
export class DataIngestionEntity extends BaseEntity {
  @PrimaryColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  @Column({ name: "version_name", type: "varchar" })
  versionName: string;

  @Column({ name: "version_notes", type: "text", nullable: true })
  versionNotes: string | null;
}
