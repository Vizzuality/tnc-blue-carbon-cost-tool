import { SubHeader } from "@/containers/methodology/header";
import { MethodologySection } from "@/containers/methodology/sections";
import MathComponent from "@/containers/methodology/sections/carbon-emissions-reductions-and-carbon-credit-revenues/math";
import {
  Math1,
  Math10,
  Math2,
  Math3,
  Math4,
  Math5,
  Math6,
  Math7,
  Math8,
  Math9,
} from "@/containers/methodology/sections/carbon-emissions-reductions-and-carbon-credit-revenues/math/equations";
import ContentWrapper from "@/containers/methodology/wrapper";

import { List } from "@/components/ui/list";

const CarbonEmissionsReductionsAndCarbonCreditRevenues: MethodologySection = {
  id: "carbon-emissions-reductions-and-carbon-credit-revenues",
  title: "Carbon emissions reductions and carbon credit revenues",
  href: "#carbon-emissions-reductions-and-carbon-credit-revenues",
  Content: (
    <div className="space-y-4">
      <style>
        {/* Inherit math styles from the rest of the text */}
        {`
          .methodology-math math,
          .methodology-math mrow,
          .methodology-math mi,
          .methodology-math mo,
          .methodology-math mn {
            font-family: inherit;
            font-size: inherit;
            line-height: inherit;
            color: inherit;
            font-weight: inherit;
            letter-spacing: inherit;
            font-style: inherit;
          }
        `}
      </style>
      <ContentWrapper>
        <p>
          The tool estimates carbon emission reductions compared to a baseline
          and calculates related carbon credits. Reductions can be estimated
          using three Tiers:
        </p>
        <List>
          <li>
            <strong>Tier 1:</strong> Global defaults, such as IPCC sequestration
            rates.
          </li>
          <li>
            <strong>Tier 2:</strong> Country-level data from literature
            research.
          </li>
          <li>
            <strong>Tier 3:</strong> Project-specific values requiring advanced
            datasets and monitoring. (Users can provide tier 3 data in the
            Custom Project function of the tool.)
          </li>
        </List>
        <p>
          Blue carbon credits can play a supporting role in sustaining coastal
          ecosystem projects. Though carbon finance will not typically cover all
          expenses, it is suggested that carbon finance could play a critical
          role in supporting longer term operational costs, such as monitoring,
          maintenance, and community benefits.
        </p>
        <p>
          The model assumes a default premium price of $30/ton for carbon offset
          credits, reflecting the limited availability of blue carbon credits
          and many co benefits provided by blue carbon projects. Users can
          customize this price and calculate the operational (OPEX) breakeven
          price using the tool. While additional revenue streams will likely be
          needed, the model focuses specifically on carbon credit revenues.
        </p>
        <p>
          Additional details below for calculating credible emission benefits
          (carbon credits) per year, distinguishing between restoration and
          conservation projects.
        </p>
        <SubHeader
          title="Conservation"
          description="The following formulas outline the calculation of GHG benefits per year for conservation projects using the Blue Carbon Cost Tool. The loss rate and emission factor are highly dependent on the ecosystem type and geographic location."
        />
        <MathComponent name="1">
          <Math1 />
        </MathComponent>
        <MathComponent name="2">
          <Math2 />
        </MathComponent>
        <div>
          <h5 className="underline">Tier 1:</h5>
          <p>
            When natural ecosystems are converted, carbon emissions typically do
            not all occur in the same year as the conversion. For instance,
            emissions from decaying wood can continue for an extended period.
            However, to simplify carbon accounting for Tier 1, we have assumed
            that carbon emissions were distributed evenly throughout the project
            lifecycle. Therefore, we have taken a yearly global emission factor
            (tCO2e / ha / year) as the key assumption. On top of this estimate,
            we assume that there is additional sequestration happening through
            conserving coastal ecosystems.
          </p>
        </div>
        <MathComponent name="3">
          <Math3 />
        </MathComponent>
        <div>
          <h5 className="underline">Tier 2 (only for mangroves):</h5>
          <p>
            For tier 2 estimates, we have assumed that all avoided above-ground
            biomass (AGB) emissions are accounted for in the year when the
            conversion was avoided. For the soil organic carbon (SOC), we have
            assumed that emissions were released over a specific period (10
            years). This resembles typical carbon accounting methodologies of
            carbon standards more closely. On top of AGB and SOC, the additional
            sequestration is calculated using a Tier 1 assumption to remain
            conservative. This option is currently only available for mangroves.
          </p>
        </div>
        <MathComponent name="4">
          <Math4 />
        </MathComponent>
        <p className="px-16 text-center text-sm italic">
          <span className="underline">Note:</span> The cumulative avoided loss
          for the Soil Organic Carbon considers the assumed release duration
          over time (e.g., if we have assumed the soil organic carbon is
          released over 10 years, then only the cumulative avoided loss of the
          last 10 years is counted)
        </p>
        <MathComponent name="5">
          <Math5 />
        </MathComponent>
        <div>
          <h5 className="underline">Tier 3:</h5>
          <p className="mb-4">
            Users have the ability to customize Tier 3 project-specific values
            within the Create Custom Project sheet. This can be achieved in two
            ways:
          </p>
          <List as="ol" className="list-decimal">
            <li>
              <strong>One emission factor:</strong> By utilizing a yearly
              estimate, modeled similarly to Tier 1 estimates, which is entered
              as a single value in tCO2e per hectare per year. Note: The model
              does not currently account for methane (CH4) and nitrous oxide
              (N2O) emissions in the default emission factor values. However,
              these emissions can be included if project-specific data is
              available, following the appropriate conversion to CO2e.
            </li>
            <li>
              <strong>Separate AGB and SOC:</strong> By entering a committed
              estimate for AGB (tCO2e per ha) and a yearly estimate for SOC
              (tCO2e per ha per year), both modeled similarly to Tier 2
              estimates.
            </li>
          </List>
        </div>
        <div>
          <h5 className="underline">All tiers:</h5>
          <p>
            These formulas convert the reduction in carbon credits and revenues.
            The buffer accounts for uncertainties, leakage, and non-permanence
            risks associated with the project, with a default value set at 20%.
          </p>
        </div>
        <MathComponent name="6">
          <Math6 />
        </MathComponent>
        <MathComponent name="7">
          <Math7 />
        </MathComponent>
        <SubHeader
          title="Restoration"
          description="The baseline of a restoration project is conservatively assumed to be none. Therefore, any sequestration from the project is assumed to be a significant improvement. (Note that for an actual market project, the project developer must demonstrate that natural revegetation is not occurring or account for any natural revegetation outside of the restoration activity.)"
        />
        <p>
          The following formula calculates the annual carbon benefits, credits,
          and revenues for restoration projects. The sequestration rate varies
          significantly based on the ecosystem type, geographic location, and
          selected Tier. The restored area represents the extent of land already
          restored in year t. In cases involving planting, the equation
          incorporates the planting success rate to ensure accurate
          calculations. The buffer accounts for uncertainties, leakage, and
          non-permanence risks associated with the project, with a default value
          set at 20%.
        </p>
        <MathComponent name="8">
          <Math8 />
        </MathComponent>
        <MathComponent name="9">
          <Math9 />
        </MathComponent>
        <MathComponent name="10">
          <Math10 />
        </MathComponent>
      </ContentWrapper>
    </div>
  ),
};

export default CarbonEmissionsReductionsAndCarbonCreditRevenues;
