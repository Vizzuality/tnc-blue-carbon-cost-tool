import { CustomProjectSummary } from "@shared/dtos/custom-projects/custom-project-output.dto";

import { ScrollArea } from "@/components/ui/scroll-area";

export const OVERVIEW = {
  SCORECARD_RATING:
    "The individual non-economic scores, in addition to the economic feasibility and abatement potential, are weighted using the weights on the left to an overall score per project",
  COST: "Cost per tCO2e (incl. CAPEX and OPEX)",

  ABATEMENT_POTENTIAL:
    "Estimation of the total amount of CO2e abatement that is expected during the life of the project. Used to determine whether the scale justifies the development costs",
  TOTAL_COST: "Total cost (incl. CAPEX and OPEX)",
};

export const SCORECARD_PRIORITIZATION = {
  FINANCIAL_FEASIBILITY:
    "Evaluation of the forecasted costs, revenues, and potential break-even price for carbon credits",
  LEGAL_FEASIBILITY:
    "Evaluation of whether a country has the legal protection, government infrastructure, and political support that is required for a project to successfully produce carbon credits. Focus will also be on community aspects and benefits for community",
  IMPLEMENTATION_FEASIBILITY:
    "Assessment of the permanence risk a project faces due to deforestation and natural disasters. Used to determine whether a project will achieve the estimated abatement and approval for credit issuance",
  SOCIAL_FEASIBILITY:
    "Assessment of the leakage risk a project faces from communities reverting to previous activities that degraded or destroyed ecosystems (e.g., deforestation, walling off shrimp ponds, etc.)",
  SECURITY_FEASIBILITY:
    "Assessment of the safety threat to individuals entering the country. Used to determine the physical risk posed to on-the-ground teams",
  AVAILABILITY_OF_EXPERIENCED_LABOR:
    "Assessment of whether a country has a pre-existing labor pool with experience in conservation or restoration work, based on the number of blue carbon or AFOLU carbon projects completed or in development",
  AVAILABILITY_OF_ALTERNATIVE_FUNDING:
    "Assessment of the possibility a project could access revenues outside of carbon credits (e.g., grants, biodiversity credits, resilience credits, etc.) to cover gaps between costs and carbon pricing",
  COASTAL_PROTECTION_BENEFIT:
    "Estimation of a project&apos;s ability to reduce community risk through improved coastal resilience, to inform likelihood of achieving higher credit price",
  BIODIVERSITY_BENEFIT:
    "Estimation of a project&apos;s impact on biodiversity, to inform likelihood of achieving higher credit price",
  ABATEMENT_POTENTIAL:
    "Estimation of the total amount of CO2e abatement that is expected during the life of the project. Used to determine whether the scale justifies the development costs",
};

export const KEY_COSTS = {
  TOTAL_COST: "Total cost (incl. CAPEX and OPEX)",
  IMPLEMENTATION_LABOR:
    "Only applicable to restoration. The costs associated with labor and materials required for rehabilitating the degraded area (hydrology, planting or hybrid)",
  COMMUNITY_BENEFIT_SHARING_FUND:
    "The creation of a fund to compensate for alternative livelihoods, and opportunity cost. The objective of the fund is to meet the community's socioeconomic and financial priorities, which can be realized through goods, services, infrastructure, and/or cash (e.g., textbooks, desalination plant).",
  MONITORING_AND_MAINTENANCE: (
    <>
      <ul className="space-y-2">
        <li>
          Monitoring: The expenses related to individuals moving throughout the
          project site to prevent degradation and report necessary
          actions/changes.
        </li>
        <li>
          Maintenance: Only applicable to restoration. The costs associated with
          the physical upkeep of the original implementation, such as pest
          control, removing blockages, and rebuilding small portions.
        </li>
        <li></li>
      </ul>
    </>
  ),
  COMMUNITY_REPRESENTATION:
    "Efforts aimed at obtaining community buy-in, including assessing community needs, obtaining free, prior, and informed consent, conducting stakeholder surveys, and providing education about blue carbon.",
  CONSERVATION_PLANNING:
    "Activities in the project start-up phase like project management, vendor coordination, fundraising, research, travel, etc.",
  LONG_TERM_OPERATING:
    "The expenses related to project oversight, vendor coordination, community engagement, stakeholder management, etc., during the ongoing operating years of the project.",
  CARBON_STANDARD_FEES:
    "Administrative fees charged by the carbon standard (e.g., Verra).",
};

