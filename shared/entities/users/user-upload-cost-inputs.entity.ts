import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from "typeorm";
import { User } from "@shared/entities/users/user.entity";

@Entity("user_upload_cost_inputs")
export class UserUploadCostInputs extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.uploadedCostInputs)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "varchar", length: 255, nullable: true })
  programName: string;

  @Column({ type: "int", nullable: true })
  intendedLengthOfProject: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  country: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  currency: string;

  @Column({ type: "int", nullable: true })
  projectStartYear: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  projectActivity: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  ecosystem: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  projectSize: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  validationStandard: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  numberOfLocalIndividuals: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  cityOrRegion: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  intendedAlternativeUseOfLand: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  landOwnershipBeforeProject: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  sdgsBenefitted: string;

  @Column({ type: "boolean", nullable: true })
  projectEligibleForCarbonCredits: boolean;

  @Column({ type: "boolean", nullable: true })
  willingToSpeakAboutPricing: boolean;

  @Column({ type: "boolean", nullable: true })
  ableToProvideDetailedCostDocumentation: boolean;

  @Column({ type: "text", nullable: true })
  costCategories: string;

  @Column({ type: "int", nullable: true })
  establishingCommunityEngagement: number;

  @Column({ type: "int", nullable: true })
  conservationProjectPlanning: number;

  @Column({ type: "int", nullable: true })
  carbonProjectPlanning: number;

  @Column({ type: "int", nullable: true })
  landCost: number;

  @Column({ type: "int", nullable: true })
  financingCost: number;

  @Column({ type: "int", nullable: true })
  materialsSeedsFertilizer: number;

  @Column({ type: "int", nullable: true })
  materialsMachineryEquipment: number;

  @Column({ type: "int", nullable: true })
  projectLaborActivity: number;

  @Column({ type: "int", nullable: true })
  engineeringIntervention: number;

  @Column({ type: "int", nullable: true })
  ongoingCommunityEngagement: number;

  @Column({ type: "int", nullable: true })
  otherProjectRunningCost: number;

  @Column({ type: "int", nullable: true })
  projectMonitoring: number;

  @Column({ type: "int", nullable: true })
  otherCost1: number;

  @Column({ type: "int", nullable: true })
  otherCost2: number;

  @Column({ type: "int", nullable: true })
  otherCost3: number;

  @Column({ type: "text", nullable: true })
  projectCumulativeSequestration: string;

  @Column({ type: "text", nullable: true })
  detailedProjectActivity: string;

  @Column({ type: "text", nullable: true })
  communityEngagementSpending: string;

  @Column({ type: "text", nullable: true })
  landRightsAndEasements: string;

  @Column({ type: "text", nullable: true })
  hourlyWageRate: string;

  @Column({ type: "text", nullable: true })
  ongoingCommunityCompensation: string;

  @Column({ type: "text", nullable: true })
  engineeringDetails: string;
}
