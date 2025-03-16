import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Project } from '@shared/entities/projects.entity';
import { ProjectSize } from '@shared/entities/cost-inputs/project-size.entity';
import { FeasibilityAnalysis } from '@shared/entities/cost-inputs/feasability-analysis.entity';
import { EcosystemExtent } from '@shared/entities/carbon-inputs/ecosystem-extent.entity';
import { EcosystemLoss } from '@shared/entities/carbon-inputs/ecosystem-loss.entity';
import {
  EMISSION_FACTORS_TIER_TYPES,
  EmissionFactors,
} from '@shared/entities/carbon-inputs/emission-factors.entity';
import { RestorableLand } from '@shared/entities/carbon-inputs/restorable-land.entity';
import {
  SEQUESTRATION_RATE_TIER_TYPES,
  SequestrationRate,
} from '@shared/entities/carbon-inputs/sequestration-rate.entity';
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
import { ModelComponentSource } from '@shared/entities/methodology/model-component-source.entity';
import {
  ParsedEntities,
  ParsedEntitiesWithSources,
  ParsedEntity,
} from '@api/modules/import/services/parsed-db-entities.type';
import { MethodologySourcesConfig } from '@shared/config/methodology.config';
import { ModelComponentSourceM2M } from '@shared/entities/methodology/model-source-m2m.entity';
import { CustomProjectFactory } from '@api/modules/custom-projects/input-factory/custom-project.factory';
import { CalculationEngine } from '@api/modules/calculations/calculation.engine';
import { DataRepository } from '@api/modules/calculations/data.repository';
import { CreateCustomProjectDto } from '@shared/dtos/custom-projects/create-custom-project.dto';
import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from '@shared/entities/activity.enum';
import {
  CARBON_REVENUES_TO_COVER,
  PROJECT_SPECIFIC_EMISSION,
} from '@shared/entities/custom-project.entity';
import { LOSS_RATE_USED } from '@shared/schemas/custom-projects/create-custom-project.schema';

const DEFAULT_ASSUMPTIONS = {
  baselineReassessmentFrequency: 10,
  buffer: 0.2,
  carbonPriceIncrease: 0.015,
  discountRate: 0.04,
  projectLength: 20,
  verificationFrequency: 5,
  // restorationRate: 250, // This was missing and causing the calculator to return NaN in restoration projects. What is the real value?
};

const DEFAULT_CONSERVATION_PARAMS = {
  lossRateUsed: LOSS_RATE_USED.PROJECT_SPECIFIC,
  projectSpecificEmission: PROJECT_SPECIFIC_EMISSION.ONE_EMISSION_FACTOR,
  projectSpecificEmissionFactor: 15,
  projectSpecificLossRate: -0.003,
  emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_1,
  emissionFactorAGB: 200,
  emissionFactorSOC: 15,
};

const DEFAULT_RESTORATION_PARAMS = {
  plantingSuccessRate: 0.008,
  projectSpecificSequestrationRate: 15,
  restorationActivity: RESTORATION_ACTIVITY_SUBTYPE.PLANTING,
  tierSelector: SEQUESTRATION_RATE_TIER_TYPES.TIER_1,
};

type ClassifiedEntities = {
  withoutSources: Partial<ParsedEntities>;
  with1nSources: Partial<ParsedEntities>;
  withM2mSources: Partial<ParsedEntities>;
};

@Injectable()
export class ImportRepository {
  constructor(
    private readonly dataSource: DataSource,
    private readonly dataRepository: DataRepository,
    private readonly customProjectFactory: CustomProjectFactory,
    private readonly calculationEngine: CalculationEngine,
  ) {}
  async importProjectScorecard(projectScorecards: ProjectScorecard[]) {
    return this.dataSource.transaction('READ COMMITTED', async (manager) => {
      // Wipe current project scorecards
      await manager.clear(ProjectScorecard);

      // Insert
      await manager.save(projectScorecards);
    });
  }

