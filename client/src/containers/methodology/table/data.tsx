export const projectSizeAssumptionsHeaders = {
  project: "Project",
  projectSize: "Project Size",
  restorationSize: "Restoration size in ha",
  conservationSize: "Conservation size in ha (avoided loss area in ha)",
};

export const projectSizeAssumptionsData = [
  {
    project: "Mangroves",
    projectSize: "Small",
    restorationSize: 100,
    conservationSize: "4,000 (~100)",
  },
  {
    project: "Salt Marshes",
    projectSize: "Small",
    restorationSize: 100,
    conservationSize: "800 (~100)",
  },
  {
    project: "Seagrass",
    projectSize: "Small",
    restorationSize: 100,
    conservationSize: "400 (~100)",
  },
  {
    project: "Mangroves",
    projectSize: "Medium",
    restorationSize: 500,
    conservationSize: "20,000 (~500)",
  },
  {
    project: "Salt Marshes",
    projectSize: "Medium",
    restorationSize: 500,
    conservationSize: "4,000 (~500)",
  },
  {
    project: "Seagrass",
    projectSize: "Medium",
    restorationSize: 500,
    conservationSize: "2,000  (~500)",
  },
  {
    project: "Mangroves",
    projectSize: "Large",
    restorationSize: 1000,
    conservationSize: "40,000 (~1,000)",
  },
  {
    project: "Salt Marshes",
    projectSize: "Large",
    restorationSize: 1000,
    conservationSize: "8,000 (~1,000)",
  },
  {
    project: "Seagrass",
    projectSize: "Large",
    restorationSize: 1000,
    conservationSize: "4,000 (~1,000)",
  },
];

export const projectCostsAssumptionsAndMethodologyHeaders = {
  costComponent: "Cost component",
  costAssumption: "Cost assumption",
  duration: "Duration",
  whatDrivesTheCost: "What drives the cost",
};