export const FILTERS = {
  CONTINENT:
    "Continents are displayed based on the inclusion of countries with available data for blue carbon projects within each region.",
  COUNTRY:
    "Countries have been selected based on the availability of data supporting blue carbon projects.",
  ECOSYSTEM:
    "Ecosystems are categorized based on their unique coastal habitats that play a critical role in carbon sequestration and ecosystem services. These include mangroves, seagrasses, and salt marshes, each offering distinct environmental and carbon storage benefits.",
  ACTIVITY_TYPE:
    "Activity refers to the overarching strategy implemented in a blue carbon project to protect or enhance ecosystem health and carbon sequestration. Projects can focus on either Restoration or Conservation:\n\n&bull; Conservation: Aims to maintain existing ecosystems, preventing degradation and preserving their carbon sequestration potential. Conservation is cost-effective and crucial for long-term climate mitigation, offering benefits like avoiding biodiversity loss, ensuring ecosystem resilience, and reducing financial investment compared to restoration. However, proving additionality can be challenging.\n\n&bull; Restoration: Focuses on rehabilitating degraded ecosystems to restore their functionality and enhance carbon capture. While often more resource-intensive, restoration projects are highly visible and impactful. Restoration is implemented through one of three approaches: planting, hydrology, or a hybrid of the two.",
  COST: "Total cost (incl. CAPEX and OPEX)",
  ABATEMENT_POTENTIAL:
    "Estimation of the total amount of CO2e abatement that is expected during the life of the project. Used to determine whether the scale justifies the development costs",
  PROJECT_SIZE: (
    <>
      <p>
        Project size refers to the scale of restoration or conservation efforts,
        measured in hectares, and is determined using a standardized approach to
        ensure comparability across different ecosystems and project types.
      </p>
      <p>
        Sizes are defined based on their &quot;carbon equivalency&quot; — the
        impact a conservation project has on carbon emissions is aligned with an
        equivalent restoration effort.
      </p>
      <p>
        For instance, &quot;medium&quot; projects involve 500 hectares of
        restored mangroves, salt marshes, or seagrass, compared to conservation
        efforts that avoid the loss of approximately 20,000 ha of mangroves,
        4,000 ha of salt marshes, or 2,000 ha of seagrass.
      </p>
      <p>
        This method allows for meaningful &quot;apples-to-apples&quot;
        comparisons across project activities and ecosystem types.
      </p>
    </>
  ),
  CARBON_PRICING_TYPE: (
    <>
      <p>
        The Carbon Price Type defines the pricing approach used to calculate the
        cost of carbon credits, which impacts project costs, including
        contributions to the “community benefit sharing fund.” There are two
        pricing archetypes available:
      </p>
      <ul className="list-disc space-y-2 pl-4">
        <li>
          Market Price: A standardized premium price of $30 per ton of CO₂e,
          reflecting the added value of co-benefits such as climate resilience
          and biodiversity. This price is consistent across all projects.
        </li>
        <li>
          OPEX Breakeven Price: A project-specific price designed to cover the
          operational expenditure (OPEX) of an individual project. This price
          varies depending on the unique costs associated with each project.
        </li>
      </ul>
      <p>
        These two options allow for flexible cost assessments based on
        standardized market values or project-specific operational needs.
      </p>
    </>
  ),
  COST_TYPE: (
    <>
      <p>
        The Cost Type defines the method used to calculate and present project
        costs. It offers two approaches to understand the financial requirements
        of a project:
      </p>
      <ul className="list-disc space-y-2 pl-4">
        <li>
          Total Cost: The full cost of the project, including both capital
          expenditures (CAPEX) and operational expenditures (OPEX), without
          adjustments for the time value of money. This provides a
          straightforward, cumulative view of project costs.
        </li>
        <li>
          Net Present Value (NPV) Cost: The present value of total project costs
          (CAPEX + OPEX) per ton of CO₂e, excluding financing costs. The NPV
          Cost accounts for the time value of money, providing a more accurate
          view of a project&apos;s long-term financial viability. This metric
          allows for better comparison across projects by normalizing future
          costs to their present-day value.
        </li>
      </ul>
      <p>
        These two cost perspectives offer different insights into project
        affordability and financial planning.
      </p>
    </>
  ),
};

