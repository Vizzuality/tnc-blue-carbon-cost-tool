import { MethodologySection } from "@/containers/methodology/sections";
import MethodologyTable from "@/containers/methodology/table";
import { projectCostsAssumptionsAndMethodologyHeaders } from "@/containers/methodology/table/data";
import { projectCostsAssumptionsAndMethodologyData } from "@/containers/methodology/table/data";
import ContentWrapper from "@/containers/methodology/wrapper";

const ProjectCostsAssumptionsAndMethodology: MethodologySection = {
  id: "project-costs-assumptions-and-methodology",
  title: "Project costs – assumptions and methodology",
  href: "#project-costs-assumptions-and-methodology",
  Content: (
    <div className="space-y-4">
      <ContentWrapper>
        <p>
          This section provides the assumptions and methodologies used to
          estimate the cost components of a blue carbon project. For more
          detailed description, please download the full methodology.
        </p>
      </ContentWrapper>
      <MethodologyTable
        headers={projectCostsAssumptionsAndMethodologyHeaders}
        data={projectCostsAssumptionsAndMethodologyData}
        categorized
      />
    </div>
  ),
};

export default ProjectCostsAssumptionsAndMethodology;
