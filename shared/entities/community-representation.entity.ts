import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { BaseData } from "@shared/entities/base-data.entity";

@Entity("community_representation")
export class CommunityRepresentation extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { name: "liaison_cost" })
  liaisonCost: number;

  @OneToOne(() => BaseData, (baseData) => baseData.communityRepresentation)
  baseData: BaseData[];
}
