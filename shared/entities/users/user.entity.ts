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
import { UserUploadCostInputs } from "@shared/entities/users/user-upload-cost-inputs.entity";
import { UserUploadRestorationInputs } from "@shared/entities/users/user-upload-restoration-inputs.entity";
import { UserUploadConservationInputs } from "@shared/entities/users/user-upload-conservation-inputs.entity";
import { CustomProject } from "@shared/entities/custom-project.entity";

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

  @OneToMany("UserUploadCostInputs", "user")
  uploadedCostInputs: UserUploadCostInputs[];

  @OneToMany("UserUploadRestorationInputs", "user")
  userUploadRestorationInputs: UserUploadRestorationInputs[];

  @OneToMany("UserUploadConservationInputs", "user")
  userUploadConservationInputs: UserUploadConservationInputs[];

  @OneToMany("CustomProject", "user")
  customProjects: CustomProject[];
}
