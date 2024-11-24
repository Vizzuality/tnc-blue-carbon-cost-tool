import { ExcelEstablishingCarbonRights } from './../dtos/excel-establishing-carbon-rights.dto';
import { Injectable } from '@nestjs/common';

import { Country } from '@shared/entities/country.entity';
import { Project } from '@shared/entities/projects.entity';
import { ExcelProjects } from '@api/modules/import/dtos/excel-projects.dto';
import { ExcelProjectSize } from '@api/modules/import/dtos/excel-project-size.dto';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { ExcelFeasibilityAnalysis } from '../dtos/excel-feasibility-analysis.dto';
import { ExcelConservationPlanningAndAdmin } from '../dtos/excel-conservation-planning-and-admin.dto';
import { ExcelDataCollectionAndFieldCosts } from '../dtos/excel-data-collection-field-cost.dto';
import { ExcelCommunityRepresentation } from '../dtos/excel-community-representation.dto';
import {
  BlueCarbonProjectPlanning,
  INPUT_SELECTION,
} from '@shared/entities/cost-inputs/blue-carbon-project-planning.entity';
import { ExcelBlueCarbonProjectPlanning } from '../dtos/excel-blue-carbon-project-planning.dto';
import { ExcelFinancingCost } from '../dtos/excel-financing-cost.dto';
import { ExcelValidation } from '../dtos/excel-validation.dto';
import { ExcelMonitoring } from '../dtos/excel-monitoring.dto';
import { ExcelMaintenance } from '../dtos/excel-maintenance.dto';
import { ExcelCommunityBenefitSharingFund } from '../dtos/excel-community-benefit-sharing-fund.dto';
import { ExcelBaselineReassessment } from '../dtos/excel-baseline-reassessment.dto';
import { ExcelMRV } from '../dtos/excel-mrv.dto';
import { ExcelLongTermProjectOperating } from '../dtos/excel-long-term-project-operating.dto';
import { ExcelCarbonStandardFees } from '../dtos/excel-carbon-standard-fees.dto';
import { ExcelCommunityCashFlow } from '../dtos/excel-community-cash-flow.dto';
import {
  COMMUNITY_CASH_FLOW_TYPES,
  CommunityCashFlow,
} from '@shared/entities/cost-inputs/community-cash-flow.entity';
import { ExcelEcosystemExtent } from '../dtos/excel-ecosystem-extent.dto';
import { ExcelEcosystemLoss } from '../dtos/excel-ccosystem-loss.dto';
import { ExcelRestorableLand } from '../dtos/excel-restorable-land.dto';
import { ExcelSequestrationRate } from '../dtos/excel-sequestration-rate.dto';
import {
  SEQUESTRATION_RATE_TIER_TYPES,
  SequestrationRate,
} from '@shared/entities/carbon-inputs/sequestration-rate.entity';
import {
  EMISSION_FACTORS_TIER_TYPES,
  EmissionFactors,
} from '@shared/entities/carbon-inputs/emission-factors.entity';
import { ExcelEmissionFactors } from '../dtos/excel-emission-factors.dto';
import { EcosystemExtent } from '@shared/entities/carbon-inputs/ecosystem-extent.entity';
import { EcosystemLoss } from '@shared/entities/carbon-inputs/ecosystem-loss.entity';
import { RestorableLand } from '@shared/entities/carbon-inputs/restorable-land.entity';
import { BaselineReassessment } from '@shared/entities/cost-inputs/baseline-reassessment.entity';
import { CarbonStandardFees } from '@shared/entities/cost-inputs/carbon-standard-fees.entity';
import { CommunityBenefitSharingFund } from '@shared/entities/cost-inputs/community-benefit-sharing-fund.entity';
import { CommunityRepresentation } from '@shared/entities/cost-inputs/community-representation.entity';
import { ConservationPlanningAndAdmin } from '@shared/entities/cost-inputs/conservation-and-planning-admin.entity';
import { DataCollectionAndFieldCosts } from '@shared/entities/cost-inputs/data-collection-and-field-costs.entity';
import { CarbonRights } from '@shared/entities/cost-inputs/establishing-carbon-rights.entity';
import { FeasibilityAnalysis } from '@shared/entities/cost-inputs/feasability-analysis.entity';
import { FinancingCost } from '@shared/entities/cost-inputs/financing-cost.entity';
import { LongTermProjectOperating } from '@shared/entities/cost-inputs/long-term-project-operating.entity';
import { Maintenance } from '@shared/entities/cost-inputs/maintenance.entity';
import { MonitoringCost } from '@shared/entities/cost-inputs/monitoring.entity';
import { MRV } from '@shared/entities/cost-inputs/mrv.entity';
import { ProjectSize } from '@shared/entities/cost-inputs/project-size.entity';
import { ValidationCost } from '@shared/entities/cost-inputs/validation.entity';
import { ExcelImplementationLaborCost } from '../dtos/excel-implementation-labor.dto';
import { ImplementationLaborCost } from '@shared/entities/cost-inputs/implementation-labor-cost.entity';
import { ExcelBaseSize } from '../dtos/excel-base-size.dto';
import { ExcelBaseIncrease } from '../dtos/excel-base-increase.dto';
import { ExcelModelAssumptions } from '../dtos/excel-model-assumptions.dto';
import { BaseSize } from '@shared/entities/base-size.entity';
import { BaseIncrease } from '@shared/entities/base-increase.entity';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';

export type ParsedDBEntities = {
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
};