export const MAP_LEGEND =
  "Comparison of the total costs ($/tCO2e) of blue carbon projects with their carbon abatement potential (tCO₂e/yr)";

export const PROJECT_DETAILS = {
  TOTAL_PROJECT_COST_NPV:
    "The total cost represents the Net Present Value (NPV) of all expenses associated with a hypothetical blue carbon project, including both capital expenditures (CAPEX) and operating expenditures (OPEX) but excluding financing costs.",
  TOTAL_PROJECT_COST:
    "The total cost represents all expenses associated with a hypothetical blue carbon project, including both capital expenditures (CAPEX) and operating expenditures (OPEX) but excluding financing costs.",
  NET_REVENUE_AFTER_OPEX_TOTAL_COST: "OPEX gap (rounded to nearest million):",
  ABATEMENT_POTENTIAL:
    "Estimation of the total amount of CO2e abatement that is expected during the life of the project. Used to determine whether the scale justifies the development costs",
  OVERALL_SCORE:
    "The individual non-economic scores, in addition to the economic feasibility and abatement potential, are weighted to an overall score per project",
};

export const CUSTOM_PROJECT = {
  COUNTRY:
    "Countries have been selected based on the availability of data supporting blue carbon projects.",
  PROJECT_SIZE: "", // Empty as no text is shown excel sheet
  ECOSYSTEM:
    "Ecosystems are categorized based on their unique coastal habitats that play a critical role in carbon sequestration and ecosystem services. These include mangroves, seagrasses, and salt marshes, each offering distinct environmental and carbon storage benefits.",
  ACTIVITY_TYPE: (
    <div>
      <p>
        Activity refers to the overarching strategy implemented in a blue carbon
        project to protect or enhance ecosystem health and carbon sequestration.
        Projects can focus on either Restoration or Conservation:
      </p>
      <ul>
        <li>
          Conservation: Aims to maintain existing ecosystems, preventing
          degradation and preserving their carbon sequestration potential.
          Conservation is cost-effective and crucial for long-term climate
          mitigation, offering benefits like avoiding biodiversity loss,
          ensuring ecosystem resilience, and reducing financial investment
          compared to restoration. However, proving additionality can be
          challenging.
        </li>
        <li>
          Restoration: Focuses on rehabilitating degraded ecosystems to restore
          their functionality and enhance carbon capture. While often more
          resource-intensive, restoration projects are highly visible and
          impactful. Restoration is implemented through one of three approaches:
          planting, hydrology, or a hybrid of the two.
        </li>
      </ul>
    </div>
  ), // TSX
};

export const RESTORATION_PROJECT_DETAILS = {
  ACTIVITY_TYPE: (
    <div>
      <p>
        Restoration activity type describes the specific methods used in
        restoration projects to rehabilitate degraded ecosystems. The Blue
        Carbon Cost Tool supports three types of restoration activities:
      </p>
      <ul>
        <li>
          Planting: Includes activities such as planting seeds, creating
          nurseries, and other efforts to regenerate vegetation in degraded
          ecosystems.
        </li>
        <li>
          Hydrology: Focuses on repairing and restoring natural water flow and
          ecosystem health. This involves tasks like erosion control,
          excavation, and building infrastructure such as culverts or
          breakwaters. Hydrology projects often require heavy machinery and tend
          to be more capital-intensive than planting projects.
        </li>
        <li>
          Hybrid: Combines planting and hydrology techniques for a comprehensive
          restoration approach that addresses multiple ecosystem needs.
        </li>
      </ul>
      <p>
        Each restoration activity type addresses specific challenges and
        ecosystem conditions, allowing tailored interventions for maximum
        impact.
      </p>
    </div>
  ),
  SEQUESTRATION_RATE: (
    <div>
      <p>
        The sequestration rate used represents the rate at which a blue carbon
        project captures and stores carbon dioxide equivalent (CO2e) within its
        ecosystem. The tool allows selection from three tiers of sequestration
        rate options:
      </p>
      <ul>
        <li>
          Tier 1 - Global Sequestration Rate: A default value provided by the
          IPCC, applicable to all ecosystems.
        </li>
        <li>
          Tier 2 - Country-Specific Sequestration Rate: National-level
          sequestration rates, which are more specific but currently available
          only for mangroves.
        </li>
        <li>
          Tier 3 - Project-Specific Sequestration Rate: Custom sequestration
          rates based on site-specific data, entered directly into the tool.
        </li>
      </ul>
      <p>Note: only mangroves have Tier 2 default values.</p>
      <ul>
        <li>
          Methane (CH4) and nitrous oxide (N2O) emissions are not currently
          included in the default sequestration rate values of the model (please
          refer to the “Limitations of the tool” section for further details).
          However, it is possible to incorporate CH4 and N2O emissions if the
          user possesses project-specific data. In such cases, the emissions
          should be converted to their respective CO2e before being added to the
          dashboard. For instance, if a project removes 0.71 CO2 but introduces
          0.14 tCO2e of CH4 and 0.12 tCO2e of N2O, the net sequestration value
          would be 0.45 tCO2e.
        </li>
        <li>
          We assume that all soil organic carbon has been lost post-disturbance.
          As such, we do not include emissions reductions from avoided loss of
          soil organic carbon. If the user has this data available, it can be
          included in the project-specific sequestration rates as described
          above.
        </li>
      </ul>
    </div>
  ),
  PROJECT_SPECIFIC_SEQUESTRATION_RATE:
    "The project-specific sequestration rate (Tier 3) refers to a customized sequestration rate derived from detailed site-specific data unique to a particular project. This rate provides the most accurate representation of carbon sequestration potential by incorporating local environmental conditions, ecosystem characteristics, and project-specific factors. It must be directly entered into the tool to tailor calculations to the specific circumstances of the project.",
  PLANTING_SUCCESS_RATE:
    "The planting success rate refers to the percentage of vegetation or trees successfully established and thriving in a reforestation or afforestation project. This metric is critical for assessing the effectiveness of restoration activities and estimating the carbon sequestration potential of the project. A higher planting success rate indicates more robust ecosystem recovery and greater likelihood of achieving the project&apos;s environmental and climate objectives.",
};

