import Introduction from "@/containers/methodology/sections/introduction";
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
  ProjectCostsAssumptionsAndMethodology,
  ModelAssumptions,
  QualitativeScorecardDetailsAndSources,
  Sources,
];

export default METHODOLOGY_SECTIONS;