@Injectable()
export class EntityPreprocessor {
  toDbEntities(raw: {
    Projects: ExcelProjects[];
    'Project size': ExcelProjectSize[];
    'Feasibility analysis': ExcelFeasibilityAnalysis[];
    'Conservation planning and admin': ExcelConservationPlanningAndAdmin[];
    'Data collection and field costs': ExcelDataCollectionAndFieldCosts[];
    'Community representation': ExcelCommunityRepresentation[];
    'Blue carbon project planning': ExcelBlueCarbonProjectPlanning[];
    'Establishing carbon rights': ExcelEstablishingCarbonRights[];
    'Financing cost': ExcelFinancingCost[];
    Validation: ExcelValidation[];
    Monitoring: ExcelMonitoring[];
    Maintenance: ExcelMaintenance[];
    'Community benefit sharing fund': ExcelCommunityBenefitSharingFund[];
    'Baseline reassessment': ExcelBaselineReassessment[];
    MRV: ExcelMRV[];
    'Long-term project operating': ExcelLongTermProjectOperating[];
    'Carbon standard fees': ExcelCarbonStandardFees[];
    'Community cash flow': ExcelCommunityCashFlow[];
    'Ecosystem extent': ExcelEcosystemExtent[];
    'Ecosystem loss': ExcelEcosystemLoss[];
    'Restorable land': ExcelRestorableLand[];
    'Sequestration rate': ExcelSequestrationRate[];
    'Emission factors': ExcelEmissionFactors[];
    'Implementation labor': ExcelImplementationLaborCost[];
    base_size_table: ExcelBaseSize[];
    base_increase: ExcelBaseIncrease[];
    'Model assumptions': ExcelModelAssumptions[];
  }): ParsedDBEntities {
    const processedProjects = this.processProjects(raw.Projects);

    // process cost inputs
    const projectSize = this.processProjectSize(raw['Project size']);
    const feasabilityAnalysis = this.processFeasabilityAnalysis(
      raw['Feasibility analysis'],
    );
    const conservationPlanningAndAdmin =
      this.processConservationPlanningAndAdmin(
        raw['Conservation planning and admin'],
      );
    const dataCollectionAndFieldCosts = this.processDataCollectionAndFieldCosts(
      raw['Data collection and field costs'],
    );
    const communityRepresentation = this.processCommunityRepresentation(
      raw['Community representation'],
    );
    const blueCarbonProjectPlanning = this.processBlueCarbonProjectPlanning(
      raw['Blue carbon project planning'],
    );
    const establishingCarbonRights = this.processEstablishingCarbonRights(
      raw['Establishing carbon rights'],
    );
    const financingCost = this.processFinancingCost(raw['Financing cost']);
    const validationCost = this.processValidationCost(raw['Validation']);
    const monitoringCost = this.processMonitoringCost(raw.Monitoring);
    const maintenanceCost = this.processMaintenanceCost(raw.Maintenance);
    const communityBenefit = this.processCommunityBenefit(
      raw['Community benefit sharing fund'],
    );
    const baselineReassessment = this.processBaselineReassessment(
      raw['Baseline reassessment'],
    );
    const mrv = this.processMRV(raw.MRV);
    const longTermProjectOperating = this.processLongTermProjectOperating(
      raw['Long-term project operating'],
    );
    const carbonStandardFees = this.processCarbonStandardFees(
      raw['Carbon standard fees'],
    );
    const communityCashFlow = this.processCommunityCashFlow(
      raw['Community cash flow'],
    );
    const implementationLaborCost = this.processImplementationLaborCost(
      raw['Implementation labor'],
    );

    // proess carbon inputs
    const ecosystemExtent = this.processEcosystemExtent(
      raw['Ecosystem extent'],
    );
    const ecosystemLoss = this.processEcosystemLoss(raw['Ecosystem loss']);
    const restorableLand = this.processRestorableLand(raw['Restorable land']);
    const sequestrationRate = this.processSequestrationRate(
      raw['Sequestration rate'],
    );
    const emissionFactors = this.processEmissionFactors(
      raw['Emission factors'],
    );

    // process other data
    const baseSize = this.processBaseSize(raw.base_size_table);
    const baseIncrease = this.processBaseIncrease(raw.base_increase);
    const modelAssumptions = this.processModelAssumptions(
      raw['Model assumptions'],
    );

    return {
      projects: processedProjects,
      projectSize: projectSize,
      feasibilityAnalysis: feasabilityAnalysis,
      conservationPlanningAndAdmin: conservationPlanningAndAdmin,
      dataCollectionAndFieldCosts: dataCollectionAndFieldCosts,
      communityRepresentation: communityRepresentation,
      blueCarbonProjectPlanning: blueCarbonProjectPlanning,
      establishingCarbonRights: establishingCarbonRights,
      financingCost: financingCost,
      validationCost: validationCost,
      monitoringCost: monitoringCost,
      maintenanceCost: maintenanceCost,
      communityBenefit: communityBenefit,
      baselineReassessment: baselineReassessment,
      mrv: mrv,
      longTermProjectOperating: longTermProjectOperating,
      carbonStandardFees: carbonStandardFees,
      communityCashFlow: communityCashFlow,
      ecosystemExtent: ecosystemExtent,
      ecosystemLoss: ecosystemLoss,
      restorableLand: restorableLand,
      sequestrationRate: sequestrationRate,
      emissionFactors: emissionFactors,
      implementationLaborCost: implementationLaborCost,
      baseSize: baseSize,
      baseIncrease: baseIncrease,
      modelAssumptions: modelAssumptions,
    };
  }

  private processModelAssumptions(raw: ExcelModelAssumptions[]) {
    const parsedArray: ModelAssumptions[] = [];
    raw.forEach((row: ExcelModelAssumptions) => {
      const modelAssumption = new ModelAssumptions();
      modelAssumption.name = row['Assumptions'];
      modelAssumption.unit = row['Units'];
      modelAssumption.value = row['Value'];
      parsedArray.push(modelAssumption);
    });
    return parsedArray;
  }

  private processBaseIncrease(raw: ExcelBaseIncrease[]) {
    const parsedArray: BaseIncrease[] = [];
    raw.forEach((row: ExcelBaseIncrease) => {
      const baseIncrease = new BaseIncrease();
      baseIncrease.ecosystem = row.ecosystem as ECOSYSTEM;
      baseIncrease.feasibilityAnalysis = this.stringToNumeric(
        row['feasibility_analysis'],
      );
      baseIncrease.conservationPlanningAndAdmin = this.stringToNumeric(
        row['conservation_planning_and_admin'],
      );
      baseIncrease.dataCollectionAndFieldCost = this.stringToNumeric(
        row['data_collection_and_field_cost'],
      );
      baseIncrease.communityRepresentation = this.stringToNumeric(
        row['community_representation'],
      );
      baseIncrease.blueCarbonProjectPlanning = this.stringToNumeric(
        row['blue_carbon_project_planning'],
      );
      baseIncrease.establishingCarbonRights = this.stringToNumeric(
        row['establishing_carbon_rights'],
      );
      baseIncrease.financingCost = this.stringToNumeric(row['financing_cost']);
      baseIncrease.validation = this.stringToNumeric(row['validation']);
      baseIncrease.monitoring = this.stringToNumeric(row['monitoring']);
      baseIncrease.baselineReassessment = this.stringToNumeric(
        row['baseline_reassessment'],
      );
      baseIncrease.mrv = this.stringToNumeric(row['MRV']);
      baseIncrease.longTermProjectOperatingCost = this.stringToNumeric(
        row['long_term_project_operating_cost'],
      );
      parsedArray.push(baseIncrease);
    });
    return parsedArray;
  }

