import { MethodologySection } from "@/containers/methodology/sections";
import SourcesComponent from "@/containers/methodology/sources";
import ContentWrapper from "@/containers/methodology/wrapper";

const Sources: MethodologySection = {
  id: "sources",
  title: "Sources",
  href: "#sources",
  Content: (
    <div className="space-y-4">
      <ContentWrapper>
        <p>
          This section provides the assumptions and methodologies used to
          estimate the cost components of a blue carbon project. For more
          detailed description, please download the full methodology.
        </p>
      </ContentWrapper>
      <SourcesComponent />
    </div>
  ),
};

export default Sources;
