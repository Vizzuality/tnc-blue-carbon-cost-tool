import { ExcelEstablishingCarbonRights } from './../dtos/excel-establishing-carbon-rights.dto';
import { Injectable } from '@nestjs/common';
import { Country } from '@shared/entities/country.entity';
import { Project } from '@shared/entities/projects.entity';
import { ExcelProject } from '@api/modules/import/dtos/excel-projects.dto';
import { ExcelProjectSize } from '@api/modules/import/dtos/excel-project-size.dto';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { ExcelFeasibilityAnalysis } from '../dtos/excel-feasibility-analysis.dto';
import { ExcelConservationPlanningAndAdmin } from '../dtos/excel-conservation-planning-and-admin.dto';
import { ExcelDataCollectionAndFieldCosts } from '../dtos/excel-data-collection-field-cost.dto';
import { ExcelCommunityRepresentation } from '../dtos/excel-community-representation.dto';
import { BlueCarbonProjectPlanning } from '@shared/entities/cost-inputs/blue-carbon-project-planning.entity';
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
import { SequestrationRate } from '@shared/entities/carbon-inputs/sequestration-rate.entity';
import { EmissionFactors } from '@shared/entities/carbon-inputs/emission-factors.entity';
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
import { ProjectScorecard } from '@shared/entities/project-scorecard.entity';
import { ExcelProjectScorecard } from '../dtos/excel-projects-scorecard.dto ';
import { PROJECT_SCORE } from '@shared/entities/project-score.enum';
import { ProjectScoreUtils } from '@shared/entities/project-score.utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RawDataIngestionData } from '@api/modules/import/parser/raw-data-ingestion.type';
import { ModelComponentSource } from '@shared/entities/methodology/model-component-source.entity';
import { ExcelModelComponentSource } from '@api/modules/import/dtos/excel-model-component-source.dto';
import {
  ParsedEntities,
  RecordSource,
  RecordWithSources,
} from '@api/modules/import/services/parsed-db-entities.type';

export class ProjectScoreCardNotFoundError extends Error {
  constructor(projectName: string) {
    super(`Project scorecard for project ${projectName} not found.`);
  }
}

@Injectable()
export class EntityPreprocessor {
  constructor(
    @InjectRepository(ProjectScorecard)
    private readonly projectScoreCardRepository: Repository<ProjectScorecard>,
  ) {}

  toProjectScorecardDbEntries(raw: unknown): ProjectScorecard[] {
    return this.processProjectScorecard(raw['Data_ingestion']);
  }

  public async toDbEntities(
    raw: RawDataIngestionData,
  ): Promise<ParsedEntities> {
    const modelComponentSources = this.processModelComponentSources(
      raw['Sources table'],
    );
    const processedProjects = await this.processProjects(raw.Projects);

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
    const baseSize = this.processBaseSize(raw['Base_size_table']);
    const baseIncrease = this.processBaseIncrease(raw['Base_increase']);
    const modelAssumptions = this.processModelAssumptions(
      raw['Model assumptions'],
    );

    return {
      modelComponentSources: {
        entity: ModelComponentSource,
        records: modelComponentSources,
      },
      projects: { entity: Project, records: processedProjects },
      projectSize: { entity: ProjectSize, records: projectSize },
      feasibilityAnalysis: {
        entity: FeasibilityAnalysis,
        records: feasabilityAnalysis,
      },
      conservationPlanningAndAdmin: {
        entity: ConservationPlanningAndAdmin,
        records: conservationPlanningAndAdmin,
      },
      dataCollectionAndFieldCosts: {
        entity: DataCollectionAndFieldCosts,
        records: dataCollectionAndFieldCosts,
      },
      communityRepresentation: {
        entity: CommunityRepresentation,
        records: communityRepresentation,
      },
      blueCarbonProjectPlanning: {
        entity: BlueCarbonProjectPlanning,
        records: blueCarbonProjectPlanning,
      },
      establishingCarbonRights: {
        entity: CarbonRights,
        records: establishingCarbonRights,
      },
      financingCost: { entity: FinancingCost, records: financingCost },
      validationCost: { entity: ValidationCost, records: validationCost },
      monitoringCost: { entity: MonitoringCost, records: monitoringCost },
      maintenanceCost: { entity: Maintenance, records: maintenanceCost },
      communityBenefit: {
        entity: CommunityBenefitSharingFund,
        records: communityBenefit,
      },
      baselineReassessment: {
        entity: BaselineReassessment,
        records: baselineReassessment,
      },
      mrv: { entity: MRV, records: mrv },
      longTermProjectOperating: {
        entity: LongTermProjectOperating,
        records: longTermProjectOperating,
      },
      carbonStandardFees: {
        entity: CarbonStandardFees,
        records: carbonStandardFees,
      },
      communityCashFlow: {
        entity: CommunityCashFlow,
        records: communityCashFlow,
      },
      ecosystemExtent: {
        entity: EcosystemExtent,
        records: ecosystemExtent,
      },
      ecosystemLoss: {
        entity: EcosystemLoss,
        records: ecosystemLoss,
      },
      restorableLand: {
        entity: RestorableLand,
        records: restorableLand,
      },
      sequestrationRate: {
        entity: SequestrationRate,
        records: sequestrationRate,
      },
      emissionFactors: {
        entity: EmissionFactors,
        records: emissionFactors,
      },
      implementationLaborCost: {
        entity: ImplementationLaborCost,
        records: implementationLaborCost,
      },
      baseSize: { entity: BaseSize, records: baseSize },
      baseIncrease: {
        entity: BaseIncrease,
        records: baseIncrease,
      },
      modelAssumptions: {
        entity: ModelAssumptions,
        records: modelAssumptions,
      },
    };
  }