  private processBaseSize(raw: ExcelBaseSize[]) {
    const parsedArray: BaseSize[] = [];
    raw.forEach((row: ExcelBaseSize) => {
      const baseSize = new BaseSize();
      baseSize.ecosystem = row.ecosystem as ECOSYSTEM;
      baseSize.activity = row.activity as ACTIVITY;
      baseSize.feasibilityAnalysis = this.stringToNumeric(
        row.feasibility_analysis,
      );
      baseSize.conservationPlanningAndAdmin = this.stringToNumeric(
        row['conservation_planning_and_admin'],
      );
      baseSize.dataCollectionAndFieldCost = this.stringToNumeric(
        row['data_collection_and_field_cost'],
      );
      baseSize.communityRepresentation = this.stringToNumeric(
        row['community_representation'],
      );
      baseSize.blueCarbonProjectPlanning = this.stringToNumeric(
        row['blue_carbon_project_planning'],
      );
      baseSize.establishingCarbonRights = this.stringToNumeric(
        row['establishing_carbon_rights'],
      );
      baseSize.financingCost = this.stringToNumeric(row['financing_cost']);
      baseSize.validation = this.stringToNumeric(row['validation']);
      baseSize.implementationLaborPlanting = this.stringToNumeric(
        row['implementation_labor_planting'],
      );
      baseSize.implementationLaborHybrid = this.stringToNumeric(
        row['implementation_labor_hybrid'],
      );
      baseSize.implementationLaborHydrology = this.stringToNumeric(
        row['implementation_labor_hydrology'],
      );
      baseSize.monitoring = this.stringToNumeric(row['monitoring']);
      baseSize.baselineReassessment = this.stringToNumeric(
        row['baseline_reassessment'],
      );
      baseSize.mrv = this.stringToNumeric(row['MRV']);
      baseSize.longTermProjectOperatingCost = this.stringToNumeric(
        row['long_term_project_operating_cost'],
      );
      parsedArray.push(baseSize);
    });
    return parsedArray;
  }

  private processImplementationLaborCost(raw: ExcelImplementationLaborCost[]) {
    const parsedArray: ImplementationLaborCost[] = [];
    raw.forEach((row: ExcelImplementationLaborCost) => {
      // mangrove implementation labor cost
      const mangroveImplementationLaborCost = new ImplementationLaborCost();
      mangroveImplementationLaborCost.ecosystem = ECOSYSTEM.MANGROVE;
      mangroveImplementationLaborCost.country = {
        code: row['Country code'],
      } as Country;
      mangroveImplementationLaborCost.plantingCost = this.stringToNumeric(
        row['Mangrove planting'],
      );
      mangroveImplementationLaborCost.hybridCost = this.stringToNumeric(
        row['Mangrove hybrid'],
      );
      mangroveImplementationLaborCost.hydrologyCost = this.stringToNumeric(
        row['Mangrove hydrology'],
      );
      parsedArray.push(mangroveImplementationLaborCost);

      // seagrass implementation labor cost
      const seagrassImplementationLaborCost = new ImplementationLaborCost();
      seagrassImplementationLaborCost.ecosystem = ECOSYSTEM.SEAGRASS;
      seagrassImplementationLaborCost.country = {
        code: row['Country code'],
      } as Country;
      seagrassImplementationLaborCost.plantingCost = this.stringToNumeric(
        row['Seagrass planting'],
      );
      seagrassImplementationLaborCost.hybridCost = this.stringToNumeric(
        row['Seagrass hybrid'],
      );
      seagrassImplementationLaborCost.hydrologyCost = this.stringToNumeric(
        row['Seagrass hydrology'],
      );
      parsedArray.push(seagrassImplementationLaborCost);

      // salt marsh implementation labor cost
      const saltMarshImplementationLaborCost = new ImplementationLaborCost();
      saltMarshImplementationLaborCost.ecosystem = ECOSYSTEM.SALT_MARSH;
      saltMarshImplementationLaborCost.country = {
        code: row['Country code'],
      } as Country;
      saltMarshImplementationLaborCost.plantingCost = this.stringToNumeric(
        row['Salt marsh planting'],
      );
      saltMarshImplementationLaborCost.hybridCost = this.stringToNumeric(
        row['Salt marsh hybrid'],
      );
      saltMarshImplementationLaborCost.hydrologyCost = this.stringToNumeric(
        row['Salt marsh hydrology'],
      );
      parsedArray.push(saltMarshImplementationLaborCost);
    });
    return parsedArray;
  }

