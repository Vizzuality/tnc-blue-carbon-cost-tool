import { MethodologySection } from "@/containers/methodology/sections";
import MethodologyTable from "@/containers/methodology/table";
import {
  qualitativeScorecardDetailsAndSourcesData,
  qualitativeScorecardDetailsAndSourcesHeaders,
} from "@/containers/methodology/table/data";
import ContentWrapper from "@/containers/methodology/wrapper";
const QualitativeScorecardDetailsAndSources: MethodologySection = {
  id: "qualitative-scorecard-details-and-sources",
  title: "Qualitative scorecard details and sources",
  href: "#qualitative-scorecard-details-and-sources",
  Content: (
    <div className="space-y-4">
      <ContentWrapper>
        <p>
          Methodology and sources used for the non-economic qualitative
          metrics. 
        </p>
      </ContentWrapper>
      <MethodologyTable
        headers={qualitativeScorecardDetailsAndSourcesHeaders}
        data={qualitativeScorecardDetailsAndSourcesData}
      />
    </div>
  ),
};

export default QualitativeScorecardDetailsAndSources;