  private processModelComponentSources(
    raw: ExcelModelComponentSource[],
  ): ModelComponentSource[] {
    return raw.map((rawSource) => {
      const source = new ModelComponentSource();
      source.name = rawSource['Source'];
      const reviewedAt = new Date(rawSource['Reviewed']);
      source.reviewedAt = Number.isNaN(reviewedAt.getTime())
        ? undefined
        : reviewedAt;
      return source;
    });
  }

  private processModelAssumptions(raw: ExcelModelAssumptions[]) {
    const parsedArray: ModelAssumptions[] = [];
    raw.forEach((row: ExcelModelAssumptions) => {
      const modelAssumption = new ModelAssumptions();
      modelAssumption.name = row['Assumptions'];
      modelAssumption.unit = row['Units'];
      modelAssumption.value = row['Value'];
      const sourceName = row['Source'];
      if (sourceName !== undefined) {
        modelAssumption.source = { name: sourceName } as ModelComponentSource;
      }
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
    const parsedArray: RecordWithSources<ImplementationLaborCost>[] = [];
    for (const row of raw) {
      const implementationLaborCost =
        new ImplementationLaborCost() as RecordWithSources<ImplementationLaborCost>;
      implementationLaborCost.country = {
        code: row['Country code'],
      } as Country;
      implementationLaborCost.ecosystem = row.Ecosystem as ECOSYSTEM;
      implementationLaborCost.plantingCost = this.stringToNumeric(
        row['Planting cost'],
      );
      implementationLaborCost.hybridCost = this.stringToNumeric(
        row['Hybrid cost'],
      );
      implementationLaborCost.hydrologyCost = this.stringToNumeric(
        row['Hydrology cost'],
      );

      implementationLaborCost.sources = [];
      const plantingSource = row['Source planting'];
      const hybridSource = row['Source hybrid'];
      const hydrologySource = row['Source hydrology'];
      if (plantingSource !== undefined) {
        implementationLaborCost.sources.push({
          fieldName: 'plantingCost',
          sourceName: plantingSource,
        });
      }
      if (hybridSource !== undefined) {
        implementationLaborCost.sources.push({
          fieldName: 'hybridCost',
          sourceName: hybridSource,
        });
      }
      if (hydrologySource !== undefined) {
        implementationLaborCost.sources.push({
          fieldName: 'hydrologyCost',
          sourceName: hydrologySource,
        });
      }
      parsedArray.push(implementationLaborCost);
    }
    return parsedArray;
  }

  private processEmissionFactors(raw: ExcelEmissionFactors[]) {
    const parsedArray: RecordWithSources<EmissionFactors>[] = [];
    for (const row of raw) {
      // mangrove emission factors
      const emissionFactors =
        new EmissionFactors() as RecordWithSources<EmissionFactors>;
      emissionFactors.ecosystem = row['Ecosystem'] as ECOSYSTEM;
      emissionFactors.country = {
        code: row['Country code'],
      } as Country;
      emissionFactors.global = this.stringToNumeric(
        row['Tier 1 - Global emission factor'],
      );
      emissionFactors.AGB = this.stringToNumeric(
        row['Tier 2 - Country-specific emission factor - AGB'],
      );
      emissionFactors.SOC = this.stringToNumeric(
        row['Tier 2 - Country-specific emission factor - SOC'],
      );
      const sources: RecordSource[] = [];
      const sourceGlobal = row['Source - Tier 1 - Global emission factor'];
      const sourceAGB =
        row['Source - Tier 2 - Country-specific emission factor - AGB'];
      const sourceSOC =
        row['Source - Tier 2 - Country-specific emission factor - SOC'];
      if (sourceGlobal !== undefined) {
        sources.push({ fieldName: 'global', sourceName: sourceGlobal });
      }
      if (sourceAGB !== undefined) {
        sources.push({ fieldName: 'AGB', sourceName: sourceAGB });
      }
      if (sourceSOC !== undefined) {
        sources.push({ fieldName: 'SOC', sourceName: sourceSOC });
      }
      emissionFactors.sources = sources;
      parsedArray.push(emissionFactors);
    }
    return parsedArray;
  }

  private processSequestrationRate(raw: ExcelSequestrationRate[]) {
    const parsedArray: RecordWithSources<SequestrationRate>[] = [];
    for (const row of raw) {
      const sequestrationRate =
        new SequestrationRate() as RecordWithSources<SequestrationRate>;
      sequestrationRate.country = {
        code: row['Country code'],
      } as Country;
      sequestrationRate.ecosystem = row.Ecosystem as ECOSYSTEM;
      sequestrationRate.tier1Factor = this.stringToNumeric(
        row['Tier 1 - IPCC default value'],
      );
      sequestrationRate.tier2Factor = this.stringToNumeric(
        row['Tier 2 - country-specific rate'],
      );
      const sources: RecordSource[] = [];
      const sourceTier1 = row['Source - Tier 1 - IPCC default value'];
      const sourceTier2 = row['Source - Tier 2 - country-specific rate'];
      if (sourceTier1 !== undefined) {
        sources.push({ fieldName: 'tier1Factor', sourceName: sourceTier1 });
      }
      if (sourceTier2 !== undefined) {
        sources.push({ fieldName: 'tier2Factor', sourceName: sourceTier2 });
      }
      sequestrationRate.sources = sources;
      parsedArray.push(sequestrationRate);
    }
    return parsedArray;
  }

  private processRestorableLand(raw: ExcelRestorableLand[]) {
    const parsedArray: RestorableLand[] = [];
    for (const row of raw) {
      const restorableLand = new RestorableLand();
      restorableLand.country = {
        code: row['Country code'],
      } as Country;
      restorableLand.ecosystem = row.Ecosystem as ECOSYSTEM;
      const restorableLandValue = this.stringToNumeric(row['Restorable land']);
      if (Number.isNaN(restorableLandValue) === false) {
        restorableLand.restorableLand = restorableLandValue;
      }
      const sourceName = row.Source;
      if (sourceName !== undefined) {
        restorableLand.source = {
          name: row.Source,
        } as ModelComponentSource;
      }
      parsedArray.push(restorableLand);
    }
    return parsedArray;
  }

  private processEcosystemLoss(raw: ExcelEcosystemLoss[]) {
    const parsedArray: EcosystemLoss[] = [];
    for (const row of raw) {
      const ecosystemLoss = new EcosystemLoss();
      ecosystemLoss.country = {
        code: row['Country code'],
      } as Country;
      ecosystemLoss.ecosystem = row.Ecosystem as ECOSYSTEM;
      const lossRate = this.percentToNumber(row['Loss rate']);
      if (Number.isNaN(lossRate) === false) {
        ecosystemLoss.ecosystemLossRate = this.percentToNumber(
          row['Loss rate'],
        );
      }
      const sourceName = row.Source;
      if (sourceName !== undefined) {
        ecosystemLoss.source = {
          name: row.Source,
        } as ModelComponentSource;
      }
      parsedArray.push(ecosystemLoss);
    }
    return parsedArray;
  }

  private processEcosystemExtent(raw: ExcelEcosystemExtent[]) {
    const parsedArray: RecordWithSources<EcosystemExtent>[] = [];
    raw.forEach((row: ExcelEcosystemExtent) => {
      // mangrove ecosystem extent
      const ecosystemExtent =
        new EcosystemExtent() as RecordWithSources<EcosystemExtent>;
      ecosystemExtent.country = {
        code: row['Country code'],
      } as Country;
      ecosystemExtent.ecosystem = row['Ecosystem'] as ECOSYSTEM;
      ecosystemExtent.extent = this.stringToNumeric(row['Extent']);
      ecosystemExtent.historicExtent = this.stringToNumeric(
        row['Extent historic'],
      );
      ecosystemExtent.unprotectedExtent = this.stringToNumeric(
        row['Unprotected extent'],
      );

      const sources: RecordSource[] = [];
      const sourceExtent = row['Source extent'];
      const sourceExtentHistoric = row['Source extent historic'];
      const sourceUnprotectedExtent = row['Source unprotected extent'];
      if (sourceExtent !== undefined) {
        sources.push({ fieldName: 'extent', sourceName: sourceExtent });
      }
      if (sourceExtentHistoric !== undefined) {
        sources.push({
          fieldName: 'historicExtent',
          sourceName: sourceExtentHistoric,
        });
      }
      if (sourceUnprotectedExtent !== undefined) {
        sources.push({
          fieldName: 'unprotectedExtent',
          sourceName: sourceUnprotectedExtent,
        });
      }
      ecosystemExtent.sources = sources;
      parsedArray.push(ecosystemExtent);
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
      const sourceName = row['Source'];
      if (sourceName !== undefined) {
        communityCashFlow.source = {
          name: sourceName,
        } as ModelComponentSource;
      }
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
      const sourceName = row['Source'];
      if (sourceName !== undefined) {
        carbonStandardFees.source = {
          name: row['Source'],
        } as ModelComponentSource;
      }
      parsedArray.push(carbonStandardFees);
    });
    return parsedArray;
  }

  private processLongTermProjectOperating(
    raw: ExcelLongTermProjectOperating[],
  ) {
    const parsedArray: LongTermProjectOperating[] = [];
    for (const row of raw) {
      const longTermProjectOperating = new LongTermProjectOperating();
      longTermProjectOperating.country = {
        code: row['Country code'],
      } as Country;
      longTermProjectOperating.ecosystem = row.Ecosystem as ECOSYSTEM;
      longTermProjectOperating.longTermProjectOperatingCost =
        this.stringToNumeric(row['Long-term project operating cost']);
      const sourceName = row.Source;
      if (sourceName !== undefined) {
        longTermProjectOperating.source = {
          name: row.Source,
        } as ModelComponentSource;
      }
      parsedArray.push(longTermProjectOperating);
    }
    return parsedArray;
  }

  private processMRV(raw: ExcelMRV[]) {
    const parsedArray: MRV[] = [];
    raw.forEach((row: ExcelMRV) => {
      const mrv = new MRV();
      mrv.country = {
        code: row['Country code'],
      } as Country;
      mrv.mrvCost = this.emptyStringToZero(row['MRV cost']);
      const sourceName = row.Source;
      if (sourceName !== undefined) {
        mrv.source = {
          name: row.Source,
        } as ModelComponentSource;
      }
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
        row['Baseline reassessment cost'],
      );
      const sourceName = row.Source;
      if (sourceName !== undefined) {
        baselineReassessment.source = {
          name: row.Source,
        } as ModelComponentSource;
      }
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
        row['Community benefit sharing fund cost'],
      );
      const sourceName = row.Source;
      if (sourceName !== undefined) {
        communityBenefit.source = {
          name: row.Source,
        } as ModelComponentSource;
      }
      parsedArray.push(communityBenefit);
    });
    return parsedArray;
  }

