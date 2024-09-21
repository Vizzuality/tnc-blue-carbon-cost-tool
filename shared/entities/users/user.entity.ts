import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Exclude } from "class-transformer";
import { ROLES } from "@api/modules/auth/authorisation/roles.enum";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ default: "default_partner", name: "partner_name" })
  partnerName: string;

  @Column({ type: "boolean", default: false, name: "is_active" })
  isActive: boolean;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: "enum",
    default: ROLES.GENERAL_USER,
    enum: ROLES,
    enumName: "user_roles",
  })
  role: ROLES;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
