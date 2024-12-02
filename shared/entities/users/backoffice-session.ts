import { Entity, Column, PrimaryColumn } from "typeorm";

export const BACKOFFICE_SESSIONS_TABLE = "backoffice_sessions";

@Entity(BACKOFFICE_SESSIONS_TABLE)
export class BackOfficeSession {
  @PrimaryColumn("varchar")
  sid: string;

  @Column("json")
  sess: {
    cookie: any,
    adminUser: any,
  };

  @Column("timestamp", { precision: 6, nullable: true })
  expire?: Date;
}
