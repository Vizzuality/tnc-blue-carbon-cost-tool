import { MethodologySection } from "@/containers/methodology/sections";
import MethodologyTable from "@/containers/methodology/table";
import {
  qualitativeScoreCardData,
  qualitativeScorecardDetailsAndSourcesData,
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
          On top of economic feasibility and abatement potential,{" "}
          <strong>qualitative, non-economic scores</strong> are also included in
          this Project Overview. These can vary depending on the country and/or
          the ecosystem. These individual non-economic scores, in addition to
          the economic feasibility and abatement potential, are then weighted to
          an overall score per project. These scores provide additional
          information to evaluate projects.
        </p>
        <p>
          Table below: Qualitative scorecard for more details behind assumptions
          and sources used to calculate these.
        </p>
      </ContentWrapper>
      <MethodologyTable data={qualitativeScoreCardData} categorized />
      <ContentWrapper>
        <p>
          Methodology and sources used for the non-economic qualitative metrics:
        </p>
      </ContentWrapper>
      <MethodologyTable data={qualitativeScorecardDetailsAndSourcesData} />
    </div>
  ),
};

export default QualitativeScorecardDetailsAndSources;
