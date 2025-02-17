import { MethodologySection } from "@/containers/methodology/sections";
import MethodologyTable from "@/containers/methodology/table";
import { projectSizeAssumptionsHeaders } from "@/containers/methodology/table/data";
import { projectSizeAssumptionsData } from "@/containers/methodology/table/data";
import ContentWrapper from "@/containers/methodology/wrapper";

const ProjectSizeAssumptions: MethodologySection = {
  id: "project-size-assumptions",
  title: "Project size assumptions",
  href: "#project-size-assumptions",
  Content: (
    <div className="space-y-4">
      <ContentWrapper>
        <p>
          In the <strong>Project Overview</strong> section, project sizes were
          carefully selected to ensure real-world feasibility and enable
          meaningful comparisons across different projects. These sizes were
          determined based on their carbon equivalency and representativeness,
          allowing for straightforward “apples-to-apples” comparisons across
          various activities and ecosystem types. The table below outlines the
          project sizes for each activity and ecosystem:
        </p>
      </ContentWrapper>
      <MethodologyTable
        headers={projectSizeAssumptionsHeaders}
        data={projectSizeAssumptionsData}
      />
    </div>
  ),
};

export default ProjectSizeAssumptions;