  private processEmissionFactors(raw: ExcelEmissionFactors[]) {
    const parsedArray: EmissionFactors[] = [];
    raw.forEach((row: ExcelEmissionFactors) => {
      // mangrove emission factors
      const mangroveEmissionFactors = new EmissionFactors();
      mangroveEmissionFactors.ecosystem = ECOSYSTEM.MANGROVE;
      mangroveEmissionFactors.country = {
        code: row['Country code'],
      } as Country;
      mangroveEmissionFactors.tierSelector = row[
        'Selection (only for mangroves)'
      ] as EMISSION_FACTORS_TIER_TYPES;
      mangroveEmissionFactors.global = this.stringToNumeric(
        row['Mangrove - Tier 1 - Global emission factor'],
      );
      mangroveEmissionFactors.t2CountrySpecificAGB = this.stringToNumeric(
        row['Mangrove - Tier 2 - Country-specific emission factor - AGB'],
      );
      mangroveEmissionFactors.t2CountrySpecificSOC = this.stringToNumeric(
        row['Mangrove - Tier 2 - Country-specific emission factor - SOC'],
      );
      parsedArray.push(mangroveEmissionFactors);

      // seagrass emission factors
      const seagrassEmissionFactors = new EmissionFactors();
      seagrassEmissionFactors.ecosystem = ECOSYSTEM.SEAGRASS;
      seagrassEmissionFactors.country = {
        code: row['Country code'],
      } as Country;
      seagrassEmissionFactors.tierSelector = row[
        'Selection (only for seagrass)'
      ] as EMISSION_FACTORS_TIER_TYPES;
      seagrassEmissionFactors.global = this.stringToNumeric(
        row['Seagrass - Tier 1 - Global emission factor'],
      );
      seagrassEmissionFactors.t2CountrySpecificAGB = this.stringToNumeric(
        row['Seagrass - Tier 2 - Country-specific emission factor - AGB'],
      );
      seagrassEmissionFactors.t2CountrySpecificSOC = this.stringToNumeric(
        row['Seagrass - Tier 2 - Country-specific emission factor - SOC'],
      );
      parsedArray.push(seagrassEmissionFactors);

      // salt marsh emission factors
      const saltMarshEmissionFactors = new EmissionFactors();
      saltMarshEmissionFactors.ecosystem = ECOSYSTEM.SALT_MARSH;
      saltMarshEmissionFactors.country = {
        code: row['Country code'],
      } as Country;
      saltMarshEmissionFactors.tierSelector = row[
        'Selection (only for salt marsh)'
      ] as EMISSION_FACTORS_TIER_TYPES;
      saltMarshEmissionFactors.global = this.stringToNumeric(
        row['Salt marsh - Tier 1 - Global emission factor'],
      );
      saltMarshEmissionFactors.t2CountrySpecificAGB = this.stringToNumeric(
        row['Salt marsh - Tier 2 - Country-specific emission factor - AGB'],
      );
      saltMarshEmissionFactors.t2CountrySpecificSOC = this.stringToNumeric(
        row['Salt marsh - Tier 2 - Country-specific emission factor - SOC'],
      );
      parsedArray.push(saltMarshEmissionFactors);
    });
    return parsedArray;
  }

  private processSequestrationRate(raw: ExcelSequestrationRate[]) {
    const parsedArray: SequestrationRate[] = [];
    raw.forEach((row: ExcelSequestrationRate) => {
      // mangrove sequestration rate
      const mangroveSequestrationRate = new SequestrationRate();
      mangroveSequestrationRate.ecosystem = ECOSYSTEM.MANGROVE;
      mangroveSequestrationRate.country = {
        code: row['Country code'],
      } as Country;
      mangroveSequestrationRate.tierSelector = row[
        'Input used (mangrove only)'
      ] as SEQUESTRATION_RATE_TIER_TYPES;
      mangroveSequestrationRate.tier1Factor = this.stringToNumeric(
        row['Mangrove Tier 1 - IPCC default value'],
      );
      mangroveSequestrationRate.tier2Factor = this.stringToNumeric(
        row['Mangrove Tier 2 - country-specific rate'],
      );
      parsedArray.push(mangroveSequestrationRate);

      // seagrass sequestration rate
      const seagrassSequestrationRate = new SequestrationRate();
      seagrassSequestrationRate.ecosystem = ECOSYSTEM.SEAGRASS;
      seagrassSequestrationRate.country = {
        code: row['Country code'],
      } as Country;
      seagrassSequestrationRate.tierSelector = row[
        'Input used (seagrass only)'
      ] as SEQUESTRATION_RATE_TIER_TYPES;
      seagrassSequestrationRate.tier1Factor = this.stringToNumeric(
        row['Seagrass Tier 1 - IPCC default value'],
      );
      seagrassSequestrationRate.tier2Factor = this.stringToNumeric(
        row['Seagrass Tier 2 - country-specific rate'],
      );
      parsedArray.push(seagrassSequestrationRate);

      // salt marsh sequestration rate
      const saltMarshSequestrationRate = new SequestrationRate();
      saltMarshSequestrationRate.ecosystem = ECOSYSTEM.SALT_MARSH;
      saltMarshSequestrationRate.country = {
        code: row['Country code'],
      } as Country;
      saltMarshSequestrationRate.tierSelector = row[
        'Input used (salt marsh only)'
      ] as SEQUESTRATION_RATE_TIER_TYPES;
      saltMarshSequestrationRate.tier1Factor = this.stringToNumeric(
        row['Salt marsh Tier 1 - IPCC default value'],
      );
      saltMarshSequestrationRate.tier2Factor = this.stringToNumeric(
        row['Salt marsh Tier 2 - country-specific rate'],
      );
      parsedArray.push(saltMarshSequestrationRate);
    });
    return parsedArray;
  }

  private processRestorableLand(raw: ExcelRestorableLand[]) {
    const parsedArray: RestorableLand[] = [];
    raw.forEach((row: ExcelRestorableLand) => {
      // mangrove restorable land
      const mangroveRestorableLand = new RestorableLand();
      mangroveRestorableLand.ecosystem = ECOSYSTEM.MANGROVE;
      mangroveRestorableLand.country = {
        code: row['Country code'],
      } as Country;
      mangroveRestorableLand.restorableLand = this.stringToNumeric(
        row['Mangrove restorable land'],
      );
      parsedArray.push(mangroveRestorableLand);

      // seagrass restorable land
      const seagrassRestorableLand = new RestorableLand();
      seagrassRestorableLand.ecosystem = ECOSYSTEM.SEAGRASS;
      seagrassRestorableLand.country = {
        code: row['Country code'],
      } as Country;
      seagrassRestorableLand.restorableLand = this.stringToNumeric(
        row['Seagrass restorable land'],
      );
      parsedArray.push(seagrassRestorableLand);

      // salt marsh restorable land
      const saltMarshRestorableLand = new RestorableLand();
      saltMarshRestorableLand.ecosystem = ECOSYSTEM.SALT_MARSH;
      saltMarshRestorableLand.country = {
        code: row['Country code'],
      } as Country;
      saltMarshRestorableLand.restorableLand = this.stringToNumeric(
        row['Salt marsh restorable land'],
      );
      parsedArray.push(saltMarshRestorableLand);
    });
    return parsedArray;
  }