  public async ingest(parsedEntities: ParsedEntities) {
    // Workaround as I could not make the ingestion work as an atomic operation and we need to unlock other tasks
    const projects = parsedEntities.projects;
    delete parsedEntities.projects;

    await this.dataSource.transaction('READ COMMITTED', async (manager) => {
      // DATA WIPE STARTS
      await manager.clear(Project);
      await manager.clear(ProjectSize);
      await manager.clear(FeasibilityAnalysis);
      await manager.clear(ConservationPlanningAndAdmin);
      await manager.clear(DataCollectionAndFieldCosts);
      await manager.clear(CommunityRepresentation);
      await manager.clear(BlueCarbonProjectPlanning);
      await manager.clear(CarbonRights);
      await manager.clear(FinancingCost);
      await manager.clear(ValidationCost);
      await manager.clear(MonitoringCost);
      await manager.clear(Maintenance);
      await manager.clear(CommunityBenefitSharingFund);
      await manager.clear(BaselineReassessment);
      await manager.clear(MRV);
      await manager.clear(LongTermProjectOperating);
      await manager.clear(CarbonStandardFees);
      await manager.clear(CommunityCashFlow);
      await manager.clear(ImplementationLaborCost);

      // Carbon inputs ingestion
      await manager.clear(EcosystemExtent);
      await manager.clear(EcosystemLoss);
      await manager.clear(RestorableLand);
      await manager.clear(SequestrationRate);
      await manager.delete(EmissionFactors, {});

      // Other tables ingestion
      await manager.clear(BaseSize);
      await manager.clear(BaseIncrease);
      await manager.clear(ModelAssumptions);
      await manager.delete(ModelComponentSource, {});
      // DATA WIPE ENDS

      // CREATION STARTS
      const modelComponentSources = await manager.save(
        parsedEntities.modelComponentSources.records,
      );

      const entitiesWithSources = MethodologySourcesConfig.map(
        (entityConfig) => entityConfig.entity,
      );

      // delete parsedEntities.projects;
      delete parsedEntities.modelComponentSources;

      const classifiedEntities = Object.keys(parsedEntities).reduce(
        (acc, key) => {
          if (
            entitiesWithSources.includes(parsedEntities[key].entity) === false
          ) {
            acc.withoutSources[key] = parsedEntities[key];
            return acc;
          }

          const entityConfig = MethodologySourcesConfig.find(
            (entry) => entry.entity === parsedEntities[key].entity,
          )!;
          if (entityConfig.relationshipType === '1n') {
            acc.with1nSources[key] = parsedEntities[key];
          } else if (entityConfig.relationshipType === 'm2m') {
            acc.withM2mSources[key] = parsedEntities[key];
          }

          return acc;
        },
        {
          withoutSources: {},
          with1nSources: {},
          withM2mSources: {},
        } as ClassifiedEntities,
      );
      await this.saveParsedEntities(manager, classifiedEntities.withoutSources);

      const m2mEntitiesWithIds = await this.saveParsedEntities(
        manager,
        classifiedEntities.withM2mSources,
      );

      const parsedEntitiesWithSources = this.addComponentSourcesRelationships(
        {
          ...m2mEntitiesWithIds,
          ...classifiedEntities.with1nSources,
        },
        modelComponentSources,
      );

      await this.saveParsedEntities(manager, parsedEntitiesWithSources);
      // CREATION ENDS
    });

    await this.dataSource.transaction('READ COMMITTED', async (manager) => {
      await this.applyCostCalculationsToProjects(projects);
      await manager.save(projects.records);
    });
  }

