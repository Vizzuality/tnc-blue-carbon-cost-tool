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
      baseData.projectSize = { sizeHa: row.project_size_ha } as ProjectSize;
      baseData.feasibilityAnalysis = {
        analysisScore: row.feasibility_analysis,
      } as FeasibilityAnalysis;
      baseData.conservationPlanningAndAdmin = {
        planningCost: row.conservation_planning_and_admin,
      } as ConservationPlanningAndAdmin;
      baseData.communityRepresentation = {
        liaisonCost: row.community_representation,
      } as CommunityRepresentation;
      baseData.carbonRights = {
        carbonRightsCost: row.establishing_carbon_rights,
      } as CarbonRights;
      baseData.financingCost = {
        financingCostCapexPercent: row.financing_cost,
      } as FinancingCost;
      baseData.validationCost = {
        validationCost: row.validation,
      } as ValidationCost;
      baseData.implementationLaborCost = {
        implementationLaborCost: row.implementation_labor_planting,
      } as ImplementationLaborCost;
      baseData.monitoringCost = {
        monitoringCost: row.monitoring,
      } as MonitoringCost;
      baseData.maintenance = {
        maintenanceCost: row.maintenance,
      } as Maintenance;
      baseData.dataCollectionAndFieldCosts = {
        fieldCost: row.data_collection_and_field_costs,
      } as DataCollectionAndFieldCosts;
      baseData.communityBenefit = {
        benefitSharingFund: row.community_benefit_sharing_fund,
      } as CommunityBenefitSharingFund;
      baseData.carbonStandardFees = {
        carbonStandardFee: row.carbon_standard_fees,
      } as CarbonStandardFees;
      baseData.communityCashFlow = {
        cashflowType: row.other_community_cash_flow,
      } as CommunityCashFlow;

      parsedArray.push(baseData);
    });

    return parsedArray;
  }

  private emptyStringToNull(value: any): any | null {
    return value || null;
  }
}