  private processEcosystemLoss(raw: ExcelEcosystemLoss[]) {
    const parsedArray: EcosystemLoss[] = [];
    raw.forEach((row: ExcelEcosystemLoss) => {
      // mangrove ecosystem loss
      const mangroveEcosystemLoss = new EcosystemLoss();
      mangroveEcosystemLoss.ecosystem = ECOSYSTEM.MANGROVE;
      mangroveEcosystemLoss.country = {
        code: row['Country code'],
      } as Country;
      mangroveEcosystemLoss.ecosystemLossRate = this.percentToNumber(
        row['Mangrove loss rate'],
      );
      parsedArray.push(mangroveEcosystemLoss);

      // seagrass ecosystem loss
      const seagrassEcosystemLoss = new EcosystemLoss();
      seagrassEcosystemLoss.ecosystem = ECOSYSTEM.SEAGRASS;
      seagrassEcosystemLoss.country = {
        code: row['Country code'],
      } as Country;
      seagrassEcosystemLoss.ecosystemLossRate = this.percentToNumber(
        row['Seagrass loss rate'],
      );
      parsedArray.push(seagrassEcosystemLoss);

      // salt marsh ecosystem loss
      const saltMarshEcosystemLoss = new EcosystemLoss();
      saltMarshEcosystemLoss.ecosystem = ECOSYSTEM.SALT_MARSH;
      saltMarshEcosystemLoss.country = {
        code: row['Country code'],
      } as Country;
      saltMarshEcosystemLoss.ecosystemLossRate = this.percentToNumber(
        row['Salt marsh loss rate'],
      );
      parsedArray.push(saltMarshEcosystemLoss);
    });
    return parsedArray;
  }

  private processEcosystemExtent(raw: ExcelEcosystemExtent[]) {
    const parsedArray: EcosystemExtent[] = [];
    raw.forEach((row: ExcelEcosystemExtent) => {
      // mangrove ecosystem extent
      const mangroveEcosystemExtent = new EcosystemExtent();
      mangroveEcosystemExtent.ecosystem = ECOSYSTEM.MANGROVE;
      mangroveEcosystemExtent.country = {
        code: row['Country code'],
      } as Country;
      mangroveEcosystemExtent.extent = this.stringToNumeric(
        row[' Mangrove extent'],
      );
      mangroveEcosystemExtent.historicExtent = this.stringToNumeric(
        row[' Mangrove extent historic'],
      );
      parsedArray.push(mangroveEcosystemExtent);

      // seagrass ecosystem extent
      const seagrassEcosystemExtent = new EcosystemExtent();
      seagrassEcosystemExtent.ecosystem = ECOSYSTEM.SEAGRASS;
      seagrassEcosystemExtent.country = {
        code: row['Country code'],
      } as Country;
      seagrassEcosystemExtent.extent = this.stringToNumeric(
        row[' Seagrass extent'],
      );
      seagrassEcosystemExtent.historicExtent = this.stringToNumeric(
        row[' Seagrass extent historic'],
      );
      parsedArray.push(seagrassEcosystemExtent);

      // salt marsh ecosystem extent
      const saltMarshEcosystemExtent = new EcosystemExtent();
      saltMarshEcosystemExtent.ecosystem = ECOSYSTEM.SALT_MARSH;
      saltMarshEcosystemExtent.country = {
        code: row['Country code'],
      } as Country;
      saltMarshEcosystemExtent.extent = this.stringToNumeric(
        row[' Salt marsh extent'],
      );
      saltMarshEcosystemExtent.historicExtent = this.stringToNumeric(
        row['Salt marsh extent historic'],
      );
      parsedArray.push(saltMarshEcosystemExtent);
    });
    return parsedArray;
  }

  private processCommunityCashFlow(raw: ExcelCommunityCashFlow[]) {
    const parsedArray: CommunityCashFlow[] = [];
    raw.forEach((row: ExcelCommunityCashFlow) => {
      const communityCashFlow = new CommunityCashFlow();
      communityCashFlow.country = {
        code: row['Country code'],
      } as Country;
      communityCashFlow.cashflowType = this.emptyStringToNull(
        row['Other community cash flow'],
      ) as COMMUNITY_CASH_FLOW_TYPES;
      parsedArray.push(communityCashFlow);
    });
    return parsedArray;
  }

  private processCarbonStandardFees(raw: ExcelCarbonStandardFees[]) {
    const parsedArray: CarbonStandardFees[] = [];
    raw.forEach((row: ExcelCarbonStandardFees) => {
      const carbonStandardFees = new CarbonStandardFees();
      carbonStandardFees.country = {
        code: row['Country code'],
      } as Country;
      carbonStandardFees.carbonStandardFee = this.stringToNumeric(
        row['Carbon standard fees'],
      );
      parsedArray.push(carbonStandardFees);
    });
    return parsedArray;
  }

  private processLongTermProjectOperating(
    raw: ExcelLongTermProjectOperating[],
  ) {
    const parsedArray: LongTermProjectOperating[] = [];
    raw.forEach((row: ExcelLongTermProjectOperating) => {
      // mangrove long term project operating
      const mangroveLongTermProjectOperating = new LongTermProjectOperating();
      mangroveLongTermProjectOperating.ecosystem = ECOSYSTEM.MANGROVE;
      mangroveLongTermProjectOperating.country = {
        code: row['Country code'],
      } as Country;
      mangroveLongTermProjectOperating.longTermProjectOperatingCost =
        this.emptyStringToZero(row['Mangrove long-term project operating']);
      parsedArray.push(mangroveLongTermProjectOperating);

      // seagrass long term project operating
      const seagrassLongTermProjectOperating = new LongTermProjectOperating();
      seagrassLongTermProjectOperating.ecosystem = ECOSYSTEM.SEAGRASS;
      seagrassLongTermProjectOperating.country = {
        code: row['Country code'],
      } as Country;
      seagrassLongTermProjectOperating.longTermProjectOperatingCost =
        this.emptyStringToZero(row['Seagrass long-term project operating']);
      parsedArray.push(seagrassLongTermProjectOperating);

      // salt marsh long term project operating
      const saltMarshLongTermProjectOperating = new LongTermProjectOperating();
      saltMarshLongTermProjectOperating.ecosystem = ECOSYSTEM.SALT_MARSH;
      saltMarshLongTermProjectOperating.country = {
        code: row['Country code'],
      } as Country;
      saltMarshLongTermProjectOperating.longTermProjectOperatingCost =
        this.emptyStringToZero(row['Salt marsh long-term project operating']);
      parsedArray.push(saltMarshLongTermProjectOperating);
    });
    return parsedArray;
  }