export const CONSERVATION_PROJECT_DETAILS = {
  LOSS_RATE_USED: (
    <div>
      <p>
        The loss rate used represents the percentage of an ecosystem&apos;s
        carbon stock expected to be lost annually due to degradation or
        deforestation. The tool allows selection between:
      </p>
      <ul>
        <li>
          National average loss rate: Reflects the average rate of ecosystem
          loss specific to the country. Note: Only available for mangroves.
        </li>
        <li>
          Global average loss rate: Default values applicable to salt marshes
          and seagrass.
        </li>
        <li>
          Project-specific loss rate: A customized rate based on site-specific
          data, which can be manually entered for enhanced precision.
        </li>
      </ul>
      <p>
        While default loss rates do not factor in background recovery rates,
        these can be incorporated when using project-specific loss rates.
      </p>
    </div>
  ),

  PROJECT_SPECIFIC_LOSS_RATE: (
    <div>
      <p>
        The Project-Specific Loss Rate enables the incorporation of customized
        data on ecosystem loss tailored to the specific conditions of the
        project site. This loss rate reflects the unique degradation or
        disturbance factors affecting the project&apos;s ecosystem, allowing for
        a more accurate representation of carbon sequestration potential. It is
        particularly useful when the national or global default loss rates do
        not sufficiently capture the specific environmental, economic, or
        operational factors influencing the project area.
      </p>
    </div>
  ),

  EMISSION_FACTOR_USED: (
    <div>
      <p>
        The Emission Factor Used allows the selection of emission factors from
        three distinct tiers, providing flexibility based on the level of
        available data for the project:
      </p>
      <ul>
        <li>
          Tier 1: Utilizes global default emission factors, offering a general
          yearly estimate per hectare, suitable when local data is unavailable.
        </li>
        <li>
          Tier 2: Uses country-specific values derived from literature sources,
          modeling Above-Ground Biomass (AGB) and Soil Organic Carbon (SOC)
          emissions separately. Note: Tier 2 default values are only available
          for mangrove ecosystems.
        </li>
        <li>
          Tier 3: Enables the use of project-specific emission factors, which
          can be entered either as a single value (similar to Tier 1) or as
          separate AGB and SOC values (similar to Tier 2), based on the specific
          data available for the project.
        </li>
      </ul>
      <p>
        Note: The model does not currently account for methane (CH4) and nitrous
        oxide (N2O) emissions in the default emission factor values. However,
        these emissions can be included if project-specific data is available,
        following the appropriate conversion to CO2e.
      </p>
    </div>
  ),

  PROCET_SPECIFIC_EMISSIONS_TYPE: (
    <div>
      <p>
        The Tier 3 - Project-Specific Emissions approach allows for the highest
        level of customization and accuracy in estimating emissions. This can be
        achieved by either:
      </p>
      <ul>
        <li>
          Providing a single, consolidated emission factor specific to the
          project, which accounts for all relevant sources of emissions, or
        </li>
        <li>
          Separating emissions into Above-Ground Biomass (AGB) and Soil Organic
          Carbon (SOC) components, with distinct values entered for each.
        </li>
      </ul>
      <p>
        This tier relies on project-specific data, offering the most precise
        reflection of local conditions and practices.
      </p>
      <p>
        Note: Default values are not available for Tier 3, requiring
        comprehensive project data to be entered manually.
      </p>
    </div>
  ),

  EMISSION_FACTOR: (
    <div>
      <p>
        One emission: Tier 3 allows the use of a project-specific emission
        factor, which is entered as a single value in tCO2e per hectare per
        year. This approach provides the highest level of precision by
        incorporating local data specific to the project site. The emission
        factor represents the annual carbon emissions associated with the
        project area and can include factors like changes in vegetation or soil
        carbon stocks, tailored to the particular conditions of the project.
      </p>
    </div>
  ),

  SOC_EMISSIONS: (
    <div>
      <p>
        SOC and AGB separately: Tier 3 - Separate AGB and SOC allows for the
        entry of project-specific emission factors for both Aboveground Biomass
        (AGB) and Soil Organic Carbon (SOC), each expressed in tCO2e per hectare
        per year. By separating AGB and SOC, this approach enables a more
        detailed and tailored estimate of carbon sequestration and emissions
        specific to the project site. The AGB value represents the committed
        emissions from aboveground vegetation, such as trees, shrubs, and other
        plant matter, while the SOC value accounts for the carbon stored in the
        soil. Both of these emission factors are influenced by local conditions,
        land use practices, and ecosystem characteristics. Entering these values
        separately provides a more precise reflection of the project&apos;s
        carbon dynamics and allows for a more accurate calculation of overall
        emissions reductions or sequestration potential.
      </p>
    </div>
  ),
};

