import CarbonEmissionsReductionsAndCarbonCreditRevenues from "@/containers/methodology/sections/carbon-emissions-reductions-and-carbon-credit-revenues";
import Introduction from "@/containers/methodology/sections/introduction";
import LimitationsOfTheTool from "@/containers/methodology/sections/limitations-of-the-tool";
import ModelAssumptions from "@/containers/methodology/sections/model-assumptions";
import ProjectCostsAssumptionsAndMethodology from "@/containers/methodology/sections/project-costs-assumptions-and-methodology";
import ProjectSizeAssumptions from "@/containers/methodology/sections/project-size-assumptions";
import QualitativeScorecardDetailsAndSources from "@/containers/methodology/sections/qualitative-scorecard-details-and-sources";
import Sources from "@/containers/methodology/sections/sources";
export interface MethodologySection {
  id: string;
  title: string;
  href: string;
  Content: JSX.Element;
}

const METHODOLOGY_SECTIONS: MethodologySection[] = [
  Introduction,
  ProjectSizeAssumptions,
  CarbonEmissionsReductionsAndCarbonCreditRevenues,
  ProjectCostsAssumptionsAndMethodology,
  ModelAssumptions,
  QualitativeScorecardDetailsAndSources,
  LimitationsOfTheTool,
  Sources,
];

export default METHODOLOGY_SECTIONS;
