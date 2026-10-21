import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { utils, write } from 'xlsx';
import { BaseIncrease } from '@shared/entities/base-increase.entity';
import { BaseSize } from '@shared/entities/base-size.entity';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
import { Country } from '@shared/entities/country.entity';
import { EcosystemExtent } from '@shared/entities/carbon-inputs/ecosystem-extent.entity';
import { EcosystemLoss } from '@shared/entities/carbon-inputs/ecosystem-loss.entity';
import { EmissionFactors } from '@shared/entities/carbon-inputs/emission-factors.entity';
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
import { FeasibilityAnalysis } from '@shared/entities/cost-inputs/feasability-analysis.entity';
import { FinancingCost } from '@shared/entities/cost-inputs/financing-cost.entity';
import { ImplementationLaborCost } from '@shared/entities/cost-inputs/implementation-labor-cost.entity';
import { LongTermProjectOperating } from '@shared/entities/cost-inputs/long-term-project-operating.entity';
import { Maintenance } from '@shared/entities/cost-inputs/maintenance.entity';
import { MonitoringCost } from '@shared/entities/cost-inputs/monitoring.entity';
import { MRV } from '@shared/entities/cost-inputs/mrv.entity';
import { ProjectSize } from '@shared/entities/cost-inputs/project-size.entity';
import { ValidationCost } from '@shared/entities/cost-inputs/validation.entity';

const EXPORT_SHEETS = [
  ['Countries', Country],
  ['Project size', ProjectSize],
  ['Feasibility analysis', FeasibilityAnalysis],
  ['Conservation planning and admin', ConservationPlanningAndAdmin],
  ['Data collection and field costs', DataCollectionAndFieldCosts],
  ['Community representation', CommunityRepresentation],
  ['Blue carbon project planning', BlueCarbonProjectPlanning],
  ['Establishing carbon rights', CarbonRights],
  ['Financing cost', FinancingCost],
  ['Validation', ValidationCost],
  ['Monitoring', MonitoringCost],
  ['Maintenance', Maintenance],
  ['Community benefit sharing fund', CommunityBenefitSharingFund],
  ['Baseline reassessment', BaselineReassessment],
  ['MRV', MRV],
  ['Long-term project operating', LongTermProjectOperating],
  ['Carbon standard fees', CarbonStandardFees],
  ['Community cash flow', CommunityCashFlow],
  ['Ecosystem extent', EcosystemExtent],
  ['Ecosystem loss', EcosystemLoss],
  ['Restorable land', RestorableLand],
  ['Sequestration rate', SequestrationRate],
  ['Emission factors', EmissionFactors],
  ['Implementation labor', ImplementationLaborCost],
  ['Base size', BaseSize],
  ['Base increase', BaseIncrease],
  ['Model assumptions', ModelAssumptions],
] as const;

@Injectable()
export class AdminExportService {
  constructor(private readonly dataSource: DataSource) {}

  async exportToExcel(): Promise<Buffer> {
    const workbook = utils.book_new();

    for (const [sheetName, entity] of EXPORT_SHEETS) {
      const records = await this.dataSource.getRepository(entity).find();
      const rows = records.map((record) => ({ ...record }));
      utils.book_append_sheet(workbook, utils.json_to_sheet(rows), sheetName);
    }

    return write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  }
}