  private processMaintenanceCost(raw: ExcelMaintenance[]) {
    const parsedArray: RecordWithSources<Maintenance>[] = [];
    raw.forEach((row: ExcelMaintenance) => {
      const maintenanceCost =
        new Maintenance() as RecordWithSources<Maintenance>;
      maintenanceCost.country = {
        code: row['Country code'],
      } as Country;
      maintenanceCost.maintenanceCost = this.percentToNumber(
        row['Maintenance'],
      );
      maintenanceCost.maintenanceDuration = this.emptyStringToZero(
        row['Maintenance duration'],
      );
      maintenanceCost.sources = [];
      const maintenanceSource = row['Source maintenance'];
      const maintenanceDurationSource = row['Source maintenance duration'];
      if (maintenanceSource !== undefined) {
        maintenanceCost.sources.push({
          fieldName: 'maintenanceCost',
          sourceName: maintenanceSource,
        });
      }
      if (maintenanceDurationSource) {
        maintenanceCost.sources.push({
          fieldName: 'maintenanceDuration',
          sourceName: maintenanceDurationSource,
        });
      }
      parsedArray.push(maintenanceCost);
    });
    return parsedArray;
  }

  private processMonitoringCost(raw: ExcelMonitoring[]) {
    const parsedArray: MonitoringCost[] = [];
    for (const row of raw) {
      const monitoringCost = new MonitoringCost();
      monitoringCost.country = {
        code: row['Country code'],
      } as Country;
      monitoringCost.ecosystem = row.Ecosystem as ECOSYSTEM;
      monitoringCost.monitoringCost = this.emptyStringToZero(
        row['Monitoring cost'],
      );
      const sourceName = row.Source;
      if (sourceName !== undefined) {
        monitoringCost.source = {
          name: row.Source,
        } as ModelComponentSource;
      }
      parsedArray.push(monitoringCost);
    }
    return parsedArray;
  }

