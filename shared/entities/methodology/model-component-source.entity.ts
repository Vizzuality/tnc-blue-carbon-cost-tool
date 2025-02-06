import { EcosystemLoss } from "@shared/entities/carbon-inputs/ecosystem-loss.entity";
import { BaselineReassessment } from "@shared/entities/cost-inputs/baseline-reassessment.entity";
import { CarbonStandardFees } from "@shared/entities/cost-inputs/carbon-standard-fees.entity";
import { CommunityBenefitSharingFund } from "@shared/entities/cost-inputs/community-benefit-sharing-fund.entity";
import { CommunityRepresentation } from "@shared/entities/cost-inputs/community-representation.entity";
import { ConservationPlanningAndAdmin } from "@shared/entities/cost-inputs/conservation-and-planning-admin.entity";
import { DataCollectionAndFieldCosts } from "@shared/entities/cost-inputs/data-collection-and-field-costs.entity";
import { CarbonRights } from "@shared/entities/cost-inputs/establishing-carbon-rights.entity";
import { FeasibilityAnalysis } from "@shared/entities/cost-inputs/feasability-analysis.entity";
import { FinancingCost } from "@shared/entities/cost-inputs/financing-cost.entity";
import { LongTermProjectOperating } from "@shared/entities/cost-inputs/long-term-project-operating.entity";
import { Maintenance } from "@shared/entities/cost-inputs/maintenance.entity";
import { MonitoringCost } from "@shared/entities/cost-inputs/monitoring.entity";
import { MRV } from "@shared/entities/cost-inputs/mrv.entity";
import { ModelComponentSourceM2M } from "@shared/entities/methodology/model-source-m2m.entity";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "model_component_sources" })
export class ModelComponentSource extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "name", type: "varchar" })
  name: string;

  @Column({ name: "reviewed_at", type: "timestamptz" })
  reviewedAt: Date;

  // Only entities that can have a single source per row are present here
  @OneToMany("EcosystemLoss", "source")
  ecosystemLosses: EcosystemLoss[];

  @OneToMany("FeasibilityAnalysis", "source")
  feasibilityAnalysis: FeasibilityAnalysis[];

  @OneToMany("ModelComponentSourceM2M", "source")
  modelComponentSourceM2M: ModelComponentSourceM2M[];

  @OneToMany("DataCollectionAndFieldCosts", "source")
  dataCollectionAndFieldCosts: DataCollectionAndFieldCosts[];

  @OneToMany("ConservationPlanningAndAdmin", "source")
  conservationPlanningAndAdmin: ConservationPlanningAndAdmin[];

  @OneToMany("CommunityRepresentation", "source")
  communityRepresentation: CommunityRepresentation[];

  @OneToMany("CarbonRights", "source")
  carbonRights: CarbonRights[];

  @OneToMany("FinancingCost", "source")
  financingCost: FinancingCost[];

  @OneToMany("MonitoringCost", "source")
  monitoringCost: MonitoringCost[];

  @OneToMany("Maintenance", "source")
  maintenance: Maintenance[];

  @OneToMany("CommunityBenefitSharingFund", "source")
  communityBenefitSharingFund: CommunityBenefitSharingFund[];

  @OneToMany("BaselineReassessment", "source")
  baselineReassessment: BaselineReassessment[];

  @OneToMany("MRV", "source")
  mrv: MRV[];

  @OneToMany("LongTermProjectOperating", "source")
  longTermProjectOperating: LongTermProjectOperating[];

  @OneToMany("CarbonStandardFees", "source")
  carbonStandardFees: CarbonStandardFees[];
}