export const GENERAL_ASSUMPTIONS = {
  CARBON_REVENUES_TO_COVER: (
    <div>
      <p>
        Carbon Revenues to Cover provides the flexibility to determine whether
        carbon revenues should be used to cover only OPEX (Operational
        Expenditures) or both CAPEX (Capital Expenditures) and OPEX. This option
        allows developers to account for external funding sources such as grants
        or philanthropic contributions that may be used to cover a portion of
        the costs.
      </p>
      <p>
        Given that CAPEX, which includes start-up and implementation costs, is
        typically higher in blue carbon projects, it is generally recommended
        that these costs be covered by other funding sources. In contrast, OPEX,
        which includes ongoing operational and maintenance costs, can be
        sustainably supported by the revenue generated from carbon credits. This
        feature provides flexibility based on the funding strategy and the
        expected financial structure of the project.
      </p>
    </div>
  ),

  INITIAL_CARBON_PRICE_ASSUMPTIONS: (
    <div>
      <p>
        Initial Carbon Price Assumptions (in $) sets the default market price
        per ton of CO<sub>2</sub> equivalent (tCO<sub>2</sub>e) for carbon
        credits. This price is used to estimate potential revenue from carbon
        credits, and can be adjusted based on market conditions or projections.
      </p>
    </div>
  ),
};