  private async applyCostCalculationsToProjects(
    projects: ParsedEntity<Project>,
  ): Promise<void> {
    for (let idx = 0; idx < projects.records.length; idx++) {
      const project = projects.records[idx];
      const { countryCode, ecosystem, activity, restorationActivity } = project;
      const {
        additionalBaseData,
        baseIncrease,
        baseSize,
        additionalAssumptions,
      } = await this.dataRepository.getDataForCalculation({
        countryCode,
        ecosystem,
        activity,
      });
      const defaultCostInputs =
        await this.dataRepository.getOverridableCostInputs({
          countryCode,
          ecosystem,
          activity,
          restorationActivity,
        });
      const projectInputs = this.customProjectFactory.createProjectInput(
        this.projectToComputeProjectDTO(project, defaultCostInputs),
        additionalBaseData,
        additionalAssumptions,
      );

      const costOutputs = this.calculationEngine.calculateCostOutput({
        projectInput: projectInputs,
        baseIncrease,
        baseSize,
      });

      const computedProject = new Project();
      computedProject.projectName = project.projectName;
      computedProject.countryCode = project.countryCode;
      computedProject.ecosystem = project.ecosystem;
      computedProject.activity = project.activity;
      computedProject.restorationActivity = project.restorationActivity;
      computedProject.projectSize = project.projectSize;
      computedProject.projectSizeFilter = project.projectSizeFilter;
      computedProject.priceType = project.priceType;
      computedProject.abatementPotential = project.abatementPotential;
      computedProject.totalCostNPV = costOutputs.costDetails.npv.totalCost;
      computedProject.totalCost = costOutputs.costDetails.total.totalCost;
      computedProject.capexNPV = costOutputs.costDetails.npv.capitalExpenditure;
      computedProject.capex = costOutputs.costDetails.total.capitalExpenditure;
      computedProject.opexNPV =
        costOutputs.costDetails.npv.operationalExpenditure;
      computedProject.opex =
        costOutputs.costDetails.total.operationalExpenditure;
      computedProject.costPerTCO2eNPV = 1;
      computedProject.costPerTCO2e = 1;
      computedProject.feasibilityAnalysisNPV =
        costOutputs.costDetails.npv.feasibilityAnalysis;
      computedProject.feasibilityAnalysis =
        costOutputs.costDetails.total.feasibilityAnalysis;
      computedProject.conservationPlanningNPV =
        costOutputs.costDetails.npv.conservationPlanningAndAdmin;
      computedProject.conservationPlanning =
        costOutputs.costDetails.total.conservationPlanningAndAdmin;
      computedProject.dataCollectionNPV =
        costOutputs.costDetails.npv.dataCollectionAndFieldCost;
      computedProject.dataCollection =
        costOutputs.costDetails.total.dataCollectionAndFieldCost;
      computedProject.communityRepresentationNPV =
        costOutputs.costDetails.npv.communityRepresentation;
      computedProject.communityRepresentation =
        costOutputs.costDetails.total.communityRepresentation;
      computedProject.blueCarbonProjectPlanningNPV =
        costOutputs.costDetails.npv.blueCarbonProjectPlanning;
      computedProject.blueCarbonProjectPlanning =
        costOutputs.costDetails.total.blueCarbonProjectPlanning;
      computedProject.establishingCarbonRightsNPV =
        costOutputs.costDetails.npv.establishingCarbonRights;
      computedProject.establishingCarbonRights =
        costOutputs.costDetails.total.establishingCarbonRights;
      computedProject.validationNPV = costOutputs.costDetails.npv.validation;
      computedProject.validation = costOutputs.costDetails.total.validation;
      computedProject.implementationLaborNPV =
        costOutputs.costDetails.npv.implementationLabor;
      computedProject.implementationLabor =
        costOutputs.costDetails.total.implementationLabor;
      computedProject.monitoringNPV = costOutputs.costDetails.npv.monitoring;
      computedProject.monitoring = costOutputs.costDetails.total.monitoring;
      computedProject.maintenanceNPV = costOutputs.costDetails.npv.maintenance;
      computedProject.maintenance = costOutputs.costDetails.total.maintenance;
      computedProject.monitoringMaintenanceNPV =
        costOutputs.costDetails.npv.monitoring;
      computedProject.monitoringMaintenance =
        costOutputs.costDetails.total.monitoring;
      computedProject.communityBenefitNPV =
        costOutputs.costDetails.npv.communityBenefitSharingFund;
      computedProject.communityBenefit =
        costOutputs.costDetails.total.communityBenefitSharingFund;
      computedProject.carbonStandardFeesNPV =
        costOutputs.costDetails.npv.carbonStandardFees;
      computedProject.carbonStandardFees =
        costOutputs.costDetails.total.carbonStandardFees;
      computedProject.baselineReassessmentNPV =
        costOutputs.costDetails.npv.baselineReassessment;
      computedProject.baselineReassessment =
        costOutputs.costDetails.total.baselineReassessment;
      computedProject.mrvNPV = costOutputs.costDetails.npv.mrv;
      computedProject.mrv = costOutputs.costDetails.total.mrv;
      computedProject.longTermProjectOperatingNPV =
        costOutputs.costDetails.npv.longTermProjectOperatingCost;
      computedProject.longTermProjectOperating =
        costOutputs.costDetails.total.longTermProjectOperatingCost;
      computedProject.initialPriceAssumption = project.initialPriceAssumption;
      computedProject.totalRevenueNPV = costOutputs.costPlans.totalRevenueNPV;
      computedProject.totalRevenue = costOutputs.costPlans.totalRevenue;
      computedProject.creditsIssued = costOutputs.costPlans.totalCreditsIssued;
      computedProject.scoreCardRating = project.scoreCardRating;

      projects.records[idx] = computedProject;
    }
  }

