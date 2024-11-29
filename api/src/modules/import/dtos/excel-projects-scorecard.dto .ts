import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';

export type ExcelProjectScorecard = {
  country: string;
  country_code: string;
  ecosystem: ECOSYSTEM;
  legal_feasibility: number;
  implementation_risk_score: number;
  availability_of_experienced_labor: number;
  security_rating: number;
  availability_of_alternative_funding: number;
  biodiversity_benefit: number;
  social_feasibility: number;
  coastal_protection_benefit: number;
};