  private processValidationCost(raw: ExcelValidation[]) {
    const parsedArray: ValidationCost[] = [];
    raw.forEach((row: ExcelValidation) => {
      const validationCost = new ValidationCost();
      validationCost.country = {
        code: row['Country code'],
      } as Country;
      validationCost.validationCost = this.emptyStringToZero(
        row['Validation cost'],
      );
      const sourceName = row.Source;
      if (sourceName !== undefined) {
        validationCost.source = {
          name: row.Source,
        } as ModelComponentSource;
      }
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
      const sourceName = row.Source;
      if (sourceName !== undefined) {
        financingCost.source = {
          name: row.Source,
        } as ModelComponentSource;
      }
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
      const sourceName = row.Source;
      if (sourceName !== undefined) {
        carbonRights.source = {
          name: row.Source,
        } as ModelComponentSource;
      }
      parsedArray.push(carbonRights);
    });
    return parsedArray;
  }

  private processBlueCarbonProjectPlanning(
    raw: ExcelBlueCarbonProjectPlanning[],
  ) {
    const parsedArray: BlueCarbonProjectPlanning[] = [];
    for (const row of raw) {
      const blueCarbonProjectPlanning = new BlueCarbonProjectPlanning();
      blueCarbonProjectPlanning.country = {
        code: row['Country code'],
      } as Country;
      blueCarbonProjectPlanning.planningCost = this.emptyStringToZero(
        row['Blue carbon project planning cost'],
      );
      const sourceName = row.Source;
      if (sourceName !== undefined) {
        blueCarbonProjectPlanning.source = {
          name: row.Source,
        } as ModelComponentSource;
      }
      parsedArray.push(blueCarbonProjectPlanning);
    }
    return parsedArray;
  }