  private projectToComputeProjectDTO(
    project: Project,
    defaultCostInputs,
  ): CreateCustomProjectDto {
    return {
      countryCode: project.countryCode,
      ecosystem: project.ecosystem,
      activity: project.activity,
      projectName: project.projectName,
      projectSizeHa: project.projectSize,
      carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
      initialCarbonPriceAssumption: project.initialPriceAssumption,
      costInputs: defaultCostInputs,
      // TODO: For imported projects, discuss default assumptions and parameteres with Elena
      parameters:
        project.activity === ACTIVITY.CONSERVATION
          ? DEFAULT_CONSERVATION_PARAMS
          : DEFAULT_RESTORATION_PARAMS,
      assumptions: DEFAULT_ASSUMPTIONS,
    } as CreateCustomProjectDto;
  }

  private async saveParsedEntities(
    entity: EntityManager,
    parsedEntities: Partial<ParsedEntities>,
  ): Promise<Partial<ParsedEntities>> {
    const response = {} as ParsedEntities;
    for (const parsedEntityKey of Object.keys(parsedEntities)) {
      response[parsedEntityKey] = {
        entity: parsedEntities[parsedEntityKey].entity,
        records: await entity.save(parsedEntities[parsedEntityKey].records),
      };
    }

    return response;
  }

  private addComponentSourcesRelationships(
    parsedEntities: Partial<ParsedEntities>,
    modelComponentSources: ModelComponentSource[],
  ): Partial<ParsedEntitiesWithSources> {
    const parsedEntitiesWithSources = {
      modelComponentSourceM2M: {
        entity: ModelComponentSourceM2M,
        records: [],
      },
    };

    const componentSourceIdByName: { [name: string]: string } =
      modelComponentSources.reduce((acc, value) => {
        acc[value.name] = value.id;
        return acc;
      }, {});

    // Mapping parsed entities to a methodology config entry at runtime
    const parsedEntityKeys = Object.keys(
      parsedEntities,
    ) as (keyof ParsedEntities)[];
    for (const entityKey of parsedEntityKeys) {
      const parsedEntity = parsedEntities[entityKey];

      const entityConfig = MethodologySourcesConfig.find(
        (entry) => entry.entity.name === parsedEntity.entity.name,
      );
      if (entityConfig === undefined) continue;

      if (entityConfig.relationshipType === '1n') {
        for (const record of parsedEntity.records) {
          const recordSource = record['source'];
          if (recordSource === undefined) continue;

          const sourceName = record['source']['name'];
          const sourceId = componentSourceIdByName[sourceName];
          if (sourceId === undefined)
            throw new Error(
              `SourceId for SourceName '${sourceName}' not found`,
            );

          record['source'] = {
            id: componentSourceIdByName[sourceName],
          };
        }
        parsedEntitiesWithSources[entityKey] = parsedEntity;
      } else if (entityConfig.relationshipType === 'm2m') {
        for (const record of parsedEntity.records) {
          if (Array.isArray(record.sources) === false) continue;

          for (const recordSource of record.sources) {
            const sourceId = componentSourceIdByName[recordSource.sourceName];
            if (sourceId === undefined)
              throw new Error(
                `SourceId for SourceName '${recordSource.sourceName}' not found`,
              );

            const m2mRelationship = new ModelComponentSourceM2M();
            m2mRelationship.source = {
              id: sourceId,
            } as unknown as ModelComponentSource;
            m2mRelationship.entityName = entityConfig.entity.name;
            m2mRelationship.entityId = record.id as string;
            m2mRelationship.sourceType = recordSource.fieldName;
            parsedEntitiesWithSources.modelComponentSourceM2M.records.push(
              m2mRelationship,
            );
          }
        }
      }
    }

    return parsedEntitiesWithSources;
  }
}
