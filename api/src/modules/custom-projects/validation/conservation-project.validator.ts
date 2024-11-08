import { CreateCustomProjectDto } from '@shared/dtos/custom-projects/create-custom-project.dto';
import { LOSS_RATE_USED } from '@shared/schemas/custom-projects/create-custom-project.schema';
import { BadRequestException } from '@nestjs/common';
import { BaseDataView } from '@shared/entities/base-data.view';
import { EMISSION_FACTORS_TIER_TYPES } from '@shared/entities/carbon-inputs/emission-factors.entity';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';

export class ConservationProjectValidator {
  validatedProject: Record<any, any>;
  data: BaseDataView;
  createDto: CreateCustomProjectDto & { projectSpecificLossRate: number };
  constructor(dto, data: BaseDataView) {
    this.createDto = dto;
    this.data = data;
  }
  // Probably SET PROJECT PARAMETERS WOULD BE A BETTER NAME, and just return the validated project parameters
  validate() {
    this.setLossRate();
    return this.createDto;
  }
  private setLossRate() {
    if (
      this.createDto.lossRateUsed === LOSS_RATE_USED.PROJECT_SPECIFIC &&
      !this.createDto.projectSpecificLossRate
    ) {
      throw new BadRequestException(
        'projectSpecificLossRate is required when lossRateUsed is projectSpecific',
      );
    }
    if (
      this.createDto.lossRateUsed === LOSS_RATE_USED.PROJECT_SPECIFIC &&
      this.createDto.projectSpecificLossRate >= 0
    ) {
      throw new BadRequestException(
        'projectSpecificLossRate should be negative when lossRateUsed is projectSpecific',
      );
    }
    if (
      this.createDto.lossRateUsed === LOSS_RATE_USED.NATIONAL_AVERAGE &&
      this.createDto.projectSpecificLossRate
    ) {
      throw new BadRequestException(
        'projectSpecificLossRate should not be provided when lossRateUsed is not projectSpecific',
      );
    }
    if (this.createDto.lossRateUsed === LOSS_RATE_USED.NATIONAL_AVERAGE) {
      this.validatedProject.lossRate = this.data.ecosystemLossRate;
    }
    if (this.createDto.lossRateUsed === LOSS_RATE_USED.PROJECT_SPECIFIC) {
      this.validatedProject.lossRate = this.createDto.projectSpecificLossRate;
    }
  }

  private setEmissionFactor() {
    if (
      this.createDto.emissionFactorUsed === EMISSION_FACTORS_TIER_TYPES.TIER_1
    ) {
      this.validatedProject.emissionFactor = this.data.tier1EmissionFactor;
      return;
    }
    if (
      this.createDto.emissionFactorUsed === EMISSION_FACTORS_TIER_TYPES.TIER_2
    ) {
      if (this.createDto.ecosystem !== ECOSYSTEM.MANGROVE) {
        throw new BadRequestException(
          `No Tier 2 emission factors for ${this.createDto.ecosystem}`,
        );
      }
      this.validatedProject.emissionFactorAGB = this.data.emissionFactorAgb;
      this.validatedProject.emissionFactorSOC = this.data.emissionFactorSoc;
      return;
    }
    if (this.createDto.projectSpecificEmission === 'One emission factor') {
      this.validatedProject.emissionFactor =
        this.createDto.projectSpecificEmissionFactor;
      this.validatedProject.emissionFactorAGB = 0;
      this.validatedProject.emissionFactorSOC = 0;
    } else {
      this.validatedProject.emissionFactor = null;
      this.validatedProject.emissionFactorAGB =
        this.createDto.emissionFactorAGB;
      this.validatedProject.emissionFactorSOC =
        this.createDto.emissionFactorSOC;
    }
  }
}