  private processCommunityRepresentation(raw: ExcelCommunityRepresentation[]) {
    const parsedArray: CommunityRepresentation[] = [];
    for (const row of raw) {
      const communityRepresentation = new CommunityRepresentation();
      communityRepresentation.ecosystem = row.Ecosystem as ECOSYSTEM;
      communityRepresentation.country = {
        code: row['Country code'],
      } as Country;
      communityRepresentation.liaisonCost = this.emptyStringToZero(
        row['Community representation / liaison cost'],
      );
      const sourceName = row.Source;
      if (sourceName !== undefined) {
        communityRepresentation.source = {
          name: row.Source,
        } as ModelComponentSource;
      }
      parsedArray.push(communityRepresentation);
    }
    return parsedArray;
  }

  private processDataCollectionAndFieldCosts(
    raw: ExcelDataCollectionAndFieldCosts[],
  ) {
    const parsedArray: DataCollectionAndFieldCosts[] = [];
    for (const row of raw) {
      const dataCollectionAndFieldCosts = new DataCollectionAndFieldCosts();
      dataCollectionAndFieldCosts.ecosystem = row.Ecosystem as ECOSYSTEM;
      dataCollectionAndFieldCosts.country = {
        code: row['Country code'],
      } as Country;
      dataCollectionAndFieldCosts.fieldCost = this.emptyStringToZero(
        row['Data collection and field cost'],
      );
      const sourceName = row.Source;
      if (sourceName !== undefined) {
        dataCollectionAndFieldCosts.source = {
          name: row.Source,
        } as ModelComponentSource;
      }
      parsedArray.push(dataCollectionAndFieldCosts);
    }
    return parsedArray;
  }

