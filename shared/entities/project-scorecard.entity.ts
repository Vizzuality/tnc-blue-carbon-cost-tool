import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Unique,
  JoinColumn,
} from "typeorm";
import { Country } from "@shared/entities/country.entity";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { PROJECT_SCORE } from "@shared/entities/project-score.enum";

@Entity("project_scorecard")
export class ProjectScorecard extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "country_code", length: 3, nullable: true, type: "char" })
  countryCode: string;

  //Unidirectional relation
  @ManyToOne(() => Country)
  @JoinColumn({ name: "country_code" })
  country: Country;

  @Column({ name: "ecosystem", enum: ECOSYSTEM, nullable: true, type: "enum" })
  ecosystem: ECOSYSTEM;

  @Column({
    name: "financial_feasibility",
    nullable: true,
    enum: PROJECT_SCORE,
    type: "enum",
  })
  financialFeasibility: PROJECT_SCORE;

  @Column({
    name: "legal_feasibility",
    nullable: true,
    enum: PROJECT_SCORE,
    type: "enum",
  })
  legalFeasibility: PROJECT_SCORE;

  @Column({
    name: "implementation_feasibility",
    nullable: true,
    enum: PROJECT_SCORE,
    type: "enum",
  })
  implementationFeasibility: PROJECT_SCORE;

  @Column({
    name: "social_feasibility",
    nullable: true,
    enum: PROJECT_SCORE,
    type: "enum",
  })
  socialFeasibility: PROJECT_SCORE;

  @Column({
    name: "security_rating",
    nullable: true,
    enum: PROJECT_SCORE,
    type: "enum",
  })
  securityRating: PROJECT_SCORE;

  @Column({
    name: "availability_of_experienced_labor",
    nullable: true,
    enum: PROJECT_SCORE,
    type: "enum",
  })
  availabilityOfExperiencedLabor: PROJECT_SCORE;

  @Column({
    name: "availability_of_alternating_funding",
    nullable: true,
    enum: PROJECT_SCORE,
    type: "enum",
  })
  availabilityOfAlternatingFunding: PROJECT_SCORE;

  @Column({
    name: "coastal_protection_benefits",
    nullable: true,
    enum: PROJECT_SCORE,
    type: "enum",
  })
  coastalProtectionBenefits: PROJECT_SCORE;

  @Column({
    name: "biodiversity_benefit",
    nullable: true,
    enum: PROJECT_SCORE,
    type: "enum",
  })
  biodiversityBenefit: PROJECT_SCORE;
}