export const ASSUMPTIONS = {
  VERIFICATION_FREQUENCY: (
    <div>
      <p>
        Verification Frequency refers to how often the carbon credits generated
        by the project will be verified by a third-party entity. It is typically
        set at regular intervals to ensure the project&apos;s carbon
        sequestration claims are accurate and to issue verified carbon credits
        accordingly.
      </p>
    </div>
  ),

  DISCOUNT_RATE: (
    <div>
      <p>
        The model currently utilizes a fixed discount rate of 4%. However, this
        value can be adjusted to incorporate country-specific premiums or other
        relevant circumstances. To gain more insights on this topic, we
        recommend referring to the &quot;Benchmark discount rates&quot; sheet in
        the Carbon Markets pre-feasibility tool, accessible through the Carbon
        Markets Community of Practice.
      </p>
    </div>
  ),

  CARBON_PRICE_INCREASE: (
    <div>
      <p>
        The assumed increase in carbon price (%) does not include inflation, as
        the model does not account for inflation or cost increases in its
        calculations.
      </p>
    </div>
  ),

  BUFFER: (
    <div>
      <p>
        When considering carbon credits, it is crucial to account for
        non-permanence, leakage, and uncertainty, which are significant factors.
        These factors are encompassed within the &quot;buffer&quot; assumption
        in the Blue Carbon Cost Tool, where the default value is set at 20%.
      </p>
      <p>
        While modeling specific scenarios, it is valuable to undertake the
        exercise of calculating non-permanence, leakage, and uncertainty.
      </p>
      <ul>
        <li>
          Non-permanence: Verra offers the VCS Non-permanence risk tool, which
          can be employed to estimate non-permanence. This tool considers
          various risks, including internal factors (e.g., project management,
          project longevity), natural elements (e.g., extreme weather events),
          and external influences (e.g., land tenure, political aspects).
        </li>
        <li>
          Leakage: Estimating leakage can be challenging. However, it may be
          minimal if the project satisfies specific conditions, for example the
          project area having been abandoned or previous commercial activities
          having been unprofitable. Additionally, inclusion of leakage
          mitigation activities (e.g., ecosystem services payments) within the
          project can further reduce leakage potential.
        </li>
        <li>
          Uncertainty: The allowable uncertainty is 20% at 90% confidence level
          (or 30% of Net Emissions Reductions at 95% confidence level). In cases
          where the uncertainty falls below these thresholds, no deduction for
          uncertainty would be applicable. More guidance can be found in
          Verra&apos;s Tidal wetlands and seagrass restoration methodology. In
          cases where uncertainty falls above this threshold, you must deduct an
          amount equal to the amount that exceeds uncertainty. For example, if
          uncertainty is 28% at a 90% confidence level, you must deduct an
          additional 8% from your emissions reductions. When using the tool,
          this amount should be added to the buffer (in addition to
          non-permanence and leakage amounts).
        </li>
      </ul>
    </div>
  ),

  BASELINE_REASSESSMENT_FREQUENCY: (
    <div>
      <p>
        Baseline Reassessment Frequency refers to how often the baseline
        emissions or sequestration values are reassessed to ensure the
        project&apos;s ongoing accuracy in estimating carbon impacts. This is
        typically done at regular intervals to account for changes in project
        conditions or new data, ensuring that the original assumptions remain
        valid throughout the project&apos;s lifespan.
      </p>
    </div>
  ),

  CONSERVATION_PROJECT_LENGTH: (
    <div>
      <p>
        Conservation Project Length refers to the duration over which
        conservation efforts are implemented and maintained. This includes
        activities aimed at preserving and protecting existing ecosystems to
        prevent further degradation and enhance carbon sequestration over time.
        The length of a conservation project is typically long-term, as it
        involves ongoing monitoring and management to ensure ecosystem stability
        and carbon storage potential.
      </p>
    </div>
  ),

  RESTORATION_RATE: (
    <div>
      <p>
        Make sure to adapt the restoration rate depending on what is feasibly
        restorable per year. Then adapt the project size according to this rate
        and the duration of the restoration activity. For example, if the
        reasonable restoration rate is 50 ha / year and you will restore for
        five years, your project size will be 250 ha total.
      </p>
    </div>
  ),

  RESTORATION_PROJECT_LENGTH: (
    <div>
      <p>
        Restoration Project Length refers to the duration required to restore a
        degraded ecosystem to a healthier, functional state, including the time
        needed for physical interventions (such as planting or hydrological
        modifications) and subsequent maintenance. The length can vary depending
        on the scale of restoration activities, site conditions, and the time
        required for the ecosystem to recover its full carbon sequestration
        potential.
      </p>
    </div>
  ),
};