  private processConservationPlanningAndAdmin(
    raw: ExcelConservationPlanningAndAdmin[],
  ) {
    const parsedArray: ConservationPlanningAndAdmin[] = [];
    for (const row of raw) {
      const conservationPlanningAndAdmin = new ConservationPlanningAndAdmin();
      conservationPlanningAndAdmin.country = {
        code: row['Country code'],
      } as Country;
      conservationPlanningAndAdmin.ecosystem = row.Ecosystem as ECOSYSTEM;
      conservationPlanningAndAdmin.activity = row.Activity as ACTIVITY;
      conservationPlanningAndAdmin.planningCost = this.emptyStringToZero(
        row['Planning and admin cost'],
      );
      const sourceName = row.Source;
      if (sourceName !== undefined) {
        conservationPlanningAndAdmin.source = {
          name: row.Source,
        } as ModelComponentSource;
      }
      parsedArray.push(conservationPlanningAndAdmin);
    }
    return parsedArray;
  }

  private processFeasabilityAnalysis(raw: ExcelFeasibilityAnalysis[]) {
    const parsedArray: FeasibilityAnalysis[] = [];

    for (const row of raw) {
      const feasibilityAnalysis = new FeasibilityAnalysis();
      feasibilityAnalysis.ecosystem = row.Ecosystem as ECOSYSTEM;
      feasibilityAnalysis.country = {
        code: row['Country code'],
      } as Country;
      feasibilityAnalysis.analysisCost = this.emptyStringToZero(
        row['Feasibility Analysis Cost'],
      );
      const sourceName = row.Source;
      if (sourceName !== undefined) {
        feasibilityAnalysis.source = {
          name: row.Source,
        } as ModelComponentSource;
      }
      parsedArray.push(feasibilityAnalysis);
    }

    return parsedArray;
  }

  private processProjectSize(raw: ExcelProjectSize[]) {
    const parsedArray: ProjectSize[] = [];
    for (const row of raw) {
      const projectSize = new ProjectSize();
      projectSize.ecosystem = row.Ecosystem as ECOSYSTEM;
      projectSize.activity = row.Activity;
      projectSize.country = {
        code: row['Country code'],
      } as Country;
      projectSize.sizeHa = this.stringToNumeric(row['Size Ha']);
      parsedArray.push(projectSize);
    }
    return parsedArray;
  }

