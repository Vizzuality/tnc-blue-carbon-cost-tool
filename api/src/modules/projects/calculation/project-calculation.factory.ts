import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
import {
  CreateCustomProjectDto,
  OverridableCostInputsDto,
} from '@shared/dtos/custom-projects/create-custom-project.dto';
import { assumptionsArrayToMap } from '@shared/lib/transform-create-custom-project-payload';
import { CARBON_REVENUES_TO_COVER } from '@shared/entities/custom-project.entity';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { CreateProjectDto } from '@shared/dtos/projects/create-project.dto';

export class ProjectCalculationFactory {
  dto: CreateProjectDto;
  defaultAssumptions: ModelAssumptions[];
  defaultCostInputs: OverridableCostInputsDto;
  constructor(
    dto: CreateProjectDto,
    defaultAssumptions: ModelAssumptions[],
    defaultCostInputs: OverridableCostInputsDto,
  ) {
    this.dto = dto;
    this.defaultAssumptions = defaultAssumptions;
    this.defaultCostInputs = defaultCostInputs;
  }

  /**
   * @description: Helper to abstract the parsing of the create project DTO to a create custom project DTO so that we can use the same computing approach
   *               It also works around the implementation labor issue: https://vizzuality.atlassian.net/browse/TBCCT-371, until we reach a final decision
   *               as to how to handle it
   *
   *               It also assumes, following the notebook, that there are default parameters set for the projects, meaning an admin has certain limitations
   *               when creating a project. This needs to be discussed
   **/
  toCreateCustomProjectDto(): CreateCustomProjectDto {
    const dto = this.dto;
    const defaultAssumptions = this.defaultAssumptions;
    const defaultCostInputs = this.defaultCostInputs;
    // Uses the same parsing logic the FE uses to parse the assumptions array to map
    const parsedAssumptions = assumptionsArrayToMap(defaultAssumptions);
    const createDto = {} as CreateCustomProjectDto;
    createDto.activity = dto.activity;
    createDto.countryCode = dto.countryCode;
    createDto.carbonRevenuesToCover = CARBON_REVENUES_TO_COVER.OPEX;
    createDto.ecosystem = dto.ecosystem;
    createDto.projectName = dto.projectName;
    createDto.projectSizeHa = dto.projectSizeHa;
    createDto.initialCarbonPriceAssumption = dto.initialCarbonPriceAssumption;
    createDto.assumptions = parsedAssumptions;
    createDto.costInputs = this.setCostInputs(dto.activity, defaultCostInputs);
    //createDto.parameters = this.setDefaultParameters(dto);
    // Just keep the original parameters from the DTO, that should be validated in the controller
    createDto.parameters = dto.parameters;
    return createDto;
  }

  /*
   * @description: Helper to abstract the setting of the cost inputs for the project. This is needed for now to set implementation labor (at least) to
   *               to 0 for the algorithm to run. This needs to be discussed with the team
   */
  setCostInputs(
    activity: ACTIVITY,
    defaultCostInputs: OverridableCostInputsDto,
  ) {
    if (activity === ACTIVITY.RESTORATION) {
      return defaultCostInputs;
    } else if (activity === ACTIVITY.CONSERVATION) {
      return {
        ...defaultCostInputs,
        implementationLabor: 0,
      };
    }
  }

  // /**
  //  * @description: It seems that for computing projects, we need to set some default parameters as the tier used and more. this needs to be
  //  *               clarified with the science team.
  //  *
  //  *               Additionally, setting restorationActivity in parameters for CustomProjects was not a good design choice. This needs to be discussed with the team
  //  */
  // setDefaultParameters(dto: CreateProjectDto) {
  //   if (dto.activity === ACTIVITY.CONSERVATION) {
  //     return {
  //       lossRateUsed: LOSS_RATE_USED.NATIONAL_AVERAGE,
  //       emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_1,
  //     };
  //   } else {
  //     return {
  //       tierSelector: SEQUESTRATION_RATE_TIER_TYPES.TIER_1,
  //       restorationActivity: dto.restorationActivity,
  //     };
  //   }
  // }
}
