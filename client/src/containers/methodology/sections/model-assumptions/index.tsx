import { SubHeader } from "@/containers/methodology/header";
import { MethodologySection } from "@/containers/methodology/sections";
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
            blue carbon projects, other funding sources may be necessary while
            carbon revenues are used to support OPEX cost.
          </li>
        </List>
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
            rate or input a project-specific ecosystem loss rate. Note: national
            averages may not be available for all ecosystems, in which case the
            default global average ecosystem loss rate can be used. The user may
            also enter a project-specific loss rate in the cell provided below.
            While default loss rates don’t include background recovery rates, it
            is possible to include this in project-specific loss rates.
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
                Tier 2 utilizes country-level values from literature research.
                AGB and SOC are modelled separately for these emissions.{" "}
                <span className="underline">Note</span>: Tier 2 default values
                may not be available for all ecosystems.
              </li>
              <li>
                The Tier 3 emission factor is a project-specific value that
                needs to be provided by the user in the cells provided This
                value can be entered either as a single input (following the
                same approach as Tier 1) or as separate values for AGB and SOC
                (following the same approach as Tier 2)
                <List className="list-square">
                  <li>
                    <strong>
                      Methane (CH4) and nitrous oxide (N2O) emissions are not
                      currently included
                    </strong>{" "}
                    in the default emission factor values of the model (please
                    refer to the &apos;Limitations of the tool&apos; section for
                    further details). However, it is possible to incorporate CH4
                    and N2O emissions if the user possesses project-specific
                    data.
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
            project-specific sequestration rates in the designated cell below.
            <span className="underline">Note</span>: Tier 2 default values may
            not be available for all ecosystems.
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
          title="Model default values can be seen in the Create Custom Project feature of the tool."
          description=""
        />
      </ContentWrapper>
      <ContentWrapper>
        <p>
          While these assumptions have default settings, users can overwrite
          them. Here, we further elaborate on a few key assumptions:
        </p>
        <p>
          <strong className="underline">Discount rate:</strong> The model
          currently utilizes a fixed discount rate. However, this value can be
          adjusted to incorporate country-specific premiums or other relevant
          circumstances.
        </p>
        <p>
          <strong className="underline">Carbon price:</strong> The assumed
          increase in carbon price (%) does not include inflation, as the model
          does not account for inflation or cost increases in its calculations.
        </p>
        <p>
          <strong className="underline">Restoration rate:</strong> The user has
          an option to customize their restoration rate depending on what is
          feasibly restorable per year.
        </p>
        <p>
          <strong className="underline">Buffer:</strong> When considering carbon
          credits, it is crucial to account for non-permanence, leakage, and
          uncertainty, which can be significant factors. These factors are
          encompassed within the &quot;buffer&quot; assumption in the Blue
          Carbon Cost Tool.
        </p>
      </ContentWrapper>
    </div>
  ),
};

export default ModelAssumptions;