export const projectCostsAssumptionsAndMethodologyData = [
  {
    costComponent: <p className="font-bold">Feasibility analysis</p>,
    costAssumption: (
      <ul>
        <li>US: ~$100k</li>
        <li>AUS/ BHS: ~$70k</li>
        <li>Others: ~$50k</li>
      </ul>
    ),
    duration: "One off cost",
    whatDrivesTheCost: (
      <ul className="list-disc">
        <li>Providers typically have minimum fees</li>
        <li>Location accessibility</li>
      </ul>
    ),
    category: "capex",
  },
  {
    costComponent: (
      <p className="font-bold">Conservation activity planning & admin</p>
    ),
    costAssumption: "~$167k/ year",
    duration: "4 years (start up time)",
    whatDrivesTheCost: (
      <ul className="list-disc">
        <li>Conservation professional salary</li>
        <li>Duration of project start up phase</li>
      </ul>
    ),
    category: "capex",
  },
  {
    costComponent: <p className="font-bold">Data collection and field costs</p>,
    costAssumption: "~$27k/ year",
    duration: "3 years",
    whatDrivesTheCost: (
      <ul className="list-disc">
        <li>Location accessibility</li>
        <li>Number, remoteness, and homogeneity of habitats</li>
        <li>Vendor costs</li>
      </ul>
    ),
    category: "capex",
  },
  {
    costComponent: (
      <p className="font-bold">Community representation/ liaison</p>
    ),
    costAssumption: "Between ~$65-126k /year, depending on country",
    duration: "4 years (start up time)",
    whatDrivesTheCost: (
      <ul className="list-disc">
        <li>Number of communities and their remoteness</li>
        <li>Duration of project start up phase</li>
      </ul>
    ),
    category: "capex",
  },
  {
    costComponent: <p className="font-bold">Blue carbon project planning</p>,
    costAssumption: "Between ~$43-120k/ year, depending on country",
    duration: "3 years",
    whatDrivesTheCost: (
      <ul className="list-disc">
        <li>Providers have minimums for costs of doing validation</li>
        <li>Location accessibility</li>
      </ul>
    ),
    category: "capex",
  },
  {
    costComponent: <p className="font-bold">Conservation activity</p>,
    costAssumption: "~0",
    duration: "N/A",
    whatDrivesTheCost: "N/A",
    category: "capex",
  },
  {
    costComponent: (
      <p className="font-bold">Implementation labor and engineering activity</p>
    ),
    costAssumption: "Highly dependent per ha cost by country and ecosystem",
    duration: "Dependent on restoration plan",
    whatDrivesTheCost: (
      <ul className="list-disc">
        <li>Type and severity of intervention necessary</li>
        <li>Location accessibility</li>
        <li>Labor costs within country</li>
      </ul>
    ),
    category: "capex",
  },
  {
    costComponent: (
      <p className="font-bold">Monitoring/ Guarding/ Surveilling</p>
    ),
    costAssumption: "Highly dependent on salaries in country",
    duration: "Every year after project set up",
    whatDrivesTheCost: (
      <ul className="list-disc">
        <li>Project size</li>
        <li>Degradation driver</li>
        <li>Desire to employ more community members hired for this role</li>
      </ul>
    ),
    category: "opex",
  },
  {
    costComponent: <p className="font-bold">Maintenance</p>,
    costAssumption:
      "8% of implementation cost, for 3 years after the implementation",
    duration: "Three years after implementation",
    whatDrivesTheCost: (
      <ul className="list-disc">
        <li>Scale of original implementation</li>
      </ul>
    ),
    category: "opex",
  },
  {
    costComponent: <p className="font-bold">Community benefit sharing fund</p>,
    costAssumption:
      "5% of carbon credit revenues (developed countries), 50%-85% (developing country)",
    duration: "Each year with carbon credit revenues",
    whatDrivesTheCost: (
      <ul className="list-disc">
        <li>Value of other opportunities from land</li>
        <li>
          Degree of economic contribution to community from ecosystem
          degradation
        </li>
      </ul>
    ),
    category: "opex",
  },
  {
    costComponent: <p className="font-bold">Baseline Reassessment</p>,
    costAssumption: "$40,000 / baseline reassessment",
    duration: "Every 10 years",
    whatDrivesTheCost: (
      <ul className="list-disc">
        <li>
          Providers have minimums for costs of doing a baseline reassessment
        </li>
        <li>Location accessibility</li>
      </ul>
    ),
    category: "opex",
  },
  {
    costComponent: (
      <p className="font-bold">Measurement, Reporting and Verification (MRV)</p>
    ),
    costAssumption: "$100k (US, AUS, BA), $75k (others)",
    duration: "Every 5 years",
    whatDrivesTheCost: (
      <ul className="list-disc">
        <li>Providers have minimums for costs of doing an MRV</li>
        <li>Location accessibility</li>
      </ul>
    ),
    category: "opex",
  },
  {
    costComponent: (
      <p className="font-bold">Long term project operating admin</p>
    ),
    costAssumption: "$17k-130k (depending on country)",
    duration: "Every year",
    whatDrivesTheCost: (
      <ul className="list-disc">
        <li>Number of communities and their remoteness</li>
        <li>Number, remoteness, and homogeneity of habitats</li>
      </ul>
    ),
    category: "opex",
  },
  {
    costComponent: <p className="font-bold">Carbon standard fees</p>,
    costAssumption: "$0.2 per Verified Carbon Unit (VCU)",
    duration: "Each year when credits are issued",
    whatDrivesTheCost: (
      <ul className="list-disc">
        <li>
          Fee is set by third parties and has breakpoints based on credits sold
        </li>
      </ul>
    ),
    category: "opex",
  },
  {
    costComponent: <p className="font-bold">Financing cost</p>,
    costAssumption: "5% of CAPEX",
    duration: "One off cost",
    whatDrivesTheCost: (
      <ul className="list-disc">
        <li>Cost of doing business in the project country</li>
        <li>Magnitude of the funding gap</li>
      </ul>
    ),
    category: "financing",
  },
];

export const assumptionsHeaders = {
  assumptions: "Assumptions",
  units: "Units",
  value: "Value",
};

export const assumptionsData = [
  {
    assumptions: "Verification frequency",
    units: "yrs",
    value: 5,
  },
  {
    assumptions: "Baseline reassessment frequency",
    units: "yrs",
    value: 10,
  },
];

export const qualitativeScorecardDetailsAndSourcesHeaders = {
  metric: "Metric",
  weighting: "Weighting",
  whatWeCanMeasure: "What we can measure",
  howWeWillMeasure: "How we will measure",
  variesBy: "Varies by",
  sources: "Sources",
};

