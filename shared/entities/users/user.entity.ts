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