  private processMRV(raw: ExcelMRV[]) {
    const parsedArray: MRV[] = [];
    raw.forEach((row: ExcelMRV) => {
      const mrv = new MRV();
      mrv.country = {
        code: row['Country code'],
      } as Country;
      mrv.mrvCost = this.emptyStringToZero(row.MRV);
      parsedArray.push(mrv);
    });
    return parsedArray;
  }

  private processBaselineReassessment(raw: ExcelBaselineReassessment[]) {
    const parsedArray: BaselineReassessment[] = [];
    raw.forEach((row: ExcelBaselineReassessment) => {
      const baselineReassessment = new BaselineReassessment();
      baselineReassessment.country = {
        code: row['Country code'],
      } as Country;
      baselineReassessment.baselineReassessmentCost = this.emptyStringToZero(
        row['Baseline reassessment'],
      );
      parsedArray.push(baselineReassessment);
    });
    return parsedArray;
  }

  private processCommunityBenefit(raw: ExcelCommunityBenefitSharingFund[]) {
    const parsedArray: CommunityBenefitSharingFund[] = [];
    raw.forEach((row: ExcelCommunityBenefitSharingFund) => {
      const communityBenefit = new CommunityBenefitSharingFund();
      communityBenefit.country = {
        code: row['Country code'],
      } as Country;
      communityBenefit.communityBenefitSharingFund = this.percentToNumber(
        row['Community benefit sharing fund'],
      );
      parsedArray.push(communityBenefit);
    });
    return parsedArray;
  }

  private processMaintenanceCost(raw: ExcelMaintenance[]) {
    const parsedArray: Maintenance[] = [];
    raw.forEach((row: ExcelMaintenance) => {
      const maintenanceCost = new Maintenance();
      maintenanceCost.country = {
        code: row['Country code'],
      } as Country;
      maintenanceCost.maintenanceCost = this.percentToNumber(
        row['Maintenance'],
      );
      maintenanceCost.maintenanceDuration = this.emptyStringToZero(
        row['Maintenance duration'],
      );
      parsedArray.push(maintenanceCost);
    });
    return parsedArray;
  }

  private processMonitoringCost(raw: ExcelMonitoring[]) {
    const parsedArray: MonitoringCost[] = [];
    raw.forEach((row: ExcelMonitoring) => {
      // mangrove monitoring
      const mangroveMonitoring = new MonitoringCost();
      mangroveMonitoring.ecosystem = ECOSYSTEM.MANGROVE;
      mangroveMonitoring.country = {
        code: row['Country code'],
      } as Country;
      mangroveMonitoring.monitoringCost = this.emptyStringToZero(
        row['Mangrove monitoring'],
      );
      parsedArray.push(mangroveMonitoring);

      // seagrass monitoring
      const seagrassMonitoring = new MonitoringCost();
      seagrassMonitoring.ecosystem = ECOSYSTEM.SEAGRASS;
      seagrassMonitoring.country = {
        code: row['Country code'],
      } as Country;
      seagrassMonitoring.monitoringCost = this.emptyStringToZero(
        row['Seagrass monitoring'],
      );
      parsedArray.push(seagrassMonitoring);

      // salt marsh monitoring
      const saltMarshMonitoring = new MonitoringCost();
      saltMarshMonitoring.ecosystem = ECOSYSTEM.SALT_MARSH;
      saltMarshMonitoring.country = {
        code: row['Country code'],
      } as Country;
      saltMarshMonitoring.monitoringCost = this.emptyStringToZero(
        row['Salt marsh monitoring'],
      );
      parsedArray.push(saltMarshMonitoring);
    });
    return parsedArray;
  }

  private processValidationCost(raw: ExcelValidation[]) {
    const parsedArray: ValidationCost[] = [];
    raw.forEach((row: ExcelValidation) => {
      const validationCost = new ValidationCost();
      validationCost.country = {
        code: row['Country code'],
      } as Country;
      validationCost.validationCost = this.emptyStringToZero(row['Validation']);
      parsedArray.push(validationCost);
    });
    return parsedArray;
  }

  private processFinancingCost(raw: ExcelFinancingCost[]) {
    const parsedArray: FinancingCost[] = [];
    raw.forEach((row: ExcelFinancingCost) => {
      const financingCost = new FinancingCost();
      financingCost.country = {
        code: row['Country code'],
      } as Country;
      financingCost.financingCostCapexPercent = this.percentToNumber(
        row['Financing cost'],
      );
      parsedArray.push(financingCost);
    });
    return parsedArray;
  }

  private processEstablishingCarbonRights(
    raw: ExcelEstablishingCarbonRights[],
  ) {
    const parsedArray: CarbonRights[] = [];
    raw.forEach((row: ExcelEstablishingCarbonRights) => {
      const carbonRights = new CarbonRights();
      carbonRights.country = {
        code: row['Country code'],
      } as Country;
      carbonRights.carbonRightsCost = this.emptyStringToZero(
        row['Establishing carbon rights'],
      );
      parsedArray.push(carbonRights);
    });
    return parsedArray;
  }

  private processBlueCarbonProjectPlanning(
    raw: ExcelBlueCarbonProjectPlanning[],
  ) {
    const parsedArray: BlueCarbonProjectPlanning[] = [];
    raw.forEach((row: ExcelBlueCarbonProjectPlanning) => {
      const blueCarbonProjectPlanning = new BlueCarbonProjectPlanning();
      blueCarbonProjectPlanning.country = {
        code: row['Country code'],
      } as Country;
      blueCarbonProjectPlanning.inputSelection = this.emptyStringToNull(
        row['Input selection'],
      ) as INPUT_SELECTION;
      blueCarbonProjectPlanning.input1 = this.emptyStringToZero(row['Input 1']);
      blueCarbonProjectPlanning.input2 = this.emptyStringToZero(row['Input 2']);
      blueCarbonProjectPlanning.input3 = this.emptyStringToZero(row['Input 3']);
      parsedArray.push(blueCarbonProjectPlanning);
    });

    return parsedArray;
  }

