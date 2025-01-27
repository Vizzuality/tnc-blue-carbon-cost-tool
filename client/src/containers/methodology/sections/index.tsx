import MethodologyTable from "@/containers/methodology/table";
import {
  assumptionsData,
  assumptionsHeaders,
  projectCostsAssumptionsAndMethodologyHeaders,
  projectCostsAssumptionsAndMethodologyData,
  projectSizeAssumptionsData,
  qualitativeScorecardDetailsAndSourcesData,
  qualitativeScorecardDetailsAndSourcesHeaders,
} from "@/containers/methodology/table/data";
import { projectSizeAssumptionsHeaders } from "@/containers/methodology/table/data";

export const METHODOLOGY_SECTIONS = [
  {
    id: "introduction",
    title: "Introduction",
    href: "#introduction",
    description: (
      <>
        <p>
          To better understand the financials of blue carbon projects, The
          Nature Conservancy (TNC), in collaboration with Bain & Company, has
          developed the Blue Carbon Cost Tool. This pre-feasibility tool
          provides high-level estimations of project costs and carbon benefits
          for blue carbon projects, allowing for project-specific scenario
          analysis and qualitative metrics for project prioritization.
          Stakeholders can utilize this tool to gain valuable insights into the
          financial aspects of blue carbon projects. Designed as an early-stage
          planning resource, the tool offers both default values and
          customizable options for tailored assessments, while not being
          intended for tracking cost over time.
        </p>
        <p>
          As blue carbon ecosystems—including mangroves, salt marshes, and
          seagrasses—gain recognition for their critical role in carbon
          sequestration and climate resilience, this tool addresses key
          knowledge gaps in project costs and funding needs. Its insights
          support efficient resource allocation, enabling successful
          conservation and restoration initiatives in the fight against climate
          change.
        </p>
      </>
    ),
    Component: null,
  },
  {
    id: "project-size-assumptions",
    title: "Project size assumptions",
    href: "#project-size-assumptions",
    description: (
      <p>
        In the Project Overview section, project sizes were carefully selected
        to ensure real-world feasibility and enable meaningful comparisons
        across different projects. These sizes were determined based on their
        carbon equivalency and representativeness, allowing for straightforward
        “apples-to-apples” comparisons across various activities and ecosystem
        types. The table below outlines the project sizes for each activity and
        ecosystem:
      </p>
    ),
    Component: (
      <MethodologyTable
        headers={projectSizeAssumptionsHeaders}
        data={projectSizeAssumptionsData}
      />
    ),
  },
  {
    id: "project-costs-assumptions-and-methodology",
    title: "Project costs – assumptions and methodology",
    href: "#project-costs-assumptions-and-methodology",
    description: (
      <p>
        This section provides the assumptions and methodologies used to estimate
        the cost components of a blue carbon project. For more detailed
        description, please download the full methodology.
      </p>
    ),
    Component: (
      <MethodologyTable
        headers={projectCostsAssumptionsAndMethodologyHeaders}
        data={projectCostsAssumptionsAndMethodologyData}
        categorized
      />
    ),
  },
  {
    id: "model-assumptions",
    title: "Model assumptions",
    href: "#model-assumptions",
    description: (
      <p>
        Table below showcases the model assumptions that are universally applied
        to all projects:
      </p>
    ),
    Component: (
      <MethodologyTable headers={assumptionsHeaders} data={assumptionsData} />
    ),
  },
  {
    id: "qualitative-scorecard-details-and-sources",
    title: "Qualitative scorecard details and sources",
    href: "#qualitative-scorecard-details-and-sources",
    description: (
      <p>
        Methodology and sources used for the non-economic qualitative metrics. 
      </p>
    ),
    Component: (
      <MethodologyTable
        headers={qualitativeScorecardDetailsAndSourcesHeaders}
        data={qualitativeScorecardDetailsAndSourcesData}
      />
    ),
  },
  {
    id: "sources",
    title: "Sources",
    href: "#sources",
    description: (
      <p>
        This section provides the assumptions and methodologies used to estimate
        the cost components of a blue carbon project. For more detailed
        description, please download the full methodology.
      </p>
    ),
    Component: null,
  },
];
