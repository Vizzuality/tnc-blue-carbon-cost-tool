import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Project } from '@shared/entities/projects.entity';
import { ProjectSize } from '@shared/entities/cost-inputs/project-size.entity';
import { FeasibilityAnalysis } from '@shared/entities/cost-inputs/feasability-analysis.entity';
import { EcosystemExtent } from '@shared/entities/carbon-inputs/ecosystem-extent.entity';
import { EcosystemLoss } from '@shared/entities/carbon-inputs/ecosystem-loss.entity';
import { EmissionFactors } from '@shared/entities/carbon-inputs/emission-factors.entity';
import { RestorableLand } from '@shared/entities/carbon-inputs/restorable-land.entity';
import { SequestrationRate } from '@shared/entities/carbon-inputs/sequestration-rate.entity';
import { BaselineReassessment } from '@shared/entities/cost-inputs/baseline-reassessment.entity';
import { BlueCarbonProjectPlanning } from '@shared/entities/cost-inputs/blue-carbon-project-planning.entity';
import { CarbonStandardFees } from '@shared/entities/cost-inputs/carbon-standard-fees.entity';
import { CommunityBenefitSharingFund } from '@shared/entities/cost-inputs/community-benefit-sharing-fund.entity';
import { CommunityCashFlow } from '@shared/entities/cost-inputs/community-cash-flow.entity';
import { CommunityRepresentation } from '@shared/entities/cost-inputs/community-representation.entity';
import { ConservationPlanningAndAdmin } from '@shared/entities/cost-inputs/conservation-and-planning-admin.entity';
import { DataCollectionAndFieldCosts } from '@shared/entities/cost-inputs/data-collection-and-field-costs.entity';
import { CarbonRights } from '@shared/entities/cost-inputs/establishing-carbon-rights.entity';
import { FinancingCost } from '@shared/entities/cost-inputs/financing-cost.entity';
import { LongTermProjectOperating } from '@shared/entities/cost-inputs/long-term-project-operating.entity';
import { Maintenance } from '@shared/entities/cost-inputs/maintenance.entity';
import { MonitoringCost } from '@shared/entities/cost-inputs/monitoring.entity';
import { MRV } from '@shared/entities/cost-inputs/mrv.entity';
import { ValidationCost } from '@shared/entities/cost-inputs/validation.entity';
import { ImplementationLaborCost } from '@shared/entities/cost-inputs/implementation-labor-cost.entity';
import { BaseIncrease } from '@shared/entities/base-increase.entity';
import { BaseSize } from '@shared/entities/base-size.entity';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
import { ProjectScorecard } from '@shared/entities/project-scorecard.entity';

@Injectable()
export class ImportRepository {
  constructor(private readonly dataSource: DataSource) {}

  async importProjectScorecard(projectScorecards: ProjectScorecard[]) {
    return this.dataSource.transaction(async (manager) => {
      await manager.save(projectScorecards);
    });
  }

  async ingest(importData: {
    projects: Project[];
    projectSize: ProjectSize[];
    feasibilityAnalysis: FeasibilityAnalysis[];
    conservationPlanningAndAdmin: ConservationPlanningAndAdmin[];
    dataCollectionAndFieldCosts: DataCollectionAndFieldCosts[];
    communityRepresentation: CommunityRepresentation[];
    blueCarbonProjectPlanning: BlueCarbonProjectPlanning[];
    establishingCarbonRights: CarbonRights[];
    financingCost: FinancingCost[];
    validationCost: ValidationCost[];
    monitoringCost: MonitoringCost[];
    maintenanceCost: Maintenance[];
    communityBenefit: CommunityBenefitSharingFund[];
    baselineReassessment: BaselineReassessment[];
    mrv: MRV[];
    longTermProjectOperating: LongTermProjectOperating[];
    carbonStandardFees: CarbonStandardFees[];
    communityCashFlow: CommunityCashFlow[];
    ecosystemExtent: EcosystemExtent[];
    ecosystemLoss: EcosystemLoss[];
    restorableLand: RestorableLand[];
    sequestrationRate: SequestrationRate[];
    emissionFactors: EmissionFactors[];
    implementationLaborCost: ImplementationLaborCost[];
    baseSize: BaseSize[];
    baseIncrease: BaseIncrease[];
    modelAssumptions: ModelAssumptions[];
  }) {
    return this.dataSource.transaction(async (manager) => {
      await manager.save(importData.projects);

      // Cost inputs ingestion
      await manager.save(importData.projectSize);
      await manager.save(importData.feasibilityAnalysis);
      await manager.save(importData.conservationPlanningAndAdmin);
      await manager.save(importData.dataCollectionAndFieldCosts);
      await manager.save(importData.communityRepresentation);
      await manager.save(importData.blueCarbonProjectPlanning);
      await manager.save(importData.establishingCarbonRights);
      await manager.save(importData.financingCost);
      await manager.save(importData.validationCost);
      await manager.save(importData.monitoringCost);
      await manager.save(importData.maintenanceCost);
      await manager.save(importData.communityBenefit);
      await manager.save(importData.baselineReassessment);
      await manager.save(importData.mrv);
      await manager.save(importData.longTermProjectOperating);
      await manager.save(importData.carbonStandardFees);
      await manager.save(importData.communityCashFlow);
      await manager.save(importData.implementationLaborCost);

      // Carbon inputs ingestion
      await manager.save(importData.ecosystemExtent);
      await manager.save(importData.ecosystemLoss);
      await manager.save(importData.restorableLand);
      await manager.save(importData.sequestrationRate);
      await manager.save(importData.emissionFactors);

      // Other tables ingestion
      await manager.save(importData.baseSize);
      await manager.save(importData.baseIncrease);
      await manager.save(importData.modelAssumptions);
    });
  }
}