export const COST_INPUT_OVERRIDE = {
  FEASIBILITY_ANALYSIS:
    "The production of a feasibility assessment, evaluating GHG mitigation potential and financial and non-financial considerations (e.g., legal, social).",
  CONSERVATION_PLANNING_AND_ADMIN:
    "Activities involved in the project start-up phase, such as project management, vendor coordination, fundraising, research, and travel.",
  DATA_COLLECTION_AND_FIELD_COSTS:
    "The expenses associated with onsite and field sampling to gather necessary data for conservation plan, blue carbon plan, and credit creation (e.g., carbon stock, vegetation and soil characteristics, hydrological data).",
  COMMUNITY_REPRESENTATION:
    "Efforts aimed at obtaining community buy-in, including assessing community needs, obtaining free, prior, and informed consent, conducting stakeholder surveys, and providing education about blue carbon.",
  BLUE_CARBON_PROJECT_PLANNING:
    "The preparation of the project design document (PD), which may include potential sea level rise, hydrological or other modeling.",
  ESTABLISHING_CARBON_RIGHTS:
    "Legal expenses related to clarifying carbon rights, establishing conservation and community agreements, and packaging carbon benefits for legally valid sales.",
  VALIDATION:
    "The fee or price associated with the validation of the PD (e.g., by Verra).",
  IMPLEMENTATION_LABOR:
    "Only applicable to restoration. The costs associated with labor and materials required for rehabilitating the degraded area (hydrology, planting or hybrid). Note: Certain countries, ecosystems and activity types don't have implementation labor estimates.",
  MONITORING:
    "The expenses related to individuals moving throughout the project site to prevent degradation and report necessary actions/changes.",
  MAINTENANCE:
    "Only applicable to restoration. The costs associated with the physical upkeep of the original implementation, such as pest control, removing blockages, and rebuilding small portions.",
  COMMUNITY_BENEFIT_SHARING_FUND:
    "The creation of a fund to compensate for alternative livelihoods, and opportunity cost. The objective of the fund is to meet the community&apos;s socioeconomic and financial priorities, which can be realized through goods, services, infrastructure, and/or cash (e.g., textbooks, desalination plant).",
  CARBON_STANDARD_FEES:
    "Administrative fees charged by the carbon standard (e.g., Verra).",
  BASELINE_REASSESSMENT:
    "The costs associated with a third-party assessment to ensure the initial GHG emission/reduction estimates are accurate and remain so over time.",
  MRV: "The costs associated with measuring, reporting, and verifying GHG emissions that occur post-implementation to enable carbon benefit sales through a third party.",
  LONG_TERM_PROJECT_OPERATING:
    "The expenses related to project oversight, vendor coordination, community engagement, stakeholder management, etc., during the ongoing operating years of the project.",
  FINANCING_COST:
    "The time, effort, and cost associated with securing financing for the set-up phase of the project.",
};

export const CUSTOM_PROJECT_OUTPUTS = {
  TOTAL_PROJECT_COST:
    "The total financial investment required for the project, including both capital expenditure (CAPEX) and operating expenditure (OPEX), expressed as NPV (Net Present Value).",
  NET_REVENUE_AFTER_OPEX_TOTAL_COST:
    "The remaining net revenue after accounting for all operating expenses (OPEX) associated with the project.",
  NET_REVENUE_AFTER_CAPEX_OPEX_TOTAL_COST:
    "The remaining net revenue after accounting for all capital and operating expenses (CAPEX and OPEX) associated with the project.",
  ANNUAL_PROJECT_CASH_FLOW:
    "The net amount of cash generated or consumed by the project on an annual basis, accounting for revenues, CAPEX, and OPEX.",
};

export const PROJECT_SUMMARY: Record<keyof CustomProjectSummary, string> = {
  "$/tCO2e (total cost, NPV)":
    "The NPV of the total cost (CAPEX & OPEX, excl. financing cost) divided by the total credits the project will generate.",
  "$/ha":
    "The NPV of the total cost (CAPEX & OPEX, excl. financing cost) divided by the total ha of the project",
  "IRR when priced to cover OpEx":
    "The internal rate of return (IRR) calculated when carbon credits are priced to only cover the operating expenses (OPEX).",
  "IRR when priced to cover total cost":
    "The internal rate of return (IRR) calculated when carbon credits are priced to cover both capital (CAPEX) and operating expenses (OPEX).",
  "Total cost (NPV)":
    "The NPV of the total cost associated with the hypothetical blue carbon project (incl. CAPEX and OPEX, excl. financing cost)",
  "Capital expenditure (NPV)":
    "The NPV of the CAPEX associated with the hypothetical blue carbon project",
  "Operating expenditure (NPV)":
    "The NPV of the OPEX associated with the hypothetical blue carbon project",
  "Credits issued":
    "The carbon credits issued as part of the project. The buffer has already been subtracted from this total number",
  "Total revenue (NPV)": "The NPV of the carbon credit revenues",
  "Total revenue (non-discounted)": "The non-discounted carbon credit revenues",
  "Financing cost":
    "The financing cost is the time, effort and cost associated with securing financing for the set up (pre-revenue) phase of the project. Calculated as the financing cost assumption (default 5%) multiplied by the non-discounted CAPEX total.",
  "Funding gap (NPV)":
    'The reverse of the "NPV covering OPEX" or "NPV covering total cost" metric.',
  "Funding gap per tCO2e (NPV)":
    'The reverse of the "NPV covering OPEX" or "NPV covering total cost" metric.',
  "Community benefit sharing fund":
    "The percentage of the revenues assumed to go back to the community as part of the community benefit sharing fund.",
  "Net revenue after OPEX": "TODO",
  "Net revenue after Total cost": "TODO",
};

