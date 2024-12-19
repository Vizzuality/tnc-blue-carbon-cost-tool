import { Injectable } from '@nestjs/common';
import { AppBaseService } from '@api/utils/app-base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { z } from 'zod';
import { getProjectsQuerySchema } from '@shared/contracts/projects.contract';
import { ProjectScorecardView } from '@shared/entities/project-scorecard.view';
import { ProjectScorecardDto } from '@shared/dtos/projects/project-scorecard.dto';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from '@shared/entities/activity.enum';
import {
  PROJECT_PRICE_TYPE,
  PROJECT_SIZE_FILTER,
} from '@shared/entities/projects.entity';
import { PROJECT_SCORE } from '@shared/entities/project-score.enum';

export type ProjectFetchSpecificacion = z.infer<typeof getProjectsQuerySchema>;

@Injectable()
export class ProjectsScorecardService extends AppBaseService<
  ProjectScorecardView,
  unknown,
  unknown,
  unknown
> {
  constructor(
    @InjectRepository(ProjectScorecardView)
    private readonly projectScorecardRepo: Repository<ProjectScorecardView>,
  ) {
    super(projectScorecardRepo, 'project_scorecard', 'project_scorecards');
  }

  async extendFindAllQuery(
    query: SelectQueryBuilder<ProjectScorecardView>,
    fetchSpecification: ProjectFetchSpecificacion,
  ): Promise<SelectQueryBuilder<ProjectScorecardView>> {
    // Filter by project name
    if (fetchSpecification.partialProjectName) {
      query = query.andWhere('project_name ILIKE :projectName', {
        projectName: `%${fetchSpecification.partialProjectName}%`,
      });
    }

    // Filter by abatement potential
    if (fetchSpecification.abatementPotentialRange) {
      query = query.andWhere(
        'abatement_potential >= :minAP AND abatement_potential <= :maxAP',
        {
          minAP: Math.min(...fetchSpecification.abatementPotentialRange),
          maxAP: Math.max(...fetchSpecification.abatementPotentialRange),
        },
      );
    }

    // Filter by cost (total or NPV)
    if (fetchSpecification.costRange && fetchSpecification.costRangeSelector) {
      let filteredCostColumn: string;
      switch (fetchSpecification.costRangeSelector) {
        case 'npv':
          filteredCostColumn = 'total_cost_npv';
          break;
        case 'total':
        default:
          filteredCostColumn = 'total_cost';
          break;
      }

      query = query.andWhere(
        `${filteredCostColumn} >= :minCost AND ${filteredCostColumn} <= :maxCost`,
        {
          minCost: Math.min(...fetchSpecification.costRange),
          maxCost: Math.max(...fetchSpecification.costRange),
        },
      );
    }

    return query;
  }

  adaptDbViewToApiView(dbView: ProjectScorecardView): ProjectScorecardDto {
    return {
      id: dbView.id,
      countryCode: dbView.countryCode,
      ecosystem: dbView.ecosystem as ECOSYSTEM,
      activity: dbView.activity as ACTIVITY,
      activitySubtype: dbView.activitySubtype as RESTORATION_ACTIVITY_SUBTYPE,
      projectName: dbView.projectName,
      abatementPotential: dbView.abatementPotential,
      projectSize: dbView.projectSize,
      initialPriceAssumption: dbView.initialPriceAssumption,
      projectSizeFilter: dbView.projectSizeFilter as PROJECT_SIZE_FILTER,
      priceType: dbView.priceType as PROJECT_PRICE_TYPE,
      scoreCardRating: dbView.scoreCardRating as PROJECT_SCORE,
      scorecard: {
        financialFeasibility: dbView.financialFeasibility as PROJECT_SCORE,
        legalFeasibility: dbView.legalFeasibility as PROJECT_SCORE,
        implementationFeasibility:
          dbView.implementationFeasibility as PROJECT_SCORE,
        socialFeasibility: dbView.socialFeasibility as PROJECT_SCORE,
        securityRating: dbView.securityRating as PROJECT_SCORE,
        availabilityOfExperiencedLabor:
          dbView.availabilityOfExperiencedLabor as PROJECT_SCORE,
        availabilityOfAlternatingFunding:
          dbView.availabilityOfAlternatingFunding as PROJECT_SCORE,
        coastalProtectionBenefits:
          dbView.coastalProtectionBenefits as PROJECT_SCORE,
        biodiversityBenefit: dbView.biodiversityBenefit as PROJECT_SCORE,
      },
      projectCost: {
        total: {
          totalCost: dbView.totalCost,
          capex: dbView.capex,
          opex: dbView.opex,
          costPerTCO2e: dbView.costPerTCO2e,
          feasibilityAnalysis: dbView.feasibilityAnalysis,
          conservationPlanning: dbView.conservationPlanning,
          dataCollection: dbView.dataCollection,
          communityRepresentation: dbView.communityRepresentation,
          blueCarbonProjectPlanning: dbView.blueCarbonProjectPlanning,
          establishingCarbonRights: dbView.establishingCarbonRights,
          validation: dbView.validation,
          implementationLabor: dbView.implementationLabor,
          monitoring: dbView.monitoring,
          maintenance: dbView.maintenance,
          monitoringMaintenance: dbView.monitoringMaintenance,
          communityBenefit: dbView.communityBenefit,
          carbonStandardFees: dbView.carbonStandardFees,
          baselineReassessment: dbView.baselineReassessment,
          mrv: dbView.mrv,
          longTermProjectOperating: dbView.longTermProjectOperating,
          totalRevenue: dbView.totalRevenue,
        },
        npv: {
          totalCost: dbView.totalCostNPV,
          capex: dbView.capexNPV,
          opex: dbView.opexNPV,
          costPerTCO2e: dbView.costPerTCO2eNPV,
          feasibilityAnalysis: dbView.feasibilityAnalysisNPV,
          conservationPlanning: dbView.conservationPlanningNPV,
          dataCollection: dbView.dataCollectionNPV,
          communityRepresentation: dbView.communityRepresentationNPV,
          blueCarbonProjectPlanning: dbView.blueCarbonProjectPlanningNPV,
          establishingCarbonRights: dbView.establishingCarbonRightsNPV,
          validation: dbView.validationNPV,
          implementationLabor: dbView.implementationLaborNPV,
          monitoring: dbView.monitoringNPV,
          maintenance: dbView.maintenanceNPV,
          monitoringMaintenance: dbView.monitoringMaintenanceMPV,
          communityBenefit: dbView.communityBenefitNPV,
          carbonStandardFees: dbView.carbonStandardFeesNPV,
          baselineReassessment: dbView.baselineReassessmentNPV,
          mrv: dbView.mrvNPV,
          longTermProjectOperating: dbView.longTermProjectOperatingNPV,
          totalRevenue: dbView.totalRevenueNPV,
        },
      },
      leftoverAfterOpex: dbView.leftoverAfterOpex,
      creditsIssued: dbView.creditsIssued,
    };
  }
}