export const qualitativeScorecardDetailsAndSourcesData = [
  {
    metric: <span className="font-bold">Legal feasibility</span>,
    weighting: 12,
    whatWeCanMeasure: (
      <ul className="space-y-2">
        <li>Country stability, ability to protect legal rights</li>
        <li>Government’s climate commitment</li>
      </ul>
    ),
    howWeWillMeasure: (
      <>
        <p>Weighted average (of percentile):</p>
        <ul className="list-disc">
          <li>
            Count of blue carbon projects (all) or AFOLU projects (only in
            development or completed)
          </li>
          <li>Index of Economic Freedom</li>
          <li>-NDC Commitment Strength</li>
        </ul>
      </>
    ),
    variesBy: "Country",
    sources: (
      <ul className="space-y-2">
        <li>Verra & Plan Vivo Registries</li>
        <li>World Bank</li>
        <li>Climate Watch</li>
      </ul>
    ),
  },
  {
    metric: <span className="font-bold">Implementation risk score</span>,
    weighting: 12,
    whatWeCanMeasure: (
      <p>Permanence risk from mangrove deforestation, or natural disasters</p>
    ),
    howWeWillMeasure: (
      <>
        <p>Weighted average (of percentile):</p>
        <ul className="list-disc">
          <li>Mangrove loss rate</li>
          <li>
            Disaster risk exposure rating (layered with specific info for key
            countries)
          </li>
        </ul>
      </>
    ),
    variesBy: "Country",
    sources: (
      <ul className="space-y-2">
        <li>Global Mangrove Watch</li>
        <li>World Risk Report (RUB, IFHV)</li>
      </ul>
    ),
  },
  {
    metric: <span className="font-bold">Social feasibility</span>,
    weighting: 12,
    whatWeCanMeasure: (
      <p>
        Leakage risk from community activities (e.g., deforestation for shrimp
        farming)
      </p>
    ),
    howWeWillMeasure: (
      <>
        <p>Qualitative analysis by ecosystem:</p>
        <ul className="list-disc">
          <li>
            Likelihood communities will return to the destructive activities
            that led to initial degradation
          </li>
        </ul>
      </>
    ),
    variesBy: "Country / Ecosystem",
    sources: (
      <ul className="space-y-2">
        <li>Independent research</li>
        <li>Expert interviews</li>
      </ul>
    ),
  },
  {
    metric: (
      <span className="font-bold">Availability of experienced labor</span>
    ),
    weighting: 10,
    whatWeCanMeasure: (
      <p>Size of labor pool experienced in restoration or conservation work</p>
    ),
    howWeWillMeasure: (
      <>
        <p>Percentile:</p>
        <ul className="list-disc">
          <li>
            Count of blue carbon projects (all) or AFOLU projects (only in
            development or completed)
          </li>
        </ul>
      </>
    ),
    variesBy: "Country",
    sources: (
      <ul className="space-y-2">
        <li>Verra & Plan Vivo Registries</li>
      </ul>
    ),
  },
  {
    metric: <span className="font-bold">Security rating</span>,
    weighting: 5,
    whatWeCanMeasure: <p>Safety threat to on-the-ground team</p>,
    howWeWillMeasure: (
      <>
        <p>Weighted average (of percentile):</p>
        <ul className="list-disc">
          <li>Global Peace Index</li>
          <li>US Travel Risk Rating</li>
        </ul>
      </>
    ),
    variesBy: "Country",
    sources: (
      <ul className="space-y-2">
        <li>Institute for Economics & Peace</li>
        <li>US Travel Risk Rating</li>
      </ul>
    ),
  },
  {
    metric: (
      <span className="font-bold">Availability of alternative funding</span>
    ),
    weighting: 5,
    whatWeCanMeasure: (
      <p>
        Countries providing funds to / or receiving funds from UNFCCC Green
        Climate Fund
      </p>
    ),
    howWeWillMeasure: (
      <>
        <p>Percentile:</p>
        <ul className="list-disc">
          <li>Contribution amount (for contributing nations)</li>
          <li>Financing amount (for recipient nations)</li>
        </ul>
      </>
    ),
    variesBy: "Country",
    sources: (
      <ul className="space-y-2">
        <li>UNFCCC</li>
        <li>Expert interviews</li>
      </ul>
    ),
  },
  {
    metric: <span className="font-bold">Coastal protection benefit</span>,
    weighting: 3,
    whatWeCanMeasure: (
      <>
        <p>Percentile:</p>
        <ul className="list-disc">
          <li>
            Count of individuals receiving coastal resiliency benefit over
            country population in low coastal zones
          </li>
        </ul>
      </>
    ),
    howWeWillMeasure: (
      <>
        <p>Percentile:</p>
        <ul className="list-disc">
          <li>Contribution amount (for contributing nations)</li>
          <li>Financing amount (for recipient nations)</li>
        </ul>
      </>
    ),
    variesBy: "Country / Eco",
    sources: (
      <ul className="space-y-2">
        <li>TNC Naturebase co-benefit study</li>
      </ul>
    ),
  },
  {
    metric: <span className="font-bold">Biodiversity benefit</span>,
    weighting: 3,
    whatWeCanMeasure: (
      <p>
        Typical biodiversity co-benefits delivered by projects with same
        ecosystem characteristics
      </p>
    ),
    howWeWillMeasure: (
      <>
        <p>Percentile:</p>
        <ul className="list-disc">
          <li>
            Size of overlap between top priority Marine Protected Areas (MPAs)
            and country Exclusive Economic Zone (EEZs)
          </li>
        </ul>
      </>
    ),
    variesBy: "Country",
    sources: (
      <ul className="space-y-2">
        <li>
          Priority Areas for Marine Biodiversity Conservation – University of
          Auckland
        </li>
      </ul>
    ),
  },
];