  private async processProjects(raw: ExcelProject[]) {
    return await Promise.all(
      raw.map(async (row: ExcelProject) => {
        const projectName = row.project_name;
        const ecosystem = row.ecosystem;
        const country_code = row.country_code;

        const projectScoreCard =
          await this.projectScoreCardRepository.findOneBy({
            countryCode: country_code,
            ecosystem,
          });
        if (projectScoreCard === null) {
          throw new ProjectScoreCardNotFoundError(projectName);
        }
        const scoreCardRating =
          ProjectScoreUtils.computeProjectScoreCardRating(projectScoreCard);

        const project = new Project();
        project.projectName = projectName;
        project.countryCode = country_code;
        project.ecosystem = ecosystem;
        project.activity = row.activity;
        project.restorationActivity = row.activity_type;
        project.projectSize = row.project_size_ha;
        project.projectSizeFilter = row.project_size_filter;
        project.abatementPotential = row.abatement_potential;
        project.opexNPV = row.opex_npv;
        project.opex = row.opex;
        project.capexNPV = row.capex_npv;
        project.capex = row.capex;
        project.totalCostNPV = row.total_cost_npv;
        project.totalCost = row.total_cost;
        project.costPerTCO2eNPV = row.cost_per_tco2e_npv;
        project.costPerTCO2e = row.cost_per_tco2e;
        project.initialPriceAssumption = row.initial_price_assumption;
        project.priceType = row.price_type;
        project.feasibilityAnalysisNPV = row.feasibility_analysis_npv;
        project.feasibilityAnalysis = row.feasibility_analysis;
        project.conservationPlanningNPV = row.conservation_planning_npv;
        project.conservationPlanning = row.conservation_planning;
        project.dataCollectionNPV = row.data_collection_npv;
        project.dataCollection = row.data_collection;
        project.communityRepresentationNPV = row.community_representation_npv;
        project.communityRepresentation = row.community_representation;
        project.blueCarbonProjectPlanningNPV =
          row.blue_carbon_project_planning_npv;
        project.blueCarbonProjectPlanning = row.blue_carbon_project_planning;
        project.establishingCarbonRightsNPV =
          row.establishing_carbon_rights_npv;
        project.establishingCarbonRights = row.establishing_carbon_rights;
        project.validationNPV = row.validation_npv;
        project.validation = row.validation;
        project.implementationLaborNPV = row.implementation_labor_npv;
        project.implementationLabor = row.implementation_labor;
        project.monitoringNPV = row.monitoring_npv;
        project.maintenanceNPV = row.maintenance_npv;
        project.monitoring = row.monitoring;
        project.maintenance = row.maintenance;
        project.monitoringMaintenanceNPV = row.monitoring_maintenance_npv;
        project.monitoringMaintenance = row.monitoring_maintenance;
        project.communityBenefitNPV = row.community_benefit_npv;
        project.communityBenefit = row.community_benefit;
        project.carbonStandardFeesNPV = row.carbon_standard_fees_npv;
        project.carbonStandardFees = row.carbon_standard_fees;
        project.baselineReassessmentNPV = row.baseline_reassessment_npv;
        project.baselineReassessment = row.baseline_reassessment;
        project.mrvNPV = row.mrv_npv;
        project.mrv = row.mrv;
        project.longTermProjectOperatingNPV =
          row.long_term_project_operating_npv;
        project.longTermProjectOperating = row.long_term_project_operating;
        project.leftoverAfterOpex = row.leftover_after_opex;
        project.leftoverAfterOpexNPV = row.leftover_after_opex_NPV;
        project.totalRevenue = row.total_revenue;
        project.totalRevenueNPV = row.total_revenu_npv;
        project.creditsIssued = row.credits_issued;
        project.scoreCardRating = scoreCardRating;
        return project;
      }),
    );
  }

  private processProjectScorecard(raw: ExcelProjectScorecard[]) {
    const parsedArray: ProjectScorecard[] = [];
    raw.forEach((row: ExcelProjectScorecard) => {
      const projectScorecard = new ProjectScorecard();
      projectScorecard.countryCode = row.country_code;
      projectScorecard.ecosystem = row.ecosystem;
      projectScorecard.financialFeasibility = PROJECT_SCORE.LOW;
      projectScorecard.legalFeasibility = this.convertNumberToProjectScore(
        row.legal_feasibility,
      );

      projectScorecard.implementationFeasibility =
        this.convertNumberToProjectScore(row.implementation_risk_score);

      projectScorecard.socialFeasibility = this.convertNumberToProjectScore(
        row.social_feasibility,
      );

      projectScorecard.securityRating = this.convertNumberToProjectScore(
        row.security_rating,
      );

      projectScorecard.availabilityOfExperiencedLabor =
        this.convertNumberToProjectScore(row.availability_of_experienced_labor);

      projectScorecard.availabilityOfAlternatingFunding =
        this.convertNumberToProjectScore(
          row.availability_of_alternative_funding,
        );

      projectScorecard.coastalProtectionBenefits =
        this.convertNumberToProjectScore(row.coastal_protection_benefit);
      projectScorecard.biodiversityBenefit = this.convertNumberToProjectScore(
        row.biodiversity_benefit,
      );

      parsedArray.push(projectScorecard);
    });

    return parsedArray;
  }

  private convertNumberToProjectScore(value: number): PROJECT_SCORE {
    if (value === 1) {
      return PROJECT_SCORE.LOW;
    }
    if (value === 2) {
      return PROJECT_SCORE.MEDIUM;
    }
    if (value === 3) {
      return PROJECT_SCORE.HIGH;
    }
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
