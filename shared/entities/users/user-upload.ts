import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "@shared/entities/users/user.entity";

export type UserUploadFile = {
  id: number;
  originalName: string;
  mimeType: string;
  size: number;
  key: string;
};

@Entity("user_uploads")
export class UserUpload extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.uploads)
  @Column({ name: "user_id", type: "uuid" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "jsonb" })
  files: UserUploadFile[];

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  uploadedAt: Date;
}
