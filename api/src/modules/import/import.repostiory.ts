import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Project } from '@shared/entities/projects.entity';
import { Project2 } from '@shared/entities/projects2.entity';
import { ProjectSize } from '@shared/entities/cost-inputs/project-size.entity';
import { FeasibilityAnalysis } from '@shared/entities/cost-inputs/feasability-analysis.entity';
import { EcosystemExtent } from '@shared/entities/carbon-inputs/ecosystem-extent.entity';
import { EcosystemLoss } from '@shared/entities/carbon-inputs/ecosystem-loss.entity';
import {
  EMISSION_FACTORS_TIER_TYPES,
  EmissionFactors,
} from '@shared/entities/carbon-inputs/emission-factors.entity';
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
import { ModelComponentSource } from '@shared/entities/methodology/model-component-source.entity';
import { DataRepository } from '@api/modules/calculations/data.repository';
import { CustomProjectFactory } from '@api/modules/custom-projects/input-factory/custom-project.factory';
import { CreateCustomProjectDto } from '@shared/dtos/custom-projects/create-custom-project.dto';
import { CalculationEngine } from '@api/modules/calculations/calculation.engine';
import {
  CARBON_REVENUES_TO_COVER,
  PROJECT_SPECIFIC_EMISSION,
} from '@shared/entities/custom-project.entity';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { LOSS_RATE_USED } from '@shared/schemas/custom-projects/create-custom-project.schema';

@Injectable()
export class ImportRepository {
  constructor(
    private readonly dataSource: DataSource,
    public readonly dataRepository: DataRepository,
    public readonly customProjectFactory: CustomProjectFactory,
    public readonly calculationEngine: CalculationEngine,
  ) {}

  async importProjectScorecard(projectScorecards: ProjectScorecard[]) {
    return this.dataSource.transaction('READ COMMITTED', async (manager) => {
      // Wipe current project scorecards
      await manager.clear(ProjectScorecard);

      // Insert
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
      // CREATION ENDS
    });

    await this.computeAndSaveProjects(importData.projects);
  }

  async computeAndSaveProjects(projects: Project[]): Promise<void> {
    const computedProjects: Project2[] = [];
    for (let project of projects) {
      if (project.activity == ACTIVITY.RESTORATION) {
        continue;
      }

      const { countryCode, ecosystem, activity } = project;
      const {
        additionalBaseData,
        baseIncrease,
        baseSize,
        additionalAssumptions,
        country,
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

      const computedProject = new Project2();
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
      computedProject.leftoverAfterOpexNPV = 1;
      computedProject.leftoverAfterOpex = 1;
      computedProject.totalRevenueNPV = costOutputs.costPlans.totalRevenueNPV;
      computedProject.totalRevenue = costOutputs.costPlans.totalRevenue;
      computedProject.creditsIssued = costOutputs.costPlans.totalCreditsIssued;
      computedProject.scoreCardRating = project.scoreCardRating;

      computedProjects.push(computedProject);
    }

    await this.dataSource.transaction('READ COMMITTED', async (manager) => {
      await manager.clear(Project2);
      await manager.save(computedProjects);
    });
  }

  private projectToComputeProjectDTO(
    project: Project,
    defaultCostInputs,
  ): CreateCustomProjectDto {
    // @ts-ignore
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
      parameters: {
        lossRateUsed: LOSS_RATE_USED.PROJECT_SPECIFIC,
        projectSpecificEmission: PROJECT_SPECIFIC_EMISSION.ONE_EMISSION_FACTOR,
        projectSpecificEmissionFactor: 15,
        projectSpecificLossRate: -0.003,
        emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_1,
        emissionFactorAGB: 200,
        emissionFactorSOC: 15,
      },
      assumptions: {
        baselineReassessmentFrequency: 10,
        buffer: 0.2,
        carbonPriceIncrease: 0.015,
        discountRate: 0.04,
        projectLength: 20,
        verificationFrequency: 5,
      },
    };
  }
}
