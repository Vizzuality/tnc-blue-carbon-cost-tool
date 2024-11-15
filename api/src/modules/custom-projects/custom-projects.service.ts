import { Injectable } from '@nestjs/common';
import { AppBaseService } from '@api/utils/app-base.service';
import { CreateCustomProjectDto } from '@api/modules/custom-projects/dto/create-custom-project-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CustomProject } from '@shared/entities/custom-project.entity';
import { CalculationEngine } from '@api/modules/calculations/calculation.engine';
import { CustomProjectInputFactory } from '@api/modules/custom-projects/input-factory/custom-project-input.factory';
import { GetDefaultCostInputsDto } from '@shared/dtos/custom-projects/get-default-cost-inputs.dto';
import { DataRepository } from '@api/modules/calculations/data.repository';
import { CostInputs } from '@api/modules/custom-projects/dto/project-cost-inputs.dto';

type FindInput = {
  countryCode: CreateCustomProjectDto['countryCode'];
  ecosystem: CreateCustomProjectDto['ecosystem'];
  activity: CreateCustomProjectDto['activity'];
};

@Injectable()
export class CustomProjectsService extends AppBaseService<
  CustomProject,
  CreateCustomProjectDto,
  unknown,
  unknown
> {
  constructor(
    @InjectRepository(CustomProject)
    public readonly repo: Repository<CustomProject>,
    public readonly calculationEngine: CalculationEngine,
    public readonly dataRepository: DataRepository,
    public readonly customProjectFactory: CustomProjectInputFactory,
    public readonly dataSource: DataSource,
  ) {
    super(repo, 'customProject', 'customProjects');
  }

  async create(dto: CreateCustomProjectDto): Promise<any> {
    const {
      countryCode,
      ecosystem,
      activity,
      projectName,
      parameters,
      assumptions,
      costInputs,
    } = dto;
    const defaultCarbonInputs =
      await this.dataRepository.getDefaultCarbonInputs({
        countryCode,
        ecosystem,
        activity,
      });

    const projectInput = this.customProjectFactory.createProject(
      dto,
      defaultCarbonInputs,
    );
    // const { baseData, baseSize, baseIncrease, defaultAssumptions } =
    //   await this.calculationEngine.getBaseData({
    //     countryCode,
    //     ecosystem,
    //     activity,
    //   });
    //
    // // TODO: We need to clearly define which properties are required for the consumer and which can be retrieved from the data
    // // This prop should be required for the consumer? TIER 3 is not defined in the entity
    // const emissionFactorUsed = EMISSION_FACTORS_TIER_TYPES.TIER_2;
    // const project = this.customProjectFactory.createProject({
    //   name: projectName,
    //   ecosystem,
    //   activity,
    //   countryCode,
    //   inputData: baseData,
    //   emissionFactorUsed,
    //   projectSizeHa: baseData.projectSizeHa,
    //   plantingSuccessRate: 0.8,
    // });
    //
    // const calculator = new ConservationCostCalculator(
    //   project,
    //   baseIncrease,
    //   baseSize,
    // );
    // // TODO: Also define clearly which are the outputs that the consumer expects, that is, relevant for the custom project
    //
    // return {
    //   estimates: calculator.getCostEstimates(),
    //   summary: calculator.getSummary(),
    //   yearBreakdown: calculator.getYearlyCostBreakdown(),
    // };

    return projectInput;
  }

  async getDefaultCostInputs(
    dto: GetDefaultCostInputsDto,
  ): Promise<CostInputs> {
    return this.calculationEngine.getDefaultCostInputs(dto);
  }
}