  private processCommunityRepresentation(raw: ExcelCommunityRepresentation[]) {
    const parsedArray: CommunityRepresentation[] = [];
    raw.forEach((row: ExcelCommunityRepresentation) => {
      // mangrove community representation
      const mangroveCommunityRepresentation = new CommunityRepresentation();
      mangroveCommunityRepresentation.ecosystem = ECOSYSTEM.MANGROVE;
      mangroveCommunityRepresentation.country = {
        code: row['Country code'],
      } as Country;
      mangroveCommunityRepresentation.liaisonCost = this.emptyStringToZero(
        row['Mangrove community representation / liaison'],
      );
      parsedArray.push(mangroveCommunityRepresentation);

      // seagrass community representation
      const seagrassCommunityRepresentation = new CommunityRepresentation();
      seagrassCommunityRepresentation.ecosystem = ECOSYSTEM.SEAGRASS;
      seagrassCommunityRepresentation.country = {
        code: row['Country code'],
      } as Country;
      seagrassCommunityRepresentation.liaisonCost = this.emptyStringToZero(
        row['Seagrass Community representation / liaison'],
      );
      parsedArray.push(seagrassCommunityRepresentation);

      // salt marsh community representation
      const saltMarshCommunityRepresentation = new CommunityRepresentation();
      saltMarshCommunityRepresentation.ecosystem = ECOSYSTEM.SALT_MARSH;
      saltMarshCommunityRepresentation.country = {
        code: row['Country code'],
      } as Country;
      saltMarshCommunityRepresentation.liaisonCost = this.emptyStringToZero(
        row['Salt marsh Community representation / liaison'],
      );
      parsedArray.push(saltMarshCommunityRepresentation);
    });
    return parsedArray;
  }

  private processDataCollectionAndFieldCosts(
    raw: ExcelDataCollectionAndFieldCosts[],
  ) {
    const parsedArray: DataCollectionAndFieldCosts[] = [];
    raw.forEach((row: ExcelDataCollectionAndFieldCosts) => {
      // mangrove data collection and field costs
      const mangroveDataCollectionAndFieldCosts =
        new DataCollectionAndFieldCosts();
      mangroveDataCollectionAndFieldCosts.ecosystem = ECOSYSTEM.MANGROVE;
      mangroveDataCollectionAndFieldCosts.country = {
        code: row['Country code'],
      } as Country;
      mangroveDataCollectionAndFieldCosts.fieldCost = this.emptyStringToZero(
        row['Mangrove data collection and field costs'],
      );
      parsedArray.push(mangroveDataCollectionAndFieldCosts);

      // seagrass data collection and field costs
      const seagrassDataCollectionAndFieldCosts =
        new DataCollectionAndFieldCosts();
      seagrassDataCollectionAndFieldCosts.ecosystem = ECOSYSTEM.SEAGRASS;
      seagrassDataCollectionAndFieldCosts.country = {
        code: row['Country code'],
      } as Country;
      seagrassDataCollectionAndFieldCosts.fieldCost = this.emptyStringToZero(
        row['Seagrass data collection and field costs'],
      );
      parsedArray.push(seagrassDataCollectionAndFieldCosts);

      // salt marsh data collection and field costs
      const saltMarshDataCollectionAndFieldCosts =
        new DataCollectionAndFieldCosts();
      saltMarshDataCollectionAndFieldCosts.ecosystem = ECOSYSTEM.SALT_MARSH;
      saltMarshDataCollectionAndFieldCosts.country = {
        code: row['Country code'],
      } as Country;
      saltMarshDataCollectionAndFieldCosts.fieldCost = this.emptyStringToZero(
        row['Salt marsh data collection and field costs'],
      );
      parsedArray.push(saltMarshDataCollectionAndFieldCosts);
    });
    return parsedArray;
  }

  private processConservationPlanningAndAdmin(
    raw: ExcelConservationPlanningAndAdmin[],
  ) {
    const parsedArray: ConservationPlanningAndAdmin[] = [];
    raw.forEach((row: ExcelConservationPlanningAndAdmin) => {
      // mangrove conservation planning and admin
      const mangroveConservationPlanningAndAdmin =
        new ConservationPlanningAndAdmin();
      mangroveConservationPlanningAndAdmin.ecosystem = ECOSYSTEM.MANGROVE;
      mangroveConservationPlanningAndAdmin.country = {
        code: row['Country code'],
      } as Country;
      mangroveConservationPlanningAndAdmin.planningCost =
        this.emptyStringToZero(row['Mangrove conservation planning and admin']);
      parsedArray.push(mangroveConservationPlanningAndAdmin);

      // seagrass conservation planning and admin
      const seagrassConservationPlanningAndAdmin =
        new ConservationPlanningAndAdmin();
      seagrassConservationPlanningAndAdmin.ecosystem = ECOSYSTEM.SEAGRASS;
      seagrassConservationPlanningAndAdmin.country = {
        code: row['Country code'],
      } as Country;
      seagrassConservationPlanningAndAdmin.planningCost =
        this.emptyStringToZero(row['Seagrass conservation planning and admin']);
      parsedArray.push(seagrassConservationPlanningAndAdmin);

      // salt marsh conservation planning and admin
      const saltMarshConservationPlanningAndAdmin =
        new ConservationPlanningAndAdmin();
      saltMarshConservationPlanningAndAdmin.ecosystem = ECOSYSTEM.SALT_MARSH;
      saltMarshConservationPlanningAndAdmin.country = {
        code: row['Country code'],
      } as Country;
      saltMarshConservationPlanningAndAdmin.planningCost =
        this.emptyStringToZero(
          row['Salt marsh conservation planning and admin'],
        );
      parsedArray.push(saltMarshConservationPlanningAndAdmin);
    });
    return parsedArray;
  }

