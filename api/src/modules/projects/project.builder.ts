/**
 * @description: Simple builder wrapper to handle the assignment of properties to a project entity and return the instance
 */
import { CreateProjectDto } from '@api/modules/projects/projects-calculation.service';
import { CostOutput } from '@api/modules/calculations/calculation.engine';
import { Project } from '@shared/entities/projects.entity';
import { PROJECT_SCORE } from '@shared/entities/project-score.enum';
import { ExcelProject } from '@api/modules/import/dtos/excel-projects.dto';
import { ProjectSize } from '@shared/entities/cost-inputs/project-size.entity';
import { getProjectSizeFilter } from '@api/modules/projects/threshold/project-size-threshold';

export class ProjectBuilder {
  dto: CreateProjectDto;
  score: PROJECT_SCORE;
  costOutput: CostOutput;
  project: Project;
  projectSize: ProjectSize['sizeHa'];
  constructor(
    createDto: CreateProjectDto,
    score: PROJECT_SCORE,
    costOutput: CostOutput,
    size: ProjectSize['sizeHa'],
  ) {
    this.dto = createDto;
    this.score = score;
    this.costOutput = costOutput;
    this.projectSize = size;

    this.project = new Project();
  }

  static excelInputToDto(excelInput: ExcelProject): CreateProjectDto {
    return {
      projectName: excelInput.project_name,
      countryCode: excelInput.country_code,
      ecosystem: excelInput.ecosystem,
      activity: excelInput.activity,
      restorationActivity: excelInput.activity_type,
      projectSizeHa: excelInput.project_size_ha,
      priceType: excelInput.price_type,
      initialCarbonPriceAssumption: excelInput.initial_price_assumption,
    };
  }

  build(): Project {
    const project = this.project;
    project.projectName = this.dto.projectName;
    project.countryCode = this.dto.countryCode;
    project.ecosystem = this.dto.ecosystem;
    project.activity = this.dto.activity;
    project.restorationActivity = this.dto.restorationActivity;
    project.projectSize = this.dto.projectSizeHa;
    project.priceType = this.dto.priceType;
    project.initialPriceAssumption = this.dto.initialCarbonPriceAssumption;
    project.initialPriceAssumption = this.dto.initialCarbonPriceAssumption;
    project.scoreCardRating = this.score;
    this.assignCosts();
    this.assignProjectSizeFilter();
    return this.project;
  }

  private assignCosts(): void {
    // assign costs to project
    const computedProject = this.project;
    const costOutputs = this.costOutput;
    // TODO: We are missing abatement potential here (need to compute)
    //computedProject.abatementPotential = this.dto.abatementPotential;
    computedProject.totalCostNPV = costOutputs.costDetails.npv.totalCost;
    computedProject.totalCost = costOutputs.costDetails.total.totalCost;
    computedProject.capexNPV = costOutputs.costDetails.npv.capitalExpenditure;
    computedProject.capex = costOutputs.costDetails.total.capitalExpenditure;
    computedProject.opexNPV =
      costOutputs.costDetails.npv.operationalExpenditure;
    computedProject.opex = costOutputs.costDetails.total.operationalExpenditure;
    // TODO: We are missing how this column is computed in the notebook. Double check. Looking to the excel, values are the same as total cost per tCO2e
    computedProject.costPerTCO2eNPV = costOutputs.costPlans.costPerTCO2e;
    computedProject.costPerTCO2e = costOutputs.costPlans.costPerTCO2e;
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

    computedProject.totalRevenueNPV = costOutputs.costPlans.totalRevenueNPV;
    computedProject.totalRevenue = costOutputs.costPlans.totalRevenue;
    computedProject.creditsIssued = costOutputs.costPlans.totalCreditsIssued;
    this.project = computedProject;
  }

  // TODO: As was questioned previously, it seems that size filter criteria is not a single criteria but it's a combination of
  //       (at least) activity and ecosystem. Additionally we do have this data in the DB which can change, so we might need to
  //       be able to change the criteria dynamically. Double check with the science team.
  //       for reference, check cell number 6 in https://github.com/Vizzuality/tnc-blue-carbon-cost-tool/blob/96f57ab451d4171f341365cdba75f7bd89a1e66d/data/notebooks/High_level_overview.ipynb

  private assignProjectSizeFilter(): void {
    const project = this.project;
    const { ecosystem, activity } = project;
    project.projectSizeFilter = getProjectSizeFilter(
      ecosystem,
      activity,
      this.projectSize,
    );
    this.project = project;
  }
}