export const COST_DETAILS = (
  <ScrollArea>
    <p>
      The cost details provide a comprehensive breakdown of the financial
      requirements for the project, divided into capital expenditure (CAPEX) and
      operating expenditure (OPEX), with values expressed in both total costs
      and their Net Present Value (NPV). Each category represents specific
      activities or components of the project:
    </p>

    <p>
      <strong>Total CAPEX:</strong> The total one-time costs required to
      establish the project.
    </p>
    <ul>
      <li>
        Feasibility Analysis: The costs for evaluating the GHG mitigation
        potential, legal, social, and financial considerations during project
        setup.
      </li>
      <li>
        Conservation Planning and Administration: Expenses for planning and
        management activities, including vendor coordination, fundraising,
        research, and travel during the setup phase.
      </li>
      <li>
        Data Collection and Field Costs: The expenses related to field sampling
        for carbon stock, vegetation, soil characteristics, and hydrological
        data collection.
      </li>
      <li>
        Community Representation / Liaison: Costs associated with engaging
        communities, obtaining informed consent, and conducting stakeholder
        surveys.
      </li>
      <li>
        Blue Carbon Project Planning: The preparation of project design
        documents, including modeling for sea level rise, hydrology, and
        ecosystem impact.
      </li>
      <li>
        Establishing Carbon Rights: Legal costs for defining carbon rights,
        establishing community agreements, and enabling valid carbon credit
        sales.
      </li>
      <li>
        Validation: Fees for third-party validation of the project design
        documentation.
      </li>
      <li>
        Implementation Labor: Costs for restoration-related labor and materials
        (if applicable, e.g., planting or hydrological interventions).
      </li>
    </ul>

    <p>
      <strong>Total OPEX:</strong> The ongoing costs required to maintain and
      monitor the project throughout its operational lifespan.
    </p>
    <ul>
      <li>
        Monitoring: Expenses for ensuring the project site remains intact, with
        regular checks to prevent degradation.
      </li>
      <li>
        Maintenance: Costs for maintaining the physical project infrastructure
        (if applicable, e.g., in restoration projects).
      </li>
      <li>
        Community Benefit Sharing Fund: A percentage of the project revenues
        allocated for community benefits, such as infrastructure, goods, or
        cash.
      </li>
      <li>
        Carbon Standard Fees: Administrative fees associated with carbon credit
        standards (e.g., registration or issuance).
      </li>
      <li>
        Baseline Reassessment: Costs for periodic re-evaluation of initial GHG
        reduction estimates.
      </li>
      <li>
        Measuring, Reporting, and Verification (MRV): Expenses for ongoing
        measurement, reporting, and verification of GHG emissions.
      </li>
      <li>
        Long-Term Project Operating: General expenses for continued oversight,
        stakeholder engagement, and vendor coordination over the project&apos;s
        lifetime.
      </li>
    </ul>

    <p>
      <strong>Total Project Cost:</strong> The sum of all CAPEX and OPEX costs,
      expressed in both total value and NPV. The total project cost gives
      stakeholders a clear view of financial investment required for the
      hypothetical blue carbon project.
    </p>
  </ScrollArea>
);

export const ANNUAL_PROJECT_CASHFLOW =
  "The Annual Project Cash Flow represents the year-by-year net financial outcome of the project, calculated as the total revenues (primarily from carbon credit sales) minus the annual operating expenditures (OPEX). This metric provides insight into the financial viability and sustainability of the project over its operational lifespan, highlighting when the project is expected to become profitable or break even";