  private processFeasabilityAnalysis(raw: ExcelFeasibilityAnalysis[]) {
    const parsedArray: FeasibilityAnalysis[] = [];
    raw.forEach((row: ExcelFeasibilityAnalysis) => {
      // mangrove feasibility analysis
      const mangroveFeasibilityAnalysis = new FeasibilityAnalysis();
      mangroveFeasibilityAnalysis.ecosystem = ECOSYSTEM.MANGROVE;
      mangroveFeasibilityAnalysis.country = {
        code: row['Country code'],
      } as Country;
      mangroveFeasibilityAnalysis.analysisCost = this.emptyStringToZero(
        row['Mangrove feasibility analysis'],
      );
      parsedArray.push(mangroveFeasibilityAnalysis);

      // seagrass feasibility
      const seagrassFeasibilityAnalysis = new FeasibilityAnalysis();
      seagrassFeasibilityAnalysis.ecosystem = ECOSYSTEM.SEAGRASS;
      seagrassFeasibilityAnalysis.country = {
        code: row['Country code'],
      } as Country;
      seagrassFeasibilityAnalysis.analysisCost = this.emptyStringToZero(
        row['Seagrass feasibility analysis'],
      );
      parsedArray.push(seagrassFeasibilityAnalysis);

      // salt marsh feasibility
      const saltMarshFeasibilityAnalysis = new FeasibilityAnalysis();
      saltMarshFeasibilityAnalysis.ecosystem = ECOSYSTEM.SALT_MARSH;
      saltMarshFeasibilityAnalysis.country = {
        code: row['Country code'],
      } as Country;
      saltMarshFeasibilityAnalysis.analysisCost = this.emptyStringToZero(
        row['Salt marsh feasibility analysis'],
      );
      parsedArray.push(saltMarshFeasibilityAnalysis);
    });

    return parsedArray;
  }

  private processProjectSize(raw: ExcelProjectSize[]) {
    const parsedArray: ProjectSize[] = [];
    raw.forEach((row: ExcelProjectSize) => {
      // mangrove restored
      const mangroveRestoredArea = new ProjectSize();
      mangroveRestoredArea.activity = ACTIVITY.RESTORATION;
      mangroveRestoredArea.ecosystem = ECOSYSTEM.MANGROVE;
      mangroveRestoredArea.country = { code: row['Country code'] } as Country;
      mangroveRestoredArea.sizeHa = this.emptyStringToZero(
        row['Mangrove restored area'],
      );
      parsedArray.push(mangroveRestoredArea);

      // mangrove conserved
      const mangroveConservedArea = new ProjectSize();
      mangroveConservedArea.activity = ACTIVITY.CONSERVATION;
      mangroveConservedArea.ecosystem = ECOSYSTEM.MANGROVE;
      mangroveConservedArea.country = { code: row['Country code'] } as Country;
      mangroveConservedArea.sizeHa = this.emptyStringToZero(
        row['Mangrove conserved area'],
      );
      parsedArray.push(mangroveConservedArea);

      // seagrass restored
      const seagrassRestoredArea = new ProjectSize();
      seagrassRestoredArea.activity = ACTIVITY.RESTORATION;
      seagrassRestoredArea.ecosystem = ECOSYSTEM.SEAGRASS;
      seagrassRestoredArea.country = { code: row['Country code'] } as Country;
      seagrassRestoredArea.sizeHa = this.emptyStringToZero(
        row['Seagrass restored area'],
      );
      parsedArray.push(seagrassRestoredArea);

      // seagrass conserved
      const seagrassConservedArea = new ProjectSize();
      seagrassConservedArea.activity = ACTIVITY.CONSERVATION;
      seagrassConservedArea.ecosystem = ECOSYSTEM.SEAGRASS;
      seagrassConservedArea.country = { code: row['Country code'] } as Country;
      seagrassConservedArea.sizeHa = this.emptyStringToZero(
        row['Seagrass conserved area'],
      );
      parsedArray.push(seagrassConservedArea);

      // salt marsh restored
      const saltMarshRestoredArea = new ProjectSize();
      saltMarshRestoredArea.activity = ACTIVITY.RESTORATION;
      saltMarshRestoredArea.ecosystem = ECOSYSTEM.SALT_MARSH;
      saltMarshRestoredArea.country = { code: row['Country code'] } as Country;
      saltMarshRestoredArea.sizeHa = this.emptyStringToZero(
        row['Salt marsh restored area'],
      );
      parsedArray.push(saltMarshRestoredArea);

      // salt marsh conserved
      const saltMarshConservedArea = new ProjectSize();
      saltMarshConservedArea.activity = ACTIVITY.CONSERVATION;
      saltMarshConservedArea.ecosystem = ECOSYSTEM.SALT_MARSH;
      saltMarshConservedArea.country = { code: row['Country code'] } as Country;
      saltMarshConservedArea.sizeHa = this.emptyStringToZero(
        row['Salt marsh conserved area'],
      );
      parsedArray.push(saltMarshConservedArea);
    });
    return parsedArray;
  }

  private processProjects(raw: ExcelProjects[]) {
    const parsedArray: Project[] = [];
    raw.forEach((row: ExcelProjects) => {
      const project = new Project();
      project.projectName = row.project_name;
      project.countryCode = row.country_code;
      project.ecosystem = row.ecosystem;
      project.activity = row.activity;
      project.restorationActivity = row.activity_type;
      project.projectSize = row.project_size_ha;
      project.projectSizeFilter = row.project_size_filter;
      project.abatementPotential = row.abatement_potential;
      project.totalCostNPV = row.total_cost_npv;
      project.totalCost = row.total_cost;
      // TODO: This has dissapeared from the excel file and it is required for filtering, setting a fake value for now
      //project.costPerTCO2eNPV = row['$/tCO2e (NPV)'];
      project.costPerTCO2eNPV = row.cost_per_tco2e;
      project.costPerTCO2e = row.cost_per_tco2e;
      project.initialPriceAssumption = row.initial_price_assumption;
      project.priceType = row.price_type;

      parsedArray.push(project);
    });
    return parsedArray;
  }

  private emptyStringToNull(value: any): any | null {
    return value || null;
  }

  private emptyStringToZero(value: any): any | 0 {
    return value || 0;
  }

  private percentToNumber(value: any, defaultReturn: number = 0): number {
    return value ? parseFloat(value) : defaultReturn;
  }

  private stringToNumeric(value: any): number {
    return value ? parseFloat(value) : 0;
  }
}
