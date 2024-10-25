import { Injectable } from '@nestjs/common';

import { BaseData } from '@shared/entities/base-data.entity';
import { Country } from '@shared/entities/country.entity';
import { BaseDataJson } from '@api/modules/import/excel-base-data.dto';
import { ProjectSize } from '@shared/entities/project-size.entity';
import { FeasibilityAnalysis } from '@shared/entities/feasability-analysis.entity';
import { ConservationPlanningAndAdmin } from '@shared/entities/conservation-and-planning-admin.entity';
import { CommunityRepresentation } from '@shared/entities/community-representation.entity';
import { CarbonRights } from '@shared/entities/establishing-carbon-rights.entity';
import { FinancingCost } from '@shared/entities/financing-cost.entity';
import { ValidationCost } from '@shared/entities/validation.entity';
import { ImplementationLaborCost } from '@shared/entities/implementation-labor.entity';
import { MonitoringCost } from '@shared/entities/monitoring.entity';
import { Maintenance } from '@shared/entities/maintenance.entity';
import { DataCollectionAndFieldCosts } from '@shared/entities/data-collection-and-field-costs.entity';
import { CommunityBenefitSharingFund } from '@shared/entities/community-benefit-sharing-fund.entity';
import { CarbonStandardFees } from '@shared/entities/carbon-standard-fees.entity';
import { CommunityCashFlow } from '@shared/entities/community-cash-flow.entity';
import { EcosystemLoss } from '@shared/entities/ecosystem-loss.entity';
import { RestorableLand } from '@shared/entities/restorable-land.entity';

export type ParsedDBEntities = {
  baseData: BaseData[];
};

@Injectable()
export class EntityPreprocessor {
  toDbEntities(raw: { rawBaseData: BaseDataJson[] }): ParsedDBEntities {
    const parsedBaseData = this.processBaseData(raw.rawBaseData);
    return {
      baseData: parsedBaseData,
    };
  }

  private processBaseData(raw: BaseDataJson[]) {
    const parsedArray: BaseData[] = [];
    raw.forEach((row: BaseDataJson) => {
      const baseData = new BaseData();

      baseData.country = { code: row.country_code } as Country;
      baseData.activity = row.activity;
      baseData.ecosystem = row.ecosystem;

      baseData.projectSize = {
        sizeHa: this.emptyStringToZero(row.project_size_ha),
      } as ProjectSize;
      baseData.feasibilityAnalysis = {
        analysisScore: this.emptyStringToZero(row.feasibility_analysis),
      } as FeasibilityAnalysis;
      baseData.conservationPlanningAndAdmin = {
        planningCost: this.emptyStringToZero(
          row.conservation_planning_and_admin,
        ),
      } as ConservationPlanningAndAdmin;
      baseData.communityRepresentation = {
        liaisonCost: this.emptyStringToZero(row.community_representation),
      } as CommunityRepresentation;
      baseData.carbonRights = {
        carbonRightsCost: this.emptyStringToZero(
          row.establishing_carbon_rights,
        ),
      } as CarbonRights;
      baseData.financingCost = {
        financingCostCapexPercent: this.emptyStringToZero(row.financing_cost),
      } as FinancingCost;
      baseData.validationCost = {
        validationCost: this.emptyStringToZero(row.validation),
      } as ValidationCost;
      baseData.implementationLaborCost = {
        implementationLaborCost: this.emptyStringToZero(
          row.implementation_labor_planting,
        ),
      } as ImplementationLaborCost;
      baseData.monitoringCost = {
        monitoringCost: this.emptyStringToZero(row.monitoring),
      } as MonitoringCost;
      baseData.maintenance = {
        maintenanceCost: this.emptyStringToZero(row.maintenance),
        maintenanceDuration: this.emptyStringToZero(row.maintenance_duration),
      } as Maintenance;
      baseData.dataCollectionAndFieldCosts = {
        fieldCost: this.emptyStringToZero(row.data_collection_and_field_costs),
      } as DataCollectionAndFieldCosts;
      baseData.communityBenefit = {
        benefitSharingFund: this.emptyStringToZero(
          row.community_benefit_sharing_fund,
        ),
      } as CommunityBenefitSharingFund;
      baseData.carbonStandardFees = {
        carbonStandardFee: this.emptyStringToZero(row.carbon_standard_fees),
      } as CarbonStandardFees;
      baseData.communityCashFlow = {
        cashflowType: this.emptyStringToNull(row.other_community_cash_flow),
      } as CommunityCashFlow;
      baseData.ecosystemLoss = {
        ecosystemLossRate: this.emptyStringToZero(row.ecosystem_loss_rate),
      } as EcosystemLoss;
      baseData.restorableLand = {
        restorableLand: this.emptyStringToZero(row.restorable_land),
      } as RestorableLand;

      parsedArray.push(baseData);
    });
    return parsedArray;
  }

  private emptyStringToNull(value: any): any | null {
    return value || null;
  }

  private emptyStringToZero(value: any): any | 0 {
    return value || 0;
  }
}
