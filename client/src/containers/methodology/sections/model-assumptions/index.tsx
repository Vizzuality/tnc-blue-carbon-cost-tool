import { SubHeader } from "@/containers/methodology/header";
import { MethodologySection } from "@/containers/methodology/sections";
import MethodologyTable from "@/containers/methodology/table";
import {
  assumptionsData,
  costComponentsData,
  costComponentsHeaders,
} from "@/containers/methodology/table/data";
import { assumptionsHeaders } from "@/containers/methodology/table/data";
import ContentWrapper from "@/containers/methodology/wrapper";

import { List } from "@/components/ui/list";

const ModelAssumptions: MethodologySection = {
  id: "model-assumptions",
  title: "Model assumptions",
  href: "#model-assumptions",
  Content: (
    <div className="space-y-4">
      <ContentWrapper>
        <SubHeader
          title="Project lifecycle"
          description="For the purposes of this tool, blue carbon project lifecycle has been separated into two main phases:"
        />
        <List>
          <li>
            <strong>Pre-development phase:</strong> Involves activities such as
            assessing the project’s feasibility, designing, funding it, and
            scoping it, and initiating its development. The duration of this
            phase can range from 1 to 10 years, as the feasibility and scoping
            of a project can vary significantly due to numerous factors
          </li>
          <li>
            <strong>Conservation/ restoration phase:</strong> the conservation/
            restoration activities are implemented, and maintained or expanded.
            The project must undergo monitoring and verification by a third
            party for carbon credits to be issued and sold. Most carbon
            standards require a project to be managed for at least 20 years,
            however, baselines must be reassessed at least every 10 years. A
            long-term financial strategy should also be developed to enable
            viability of the project beyond carbon finance. beyond carbon
            finance.
          </li>
        </List>
        <p>
          To develop a high-quality blue carbon project,&nbsp;
          <strong>community engagement</strong> is crucial across all stages of
          the lifecycle.
        </p>
        <SubHeader
          title="Project parameters"
          description="Users can input various metrics, such as project sizes, country, ecosystem, and activity type. The following key elements are worth further explanation:"
        />
        <List>
          <li>
            <strong className="underline">Carbon revenues to cover:</strong>{" "}
            Users have the flexibility to determine whether the carbon revenue
            should cover only OPEX or both CAPEX and OPEX. This feature allows
            developers flexibility whether they expect to receive grants or
            philanthropic funding to cover a portion of the costs. As the
            start-up and implementation (CAPEX) costs are generally high for
            blue carbon projects, it is recommended this is funded by other
            sources and that carbon revenues are used to support OPEX cost only.
          </li>
        </List>
        <p className="italic">For conservation projects only</p>
        <p className="italic">
          For conservation projects, we include avoided loss (100% of
          aboveground biomass at time of disturbance and a proportion of soil
          organic carbon emitted over time) and forgone sequestration. Methane
          and nitrous oxide are not included in default values but can be
          included in project-specific inputs.
        </p>
        <List>
          <li>
            <strong className="underline">Loss rate used:</strong> Users have
            the option to choose between the national average ecosystem loss
            rate or input a project-specific ecosystem loss rate. Note, there’s
            only a national average available for mangroves, whilst salt marsh
            and seagrass will provide you with a default global average
            ecosystem loss rate. If a project-specific loss rate is preferred,
            it can be entered in the cell provided below. Even though default
            loss rates don’t include background recovery rates, it is possible
            to include this in project-specific loss rates.
          </li>
          <li>
            <strong className="underline">Emission factor used:</strong> Users
            have the flexibility to select emission factors from one of 3 tiers:
            <List className="list-circle">
              <li>
                Tier 1 utilizes global default emission factors, which is a
                yearly estimate per hectare
              </li>
              <li>
                Tier 2 utilizes country-level values from literary research. AGB
                and SOC are modelled separately for these emissions.{" "}
                <span className="underline">Note</span>: only mangroves have
                Tier 2 default values.
              </li>
              <li>
                The Tier 3 emission factor is a project-specific value that
                needs to be provided by the user in the cells below. This value
                can be entered either as a single input (following the same
                approach as Tier 1) or as separate values for AGB and SOC
                (following the same approach as Tier 2)
                <List className="list-square">
                  <li>
                    Methane (CH4) and nitrous oxide (N2O) emissions are not
                    currently included in the default emission factor values of
                    the model (please refer to the “Limitations of the tool”
                    section for further details). However, it is possible to
                    incorporate CH4 and N2O emissions if the user possesses
                    project-specific data.
                  </li>
                </List>
              </li>
            </List>
          </li>
        </List>
        <p className="italic">For restoration projects only</p>
        <p className="italic">
          For restoration projects, we include sequestration rate (growth rate
          and carbon accumulation rate in soils). We do not include the avoided
          loss of soil organic carbon from degraded soils, nor do we account for
          methane or nitrous oxide in the default values. These can be included,
          however, as project-specific inputs if you have sufficient data.
        </p>
        <List>
          <li>
            <strong className="underline">Sequestration rate used:</strong>{" "}
            Users can again choose sequestration rates from one of the three
            tiers: (1) a global sequestration rate provided by the IPCC, (2) opt
            for country-specific sequestration rates, or (3) enter
            project-specific sequestration rates in the designated cell
            below.&nbsp;
            <span className="underline">Note</span>: only mangroves have Tier 2
            default values.
          </li>
          <List className="list-circle">
            <li>
              <strong>
                Methane (CH4) and nitrous oxide (N2O) emissions are not
                currently included
              </strong>
              &nbsp;in the default sequestration rate values of the model
              (please refer to the “Limitations of the tool” section for further
              details). However, it is possible to incorporate CH4 and N2O
              emissions if the user possesses project-specific data. In such
              cases, the emissions should be converted to their respective CO2e
              before being entered. For instance, if a project removes 0.71 CO2
              but introduces 0.14 tCO2e of CH4 and 0.12 tCO2e of N2O, the net
              sequestration value would be 0.45 tCO2e.
            </li>
            <li>
              We assume that all soil organic carbon has been lost
              post-disturbance. As such,&nbsp;
              <strong>
                we do not include emissions reductions from avoided loss of soil
                organic carbon
              </strong>
              . If the user has this data available, it can be included in the
              project-specific sequestration rates as described above.
            </li>
          </List>
          <li>
            <strong className="underline">Planting success rate:</strong> This
            rate is the rate or percentage of successfully established
            vegetation or trees in a reforestation or afforestation project
          </li>
        </List>
        <SubHeader
          title="Model default values"
          description="Table below showcases the model assumptions that are universally applied to all projects:"
        />
      </ContentWrapper>
      <MethodologyTable headers={assumptionsHeaders} data={assumptionsData} />
      <ContentWrapper>
        <p>
          While these assumptions have default settings, users can overwrite
          them. Here, we further elaborate on a few key assumptions:
        </p>
        <p>
          <strong className="underline">Discount rate:</strong> The model
          currently utilizes a fixed discount rate of 4%. However, this value
          can be adjusted to incorporate country-specific premiums or other
          relevant circumstances.
        </p>
        <p>
          <strong className="underline">Carbon price:</strong> The assumed
          increase in carbon price (%) does not include inflation, as the model
          does not account for inflation or cost increases in its calculations.
        </p>
        <p>
          <strong className="underline">Restoration rate:</strong> Make sure to
          adapt the restoration rate depending on what is feasibly restorable
          per year. Then adapt the project size according to this rate and the
          duration of the restoration activity. For example, if the reasonable
          restoration rate is 50 ha / year and you will restore for five years,
          your project size will be 250 ha total.
        </p>
        <p>
          <strong className="underline">Buffer:</strong> When considering carbon
          credits, it is crucial to account for non-permanence, leakage, and
          uncertainty, which are significant factors. These factors are
          encompassed within the &quot;buffer&quot; assumption in the Blue
          Carbon Cost Tool, where the default value is set at 20%.
        </p>
        <p>
          While modeling specific scenarios, it is valuable to undertake the
          exercise of calculating non-permanence, leakage, and uncertainty.
        </p>
        <List>
          <li>
            <span className="underline">Non-permanence:</span> Verra offers the
            VCS Non-permanence risk tool, which can be employed to estimate
            non-permanence. This tool considers various risks, including
            internal factors (e.g., project management, project longevity),
            natural elements (e.g., extreme weather events), and external
            influences (e.g., land tenure, political aspects).
          </li>
          <li>
            <span className="underline">Leakage:</span> Estimating leakage can
            be challenging. However, it may be minimal if the project satisfies
            specific conditions, for example the project area having been
            abandoned or previous commercial activities having been
            unprofitable. Additionally, inclusion of leakage mitigation
            activities (e.g., ecosystem services payments) within the project
            can further reduce leakage potential.
          </li>
          <li>
            <span className="underline">Uncertainty:</span> The (Verra VCS)
            allowable uncertainty is 20% at 90% confidence level (or 30% of Net
            Emissions Reductions at 95% confidence level). In cases where the
            uncertainty falls below these thresholds, no deduction for
            uncertainty would be applicable. More guidance can be found in
            Verra’s Tidal wetlands and seagrass restoration methodology. In
            cases where uncertainty falls above this threshold, you must deduct
            an amount equal to the amount that exceeds uncertainty. For example,
            if uncertainty is 28% at a 90% confidence level, you must deduct an
            additional 8% from your emissions reductions. When using the tool,
            this amount should be added to the buffer (in addition to
            non-permanence and leakage amounts).
          </li>
        </List>
        <SubHeader
          title="Cost components"
          description="The table below shows default values for each cost component. These default values serve as a baseline, but users have the flexibility to customize the output by overwriting specific cost components."
        />
      </ContentWrapper>
      <MethodologyTable
        headers={costComponentsHeaders}
        data={costComponentsData}
        categorized
      />
    </div>
  ),
};

export default ModelAssumptions;
