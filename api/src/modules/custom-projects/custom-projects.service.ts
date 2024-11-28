import { Injectable } from '@nestjs/common';
import { AppBaseService } from '@api/utils/app-base.service';
import { CreateCustomProjectDto } from '@api/modules/custom-projects/dto/create-custom-project-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomProject } from '@shared/entities/custom-project.entity';
import { CalculationEngine } from '@api/modules/calculations/calculation.engine';
import { CustomProjectInputFactory } from '@api/modules/custom-projects/input-factory/custom-project-input.factory';
import { GetOverridableCostInputs } from '@shared/dtos/custom-projects/get-overridable-cost-inputs.dto';
import { DataRepository } from '@api/modules/calculations/data.repository';
import { OverridableCostInputs } from '@api/modules/custom-projects/dto/project-cost-inputs.dto';
import { CostCalculator } from '@api/modules/calculations/cost.calculator';
import { CustomProjectSnapshotDto } from './dto/custom-project-snapshot.dto';
import { GetOverridableAssumptionsDTO } from '@shared/dtos/custom-projects/get-overridable-assumptions.dto';
import { AssumptionsRepository } from '@api/modules/calculations/assumptions.repository';
import { SequestrationRateCalculator } from '@api/modules/calculations/sequestration-rate.calculator';
import { CountriesService } from '@api/modules/countries/countries.service';

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
    public readonly assumptionsRepository: AssumptionsRepository,
    public readonly customProjectFactory: CustomProjectInputFactory,
    private readonly countries: CountriesService,
  ) {
    super(repo, 'customProject', 'customProjects');
  }

  async create(dto: CreateCustomProjectDto): Promise<any> {
    const { countryCode, ecosystem, activity } = dto;
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
    const country = await this.countries.getById(countryCode, {
      fields: ['code', 'name'],
    });

    const projectInput = this.customProjectFactory.createProjectInput(
      dto,
      additionalBaseData,
      additionalAssumptions,
    );
    const sequestrationRateCalculator = new SequestrationRateCalculator(
      projectInput,
    );
    const calculator = new CostCalculator(
      projectInput,
      baseSize,
      baseIncrease,
      sequestrationRateCalculator,
    );

    const costPlans = calculator.initializeCostPlans();

    const projectOutput = {
      projectName: dto.projectName,
      country,
      projectSize: dto.projectSizeHa,
      ecosystem: dto.ecosystem,
      activity: dto.activity,
      lossRate: projectInput.lossRate,
      carbonRevenuesToCover: projectInput.carbonRevenuesToCover,
      initialCarbonPrice: projectInput.initialCarbonPriceAssumption,
      emissionFactors: {
        emissionFactor: projectInput.emissionFactor,
        emissionFactorAgb: projectInput.emissionFactorAgb,
        emissionFactorSoc: projectInput.emissionFactorSoc,
      },
      totalProjectCost: {
        total: {
          total: costPlans.totalCapex + costPlans.totalOpex,
          capex: costPlans.totalCapex,
          opex: costPlans.totalOpex,
        },
        npv: {
          total: costPlans.totalCapexNPV + costPlans.totalOpexNPV,
          capex: costPlans.totalCapexNPV,
          opex: costPlans.totalOpexNPV,
        },
      },

      summary: calculator.getSummary(costPlans),
      costDetails: calculator.getCostDetails(costPlans),
      breakdown: calculator.getYearlyBreakdown(),
    };
    return projectOutput.breakdown;
  }

  async saveCustomProject(dto: CustomProjectSnapshotDto): Promise<void> {
    await this.repo.save(CustomProject.fromCustomProjectSnapshotDTO(dto));
  }

  async getDefaultCostInputs(
    dto: GetOverridableCostInputs,
  ): Promise<OverridableCostInputs> {
    return this.dataRepository.getOverridableCostInputs(dto);
  }

  async getDefaultAssumptions(dto: GetOverridableAssumptionsDTO) {
    return this.assumptionsRepository.getOverridableModelAssumptions(dto);
  }
}
