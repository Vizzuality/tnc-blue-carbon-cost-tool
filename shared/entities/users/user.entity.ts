import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Exclude } from "class-transformer";
import { ROLES } from "@shared/entities/users/roles.enum";
import { UserUploadedData } from "@shared/entities/user-project-data.entity";

// TODO: For future reference:
// https://github.com/typeorm/typeorm/issues/2897

@Entity({ name: "users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, type: "varchar" })
  email: string;

  @Column({ nullable: true, type: "varchar" })
  name: string;

  @Column({ default: "default_partner", name: "partner_name", type: "varchar" })
  partnerName: string;

  @Column({ type: "boolean", default: false, name: "is_active" })
  isActive: boolean;

  @Column({ type: "varchar" })
  @Exclude()
  password: string;

  @Column({
    type: "enum",
    default: ROLES.PARTNER,
    enum: ROLES,
    enumName: "user_roles",
  })
  role: ROLES;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  // @OneToMany(
  //   () => UserUploadedData,
  //   (userUploadedData) => userUploadedData.user,
  // )
  // uploadedData: UserUploadedData[];
}
