import { MethodologySection } from "@/containers/methodology/sections";
import VersionsTable from "@/containers/methodology/sections/versions/table";
import ContentWrapper from "@/containers/methodology/wrapper";

const Versions: MethodologySection = {
  id: "versions",
  title: "Versions",
  href: "#versions",
  Content: (
    <div className="space-y-4">
      <ContentWrapper>
        <p>
          This section compiles and documents the different changes made to the
          calculation methodology over time. Each version includes a name and a
          date of update, and reflects adjustments or improvements introduced to
          the process. Projects that have already been calculated are not
          automatically updated to the latest version of the methodology. If you
          wish to update a project to a newer version, please review the changes
          made in each field to understand how they might affect the results.
        </p>
      </ContentWrapper>
      <VersionsTable />
    </div>
  ),
};

export default Versions;
