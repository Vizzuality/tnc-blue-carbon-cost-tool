import { MethodologySection } from "@/containers/methodology/sections";
import ContentWrapper from "@/containers/methodology/wrapper";

import { List } from "@/components/ui/list";

const LimitationsOfTheTool: MethodologySection = {
  id: "limitations-of-the-tool",
  title: "Limitations of the tool",
  href: "#limitations-of-the-tool",
  Content: (
    <div className="space-y-4">
      <ContentWrapper>
        <p>
          The current version of the Blue Carbon Cost Tool has certain
          limitations, which could be addressed in future iterations:
        </p>
        <List>
          <li>
            <strong>Limited data availability:</strong> Due to the limited
            availability of real-time cost data, the model heavily relies on
            initial cost data and assumptions. Therefore, the provided
            estimations should be considered as initial high-level
            approximations. If you have additional data that can improve the
            accuracy of the model, please use the data intake form to submit
            your data (see Share Information under the{" "}
            <a className="underline" href="/profile#share-information">
              Profile section
            </a>
            ).
          </li>
          <li>
            <strong>Limited scope:</strong> Currently, the model includes data
            from only 9 countries or regions and focuses on mangroves, seagrass,
            and salt marsh ecosystems. Future editions could expand the scope by
            including more countries or regions, and additional ecosystems,
            enhancing the tool&apos;s comprehensiveness.
          </li>
          <li>
            <strong>Exclusion of Methane Emissions:</strong> Methane emissions
            from microbial activity, biomass burning, and fossil fuel use are
            excluded from the default values due to various assumptions.
            However, users can adjust project-specific parameters to include
            these emissions if relevant.
          </li>
          <li>
            <strong>Exclusion of Nitrous Oxide Emissions:</strong> Similarly,
            nitrous oxide emissions from denitrification, burning, or fossil
            fuel use are excluded in default calculations but can be
            incorporated by users through specific adjustments.
          </li>
          <li>
            <strong>
              Limited flexibility on “pre-development” phase length:
            </strong>{" "}
            The model currently allows flexibility in the timeline of the
            &quot;Conservation/Restoration&quot; phase. However, there is
            limited flexibility in the length of the &quot;pre-development&quot;
            phase, which is fixed at 4 years. Future editions of the model could
            incorporate more flexibility in the pre-development phase length.
          </li>
          <li>
            <strong>Exclusion of Inflation and other cost Increases:</strong>{" "}
            The model does not currently account for inflation or other cost
            increases. Including these factors in future iterations would
            enhance the accuracy of the model&apos;s cost estimations.
          </li>
        </List>
      </ContentWrapper>
    </div>
  ),
};

export default LimitationsOfTheTool;
