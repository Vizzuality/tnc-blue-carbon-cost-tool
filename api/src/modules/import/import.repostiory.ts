import { ConservationAndPlanningAdminResource } from './../../../../admin/resources/conservation-and-planning-admin/conservation-and-planning-admin.resource';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseData } from '@shared/entities/base-data.entity';
import { Project } from '@shared/entities/projects.entity';
import { Country } from '@shared/entities/country.entity';
import { ProjectSize2 } from '@shared/entities/cost-inputs/project-size.entity';
import { FeasibilityAnalysis2 } from '@shared/entities/cost-inputs/feasability-analysis.entity';
import { ConservationPlanningAndAdmin2 } from '@shared/entities/cost-inputs/conservation-and-planning-admin.entity';
import { DataCollectionAndFieldCosts2 } from '@shared/entities/cost-inputs/data-collection-and-field-costs.entity';
import { CommunityRepresentation2 } from '@shared/entities/cost-inputs/community-representation.entity';
import { BlueCarbonProjectPlanning2 } from '@shared/entities/cost-inputs/blue-carbon-project-planning.entity';
import { CarbonRights2 } from '@shared/entities/cost-inputs/establishing-carbon-rights.entity';
import { FinancingCost2 } from '@shared/entities/cost-inputs/financing-cost.entity';
import { ValidationCost2 } from '@shared/entities/cost-inputs/validation.entity';
import { MonitoringCost2 } from '@shared/entities/cost-inputs/monitoring.entity';
import { Maintenance2 } from '@shared/entities/cost-inputs/maintenance.entity';
import { CommunityBenefitSharingFund2 } from '@shared/entities/cost-inputs/community-benefit-sharing-fund.entity';
import { BaselineReassessment2 } from '@shared/entities/cost-inputs/baseline-reassessment.entity';
import { MRV2 } from '@shared/entities/cost-inputs/mrv.entity';
import { LongTermProjectOperating2 } from '@shared/entities/cost-inputs/long-term-project-operating.entity';
import { CarbonStandardFees2 } from '@shared/entities/cost-inputs/carbon-standard-fees.entity';
import { CommunityCashFlow2 } from '@shared/entities/cost-inputs/community-cash-flow.entity';
import { EcosystemExtent2 } from '@shared/entities/carbon-inputs/ecosystem-extent.entity';
import { EcosystemLoss2 } from '@shared/entities/carbon-inputs/ecosystem-loss.entity';
import { RestorableLand2 } from '@shared/entities/carbon-inputs/restorable-land.entity';
import { SequestrationRate2 } from '@shared/entities/carbon-inputs/sequestration-rate.entity';
import { EmissionFactors2 } from '@shared/entities/carbon-inputs/emission-factors.entity';

@Injectable()
export class ImportRepository {
  constructor(private readonly dataSource: DataSource) {}

  async ingest(importData: {
    baseData: BaseData[];
    projects: Project[];
    projectSize: ProjectSize2[];
    feasibilityAnalysis: FeasibilityAnalysis2[];
    conservationPlanningAndAdmin: ConservationPlanningAndAdmin2[];
    dataCollectionAndFieldCosts: DataCollectionAndFieldCosts2[];
    communityRepresentation: CommunityRepresentation2[];
    blueCarbonProjectPlanning: BlueCarbonProjectPlanning2[];
    establishingCarbonRights: CarbonRights2[];
    financingCost: FinancingCost2[];
    validationCost: ValidationCost2[];
    monitoringCost: MonitoringCost2[];
    maintenanceCost: Maintenance2[];
    communityBenefit: CommunityBenefitSharingFund2[];
    baselineReassessment: BaselineReassessment2[];
    mrv: MRV2[];
    longTermProjectOperating: LongTermProjectOperating2[];
    carbonStandardFees: CarbonStandardFees2[];
    communityCashFlow: CommunityCashFlow2[];
    ecosystemExtent: EcosystemExtent2[];
    ecosystemLoss: EcosystemLoss2[];
    restorableLand: RestorableLand2[];
    sequestrationRate: SequestrationRate2[];
    emissionFactors: EmissionFactors2[];
  }) {
    return this.dataSource.transaction(async (manager) => {
      // TODO: Workaround as there are N/A country codes in the excel file
      const existingCountries = await manager
        .createQueryBuilder()
        .select('countries.code', 'countryCode')
        .from(Country, 'countries')
        .getRawMany();
      const countryFilteredBaseData: BaseData[] = [];
      existingCountries.forEach(({ countryCode }) => {
        const countryData = importData.baseData.find(
          (data) => data.country.code === countryCode,
        );
        if (countryData) {
          countryFilteredBaseData.push(countryData);
        }
      });
      await manager.save(countryFilteredBaseData);
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

      // Carbon inputs ingestion
      await manager.save(importData.ecosystemExtent);
      await manager.save(importData.ecosystemLoss);
      await manager.save(importData.restorableLand);
      await manager.save(importData.sequestrationRate);
      await manager.save(importData.emissionFactors);
    });
  }
}
