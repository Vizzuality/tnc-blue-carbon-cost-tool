import {
  CustomProjectCostDetails,
  CustomProjectSummary,
  YearlyBreakdown,
} from '@shared/dtos/custom-projects/custom-project-output.dto';
import {
  CalculatorCostPlansOutput,
  SensitivityAnalysisResults,
} from '@api/modules/calculations/types/output-types';

export type CostOutput = {
  costPlans: CalculatorCostPlansOutput;
  summary: CustomProjectSummary;
  yearlyBreakdown: YearlyBreakdown[];
  costDetails: {
    total: CustomProjectCostDetails;
    npv: CustomProjectCostDetails;
  };
  sensitivityAnalysis?: SensitivityAnalysisResults;
};
