import logging
import re
import math

from IPython.display import Markdown, display
from v2.utils import get_value_from_master_table, load_country_code


class BlueCarbonProject:
    """
    A class representing a Blue Carbon Project, which can be either a conservation or restoration project.
    The class includes methods to initialize the project with default values and user inputs,
    calculate project parameters, and display the project details in a markdown format.
    The class also includes methods to set additional assumptions, override cost inputs,
    and update the restoration plan.
    """

    # Class-level constants
    VERIFICATION_FREQUENCY = 5
    BASELINE_REASSESSMENT_FREQUENCY = 10
    ANNUAL_COST_INCREASE = 0
    DISCOUNT_RATE = 0.04
    RESTORATION_RATE = 250
    CARBON_PRICE_INCREASE = 0.015
    BUFFER = 0.2
    SOIL_ORGANIC_CARBON_RELEASE_LENGTH = 10
    RESTORATION_STARTING_POINT_SCALING = 500
    CONSERVATION_STARTING_POINT_SCALING = 20000
    RESTORATION_PROJECT_LENGTH = 20
    CONSERVATION_PROJECT_LENGTH = 20
    DEFAULT_PROJECT_LENGTH = 40

    cost_items = {
        "feasibility_analysis": "feasibility_analysis_cost",
        "conservation_planning_and_admin": "planning_and_admin_cost",
        "data_collection_and_field_cost": "data_collection_and_field_cost",
        "community_representation": "community_representation_liaison_cost",
        "blue_carbon_project_planning": "blue_carbon_project_planning_cost",
        "establishing_carbon_rights": "establishing_carbon_rights",
        "financing_cost": "financing_cost",
        "validation": "validation_cost",
        "implementation_labor": "implementation_labor",
        "monitoring": "monitoring_cost",
        "maintenance": "maintenance",
        "carbon_standard_fees": "carbon_standard_fees",
        "community_benefit_sharing_fund": "community_benefit_sharing_fund_cost",
        "baseline_reassessment": "baseline_reassessment_cost",
        "mrv": "mrv_cost",
        "long_term_project_operating_cost": "long_term_project_operating_cost",
    }

    def __init__(
        self,
        activity,
        ecosystem,
        country,
        master_table,
        base_size,
        base_increase,
        carbon_price=30,
        carbon_revenues_to_cover="Opex",
        project_size_ha=0,
        restoration_activity=None,
        sequestration_rate_used=None,
        project_specific_sequestration_rate=None,
        planting_success_rate=0.6,
        loss_rate_used=None,
        project_specific_loss_rate=None,
        emission_factor_used=None,
        tier_3_project_specific_emission=None,
        tier_3_project_specific_emission_one_factor=None,
        tier_3_emission_factor_agb=None,
        tier_3_emission_factor_soc=None,
    ):
        """Initialize a Blue Carbon Project with default values and user inputs."""

        # Initialize logger
        self.logger = logging.getLogger(__name__)

        self.master_table = master_table
        self.base_size = base_size
        self.base_increase = base_increase

        # Set project attributes
        self.project_size_ha = project_size_ha
        self.carbon_price = carbon_price
        self.country = country
        self.ecosystem = ecosystem
        self.activity = activity  # 'Conservation' or 'Restoration'
        self.carbon_revenues_to_cover = carbon_revenues_to_cover
        self.carbon_revenues_will_not_cover = (
            "Capex" if self.carbon_revenues_to_cover == "Opex" else "None"
        )

        # Load country code
        self.country_code = load_country_code(self.master_table, self.country)

        # Conservation-specific attributes:
        self.loss_rate_used = loss_rate_used
        self.project_specific_loss_rate = project_specific_loss_rate
        self.emission_factor_used = emission_factor_used
        self.tier_3_project_specific_emission = tier_3_project_specific_emission
        self.tier_3_project_specific_emission_one_factor = (
            tier_3_project_specific_emission_one_factor
        )
        self.tier_3_emission_factor_agb = tier_3_emission_factor_agb
        self.tier_3_emission_factor_soc = tier_3_emission_factor_soc
        if self.activity == "Conservation":
            self._get_loss_rate()
            self._get_emission_factor()

        # Restoration-specific attributes:
        self.restoration_activity = restoration_activity
        self.sequestration_rate_used = sequestration_rate_used
        self.project_specific_sequestration_rate = project_specific_sequestration_rate
        self.tier_1_sequestration_rate = get_value_from_master_table(
            self.master_table, self.country_code, self.ecosystem, "tier_1_ipcc_default_value"
        )
        self.planting_success_rate = planting_success_rate
        if self.activity == "Restoration":
            self._get_sequestration_rate()
            self._get_planting_success_rate()

        # Get ecosystem extent:
        self.ecosystem_extent = get_value_from_master_table(
            self.master_table, self.country_code, self.ecosystem, "extent"
        )

        # Initialize default values for additional assumptions
        self.verification_frequency = BlueCarbonProject.VERIFICATION_FREQUENCY
        self.discount_rate = BlueCarbonProject.DISCOUNT_RATE
        self.carbon_price_increase = BlueCarbonProject.CARBON_PRICE_INCREASE
        self.buffer = BlueCarbonProject.BUFFER
        self.baseline_reassessment_frequency = BlueCarbonProject.BASELINE_REASSESSMENT_FREQUENCY
        self.annual_cost_increase = BlueCarbonProject.ANNUAL_COST_INCREASE
        self.soil_organic_carbon_release_length = (
            10  # I think this is just used for conservation projects
        )
        if self.activity == "Restoration":
            self.starting_point_scaling = BlueCarbonProject.RESTORATION_STARTING_POINT_SCALING
        elif self.activity == "Conservation":
            self.starting_point_scaling = BlueCarbonProject.CONSERVATION_STARTING_POINT_SCALING

        # Initialize default project lengths
        self.conservation_project_length = BlueCarbonProject.CONSERVATION_PROJECT_LENGTH
        self.restoration_rate = (
            BlueCarbonProject.RESTORATION_RATE
        )  # Default restoration rate for all ecosystems
        self.restoration_project_length = BlueCarbonProject.RESTORATION_PROJECT_LENGTH
        self.default_project_length = BlueCarbonProject.DEFAULT_PROJECT_LENGTH

        # Initialize the restoration plan as part of the BlueCarbonProject
        self.restoration_plan = self._initialize_restoration_plan()

        # Initialize cost inputs with default values from master table
        self._initialize_cost_inputs()

    def _get_sequestration_rate(self):
        # todo: this is not well define, we will need to first confirm if the tier 2 has value and then fall back to tier 1 if there is not
        # if self.activity != "Restoration":
        #     raise ValueError("Sequestration rate can only be calculated for restoration projects.")

        if self.sequestration_rate_used == "Tier 1 - IPCC default value":
            self.sequestration_rate = get_value_from_master_table(
                self.master_table, self.country_code, self.ecosystem, "tier_1_ipcc_default_value"
            )
        elif self.sequestration_rate_used == "Tier 2 - Country-specific rate":
            val = get_value_from_master_table(
                self.master_table,
                self.country_code,
                self.ecosystem,
                "tier_2_country_specific_rate",
            )
            if val is math.isnan(val) or val is None:
                print("yayaaa")
                # If the value is NaN or None, we raise an error
                val = get_value_from_master_table(
                    self.master_table,
                    self.country_code,
                    self.ecosystem,
                    "tier_1_ipcc_default_value",
                )

            self.sequestration_rate = val

        elif self.sequestration_rate_used == "Tier 3 - Project-specific rate":
            if self.project_specific_sequestration_rate is None:
                raise ValueError(
                    """Project-specific sequestration rate must be provided when
                     'Tier 3 - Project-specific rate' is selected."""
                )

            self.sequestration_rate = self.project_specific_sequestration_rate

    def _get_planting_success_rate(self):
        if self.activity != "Restoration":
            raise ValueError(
                "Planting success rate can only be calculated for restoration projects."
            )
        if self.restoration_activity == "Planting":
            if self.planting_success_rate is None:
                raise ValueError(
                    "Planting success rate must be provided when 'Planting' is selected."
                )

    def _get_loss_rate(self):
        if self.activity != "Conservation":
            raise ValueError("Loss rate can only be calculated for conservation projects.")
        if self.loss_rate_used == "National average":
            self.loss_rate = get_value_from_master_table(
                self.master_table, self.country_code, self.ecosystem, "loss_rate"
            )
        else:
            if self.project_specific_loss_rate is not None:
                self.loss_rate = self.project_specific_loss_rate
            else:
                raise ValueError(
                    """Project-specific loss rate must be provided
                    when 'project-specific' is selected."""
                )

    def _get_emission_factor(self):
        if self.activity != "Conservation":
            raise ValueError("Emission factor can only be calculated for conservation projects.")
        if self.emission_factor_used == "Tier 1 - Global emission factor":
            self.emission_factor = get_value_from_master_table(
                self.master_table,
                self.country_code,
                self.ecosystem,
                "tier_1_global_emission_factor",
            )
            self.emission_factor_AGB = None
            self.emission_factor_SOC = None
        elif self.emission_factor_used == "Tier 2 - Country-specific emission factor":
            self.emission_factor_AGB = get_value_from_master_table(
                self.master_table,
                self.country_code,
                self.ecosystem,
                "tier_2_country_specific_emission_factor_agb",
            )
            self.emission_factor_SOC = get_value_from_master_table(
                self.master_table,
                self.country_code,
                self.ecosystem,
                "tier_2_country_specific_emission_factor_soc",
            )
            self.emission_factor = None
        elif self.emission_factor_used == "Tier 3 - Project specific emission factor":
            if self.tier_3_project_specific_emission == "One emission factor":
                self.emission_factor = self.tier_3_project_specific_emission_one_factor
                self.emission_factor_AGB = None
                self.emission_factor_SOC = None
            elif self.tier_3_project_specific_emission == "AGB and SOC separately":
                self.emission_factor_AGB = self.tier_3_emission_factor_agb
                self.emission_factor_SOC = self.tier_3_emission_factor_soc
                self.emission_factor = None
                self.logger.info(
                    "Emission Factor AGB: %s, SOC: %s",
                    self.tier_3_emission_factor_agb,
                    self.tier_3_emission_factor_soc,
                )
            else:
                raise ValueError(
                    """Tier 3 project specific emission factor or AGB & SOC values must be provided
                    when 'Tier 3 - Project specific emission factor' is selected."""
                )

    def _initialize_restoration_plan(self):
        restoration_plan = {}
        self.updated_restoration_plan = False
        # Baseline restoration value
        if self.project_size_ha > self.restoration_rate:
            restoration_plan[-1] = self.restoration_rate
        else:
            restoration_plan[-1] = self.project_size_ha
        # Initialize remaining hectares to be restored
        remaining = self.project_size_ha
        remaining -= restoration_plan[-1]
        # Calculate the restoration plan for each year
        for year in range(1, self.restoration_project_length + 1):
            if remaining > 0:
                if remaining >= self.restoration_rate:
                    restoration_plan[year] = self.restoration_rate
                    remaining -= self.restoration_rate
                else:
                    restoration_plan[year] = remaining
                    remaining = 0
            else:
                restoration_plan[year] = 0
        return restoration_plan

    def _initialize_cost_inputs(self):
        # Initialize cost inputs with default values from the master table

        for key, column in self.cost_items.items():
            # For 'implementation_labor', handle based on activity type
            if key == "implementation_labor":
                if self.activity == "Restoration":
                    if self.restoration_activity == "Planting":
                        value = get_value_from_master_table(
                            self.master_table,
                            self.country_code,
                            self.ecosystem,
                            "planting_cost",
                        )
                    elif self.restoration_activity == "Hybrid":
                        value = get_value_from_master_table(
                            self.master_table,
                            self.country_code,
                            self.ecosystem,
                            "hybrid_cost",
                        )
                    elif self.restoration_activity == "Hydrology":
                        value = get_value_from_master_table(
                            self.master_table,
                            self.country_code,
                            self.ecosystem,
                            "hydrology_cost",
                        )
                    else:
                        value = 0  # Default value if restoration activity is not specified
                else:
                    value = 0  # Not applicable for Conservation
            else:
                value = get_value_from_master_table(
                    self.master_table, self.country_code, self.ecosystem, column
                )
            setattr(self, key, value)

    def set_additional_assumptions(self, **kwargs):
        """
        Set additional assumptions for the project.
        This method allows the user to override default values for various parameters.
        """
        # Set default values using 'or' logic for simplification
        # NOTE: Check if the user can modify this params or it is just the admin
        self.verification_frequency = kwargs.get(
            "verification_frequency", BlueCarbonProject.VERIFICATION_FREQUENCY
        )
        self.discount_rate = kwargs.get("discount_rate", BlueCarbonProject.DISCOUNT_RATE)
        self.carbon_price_increase = kwargs.get(
            "carbon_price_increase", BlueCarbonProject.CARBON_PRICE_INCREASE
        )
        self.buffer = kwargs.get("buffer", BlueCarbonProject.BUFFER)
        self.baseline_reassessment_frequency = kwargs.get(
            "baseline_reassessment_frequency", BlueCarbonProject.BASELINE_REASSESSMENT_FREQUENCY
        )

        # Set project length and restoratio rate by activity
        if self.activity == "Conservation":
            self.conservation_project_length = kwargs.get(
                "conservation_project_length", BlueCarbonProject.CONSERVATION_PROJECT_LENGTH
            )
        elif self.activity == "Restoration":
            self.restoration_project_length = kwargs.get(
                "restoration_project_length", BlueCarbonProject.RESTORATION_PROJECT_LENGTH
            )
            # NOTE: This can be unified in a single line but keeping separate as it is in the excel.
            #  Maybe in the future they use a different restoration rate based on the ecosystem
            if self.ecosystem == "Mangrove":
                self.restoration_rate = kwargs.get(
                    "restoration_rate", BlueCarbonProject.RESTORATION_RATE
                )
                self.restoration_plan = self._initialize_restoration_plan()
            elif self.ecosystem == "Seagrass":
                self.restoration_rate = kwargs.get(
                    "restoration_rate", BlueCarbonProject.RESTORATION_RATE
                )
                self.restoration_plan = self._initialize_restoration_plan()
            elif self.ecosystem == "Salt marsh":
                self.restoration_rate = kwargs.get(
                    "restoration_rate", BlueCarbonProject.RESTORATION_RATE
                )
                self.restoration_plan = self._initialize_restoration_plan()

    def get_cost_inputs(self):
        """
        Get the cost inputs for the project.
        This method retrieves the cost inputs setted in the project
        """

        return {key: getattr(self, key) for key in self.cost_items.keys()}

    def override_cost_input(self, **kwargs):
        """
        Override cost inputs with user-defined values.
        This method allows the user to set specific cost values for various parameters.
        The user can provide values for any of the cost items, and if not provided,
        the default values from the master table will be used.
        """
        # Define the mapping between input arguments and the corresponding master table columns
        # Loop through the cost items.
        # Use the provided value or look it up in the master table
        for key, column in self.cost_items.items():
            if key in kwargs and kwargs[key] is not None:
                # Set the value from kwargs
                setattr(self, key, kwargs[key])
            else:
                if key == "implementation_labor":
                    if self.activity != "Restoration":
                        # set implementation labor to None if the activity is not restoration
                        setattr(self, key, 0)
                    else:
                        if self.restoration_activity == "Planting":
                            setattr(
                                self,
                                key,
                                self.master_table[
                                    (self.master_table["country_code"] == self.country_code)
                                    & (self.master_table["ecosystem"] == self.ecosystem)
                                ]["planting_cost"].values[0],
                            )
                        elif self.restoration_activity == "Hybrid":
                            setattr(
                                self,
                                key,
                                self.master_table[
                                    (self.master_table["country_code"] == self.country_code)
                                    & (self.master_table["ecosystem"] == self.ecosystem)
                                ]["hybrid_cost"].values[0],
                            )
                        elif self.restoration_activity == "Hydrology":
                            setattr(
                                self,
                                key,
                                self.master_table[
                                    (self.master_table["country_code"] == self.country_code)
                                    & (self.master_table["ecosystem"] == self.ecosystem)
                                ]["hydrology_cost"].values[0],
                            )

                else:
                    # Default to the value from the master table if no user input
                    setattr(
                        self,
                        key,
                        self.master_table[
                            (self.master_table["country_code"] == self.country_code)
                            & (self.master_table["ecosystem"] == self.ecosystem)
                        ][column].values[0],
                    )

    def update_restoration_plan(self, restoration_plan):
        """
        Update the restoration plan with user-defined values for specific years.
        """
        self.updated_restoration_plan = True
        for year, hectares in restoration_plan.items():
            if year in self.restoration_plan:
                self.restoration_plan[year] = hectares
            else:
                self.logger.info("Year %s is not part of the restoration plan.", year)

    def calculate_total_restoration(self):
        """
        Calculate the total hectares restored over the plan period.
        """
        total_restored = sum(self.restoration_plan.values())
        return total_restored

    def print_restoration_plan(self):
        """
        Print the restoration plan showing annual restoration by year and the total.
        """
        for year, hectares in self.restoration_plan.items():
            self.logger.info("Year %s: %s ha", year, hectares)

    def get_project_parameters(self, table=True):
        """
        Display the project parameters in a markdown format.
        """
        if self.activity == "Restoration":
            additional_parameters = {
                "Activity type - Restoration": self.restoration_activity,
                "Sequestration rate used": self.sequestration_rate_used,
                f"{self.sequestration_rate_used}": float(self.project_specific_sequestration_rate)
                if self.sequestration_rate_used == "Tier 3 - Project-specific rate"
                else float(self.sequestration_rate),
                "Project-specific sequestration rate (tCO2e/ha/yr)": self.project_specific_sequestration_rate,
                "Planting Success Rate (%)": self.planting_success_rate * 100
                if self.restoration_activity == "Planting"
                else None,
            }
            additional_assumptions = {
                "Restoration rate (ha/yr)": self.restoration_rate,
                "Restoration project length (yr)": self.restoration_project_length,
            }
        else:
            additional_parameters = {
                "Loss rate used": self.loss_rate_used,
                f"{self.loss_rate_used}": self.project_specific_loss_rate
                if self.loss_rate_used == "Project-specific"
                else float(self.loss_rate),
                "Emission factor used": self.emission_factor_used,
                "Global emission factor": float(self.emission_factor)
                if self.emission_factor_used == "Tier 1 - Global emission factor"
                else None,
                "Country-specific emission factors": {
                    "Emission factor AGB": float(self.emission_factor_AGB),
                    "Emission factor SOC": float(self.emission_factor_SOC),
                }
                if self.emission_factor_used == "Tier 2 - Country-specific emission factor"
                else None,
                # noqa: E501
                "Tier 3 - Project-specific emissions - one emission factor or separate AGB and SOC": self.tier_3_project_specific_emission  # noqa: E501
                if self.emission_factor_used == "Tier 3 - Project specific emission factor"
                else None,
                "Tier 3 - Emission factor (One)": float(self.emission_factor)
                if self.tier_3_project_specific_emission == "One emission factor"
                else None,
                "Tier 3 - AGB and SOC separately": {
                    "Emission Factor AGB": float(self.emission_factor_AGB),
                    "Emission Factor SOC": float(self.emission_factor_SOC),
                }
                if self.tier_3_project_specific_emission == "AGB and SOC separately"
                else None,
            }

            additional_assumptions = {
                "Conservation project length (yr)": self.conservation_project_length
            }

        # Main parameters
        main_dict = {
            "Project size (ha)": f"{self.project_size_ha}",
            "Initial carbon price assumption ($)": self.carbon_price,
            "Country": f"{self.country}",
            "Ecosystem": f"{self.ecosystem}",
            "Activity": f"{self.activity}",
            "Carbon revenues to cover": f"{self.carbon_revenues_to_cover}",
            "Carbon revenues will not cover": f"{self.carbon_revenues_will_not_cover}",
        }
        main_table = """\
        ### Project Parameters

        | Parameter                                      | Value                                   |
        | ---------------------------------------------- | --------------------------------------- |
        """
        for key, value in main_dict.items():
            main_table += f"| {key} | {value} |\n"
        main_table = re.sub(r"\n\s+\|", "\n|", main_table.strip())
        # Additional parameters
        additional_parameters_table = f"""\
        **Additional parameters for a {self.activity} project**
        """
        for key, value in additional_parameters.items():
            additional_parameters_table += f"| {key} | {value} |\n"
        additional_parameters_table = re.sub(r"\n\s+\|", "\n|", additional_parameters_table.strip())

        # Assumptions
        assumptions_dict = {
            "Verification frequency (yr)": f"{self.verification_frequency}",
            "Discount rate (%)": f"{self.discount_rate * 100}",
            "Carbon price increase (%)": f"{self.carbon_price_increase * 100}",
            "Buffer (%)": f"{round(self.buffer * 100)}",
            "Baseline reassessment frequency (yr)": f"{self.baseline_reassessment_frequency}",
        }
        assumptions_table = """\
        ### Assumptions

        | Parameter                                      | Value                                   |
        | ---------------------------------------------- | --------------------------------------- |
        """
        for key, value in assumptions_dict.items():
            assumptions_table += f"| {key} | {value} |\n"
        assumptions_table = re.sub(r"\n\s+\|", "\n|", assumptions_table.strip())
        # Additional parameters
        additional_assumptions_table = f"""\
        **Additional assumptions for a {self.activity} project**
        """
        for key, value in additional_assumptions.items():
            additional_assumptions_table += f"| {key} | {value} |\n"
        additional_assumptions_table = re.sub(
            r"\n\s+\|", "\n|", additional_assumptions_table.strip()
        )

        # Cost inputs
        capex_cost_dict = {
            "Feasibility_analysis ($/project)": f"{float(self.feasibility_analysis):,.0f}",
            "Conservation planning and admin ($/yr)": f"{
                float(self.conservation_planning_and_admin):,.0f
            }",
            "Data collection and field cost ($/yr)": f"{
                float(self.data_collection_and_field_cost):,.0f
            }",
            "Community representation ($/yr)": f"{float(self.community_representation):,.0f}",
            "Blue carbon project planning ($/project)": f"{
                float(self.blue_carbon_project_planning):,.0f
            }",
            "Establishing carbon rights ($/yr)": f"{float(self.establishing_carbon_rights):,.0f}",
            "Validation ($/project)": f"{float(self.validation):,.0f}",
            "Implementation labor ($/ha)": f"{float(self.implementation_labor):,.0f}",
        }
        opex_cost_dict = {
            "Monitoring ($/yr)": f"{float(self.monitoring):,.0f}",
            "Maintenance (% of implementation labor)": f"{float(self.maintenance * 100):,.0f}",
            "Community benefit sharing fund (% of revenue)": f"{
                float(self.community_benefit_sharing_fund * 100):,.0f
            }",
            "Carbon standard fees ($/credit)": f"{float(self.carbon_standard_fees):,.2f}",
            "Baseline reassessment ($/event)": f"{float(self.baseline_reassessment):,.0f}",
            "MRV ($/event)": f"{float(self.mrv):,.0f}",
            "Long-term project operating ($/yr)": f"{float(self.long_term_project_operating_cost):,.0f}",
        }
        other_cost_dict = {
            "Financing cost (% of capex)": f"{float(self.financing_cost * 100):,.0f}",
        }
        cost_inputs_table = """\
        ### Cost Inputs

        | Parameter                                      | Value                                   |
        | ---------------------------------------------- | --------------------------------------- |
        | **CAPEX**                                      |                                         |
        """
        for key, value in capex_cost_dict.items():
            cost_inputs_table += f"| {key} | {value} |\n"
        cost_inputs_table += """\
        | **OPEX**                                       |                                         |
        """
        for key, value in opex_cost_dict.items():
            cost_inputs_table += f"| {key} | {value} |\n"
        cost_inputs_table += """\
        | **Other**                                       |                                         |
        """
        for key, value in other_cost_dict.items():
            cost_inputs_table += f"| {key} | {value} |\n"
        cost_inputs_table = re.sub(r"\n\s+\|", "\n|", cost_inputs_table.strip())

        # Restoration plan
        restoration_plan_table = """\
        ### Restoration Plan

        | Year                                           | Annual ha                               |
        | ---------------------------------------------- | --------------------------------------- |
        """
        for year, hectares in self.restoration_plan.items():
            restoration_plan_table += f"| {year} | {hectares} |\n"
        restoration_plan_table = re.sub(r"\n\s+\|", "\n|", restoration_plan_table.strip())
        # Combine all markdown sections
        full_markdown = "\n".join(
            [
                main_table,
                additional_parameters_table,
                assumptions_table,
                additional_assumptions_table,
                cost_inputs_table,
                restoration_plan_table,
            ]
        )

        if table:
            # Display the markdown table
            display(Markdown(full_markdown))

        return {
            "Project parameters": {
                **main_dict,
                f"For {self.activity} Projects Only": additional_parameters,
            },
            "Assumptions": {
                **assumptions_dict,
                f"For {self.activity} Projects Only": additional_assumptions,
            },
            "Cost Inputs": {
                "CAPEX": capex_cost_dict,
                "OPEX": opex_cost_dict,
                "Other": other_cost_dict,
            },
        }

    @classmethod
    def from_json(cls, data, master_table, base_size, base_increase):
        # Create instance
        if data["activity"] == "Restoration":
            project = cls(
                activity=data["activity"],
                ecosystem=data["ecosystem"],
                country=data["countryName"],
                master_table=master_table,
                base_size=base_size,
                base_increase=base_increase,
                carbon_price=data["initialCarbonPriceAssumption"],
                carbon_revenues_to_cover=data["carbonRevenuesToCover"],
                project_size_ha=data["projectSizeHa"],
                restoration_activity=data["parameters"]["restorationActivity"],
                sequestration_rate_used=data["parameters"]["tierSelector"],
                project_specific_sequestration_rate=data["parameters"][
                    "projectSpecificSequestrationRate"
                ],
                planting_success_rate=data["parameters"]["plantingSuccessRate"],
            )
        elif data["activity"] == "Conservation":
            project = cls(
                activity=data["activity"],
                ecosystem=data["ecosystem"],
                country=data["countryName"],
                master_table=master_table,
                base_size=base_size,
                base_increase=base_increase,
                carbon_price=data["initialCarbonPriceAssumption"],
                carbon_revenues_to_cover=data["carbonRevenuesToCover"],
                project_size_ha=data["projectSizeHa"],
                loss_rate_used=data["parameters"]["lossRateUsed"],
                project_specific_loss_rate=data["parameters"]["projectSpecificLossRate"],
                emission_factor_used=data["parameters"]["emissionFactorUsed"],
                tier_3_project_specific_emission=data["parameters"]["projectSpecificEmission"],
                tier_3_project_specific_emission_one_factor=data["parameters"][
                    "projectSpecificEmissionFactor"
                ],
                tier_3_emission_factor_agb=data["parameters"]["emissionFactorAGB"],
                tier_3_emission_factor_soc=data["parameters"]["emissionFactorSOC"],
            )
        else:
            raise ValueError("Activity must be either 'Restoration' or 'Conservation'.")

        # Set assumptions
        assumptions = data["assumptions"]
        if data["activity"] == "Restoration":
            project.set_additional_assumptions(
                verification_frequency=assumptions["verificationFrequency"],
                discount_rate=assumptions["discountRate"],
                carbon_price_increase=assumptions["carbonPriceIncrease"],
                buffer=assumptions["buffer"],
                baseline_reassessment_frequency=assumptions["baselineReassessmentFrequency"],
                restoration_project_length=assumptions["projectLength"],
                restoration_rate=assumptions["restorationRate"],
            )
        elif data["activity"] == "Conservation":
            project.set_additional_assumptions(
                verification_frequency=assumptions["verificationFrequency"],
                discount_rate=assumptions["discountRate"],
                carbon_price_increase=assumptions["carbonPriceIncrease"],
                buffer=assumptions["buffer"],
                baseline_reassessment_frequency=assumptions["baselineReassessmentFrequency"],
                conservation_project_length=assumptions["projectLength"],
            )
        else:
            raise ValueError("Activity must be either 'Restoration' or 'Conservation'.")

        # Override cost inputs
        # Convert keys from camelCase to snake_case if needed
        cost_inputs = data["costInputs"]

        def snake_case(k):
            return "".join(["_" + c.lower() if c.isupper() else c for c in k]).lstrip("_")

        normalized_costs = {snake_case(k): v for k, v in cost_inputs.items()}
        project.override_cost_input(**normalized_costs)

        # Set custom restoration plan
        custom_plan = {
            item["year"]: item["annualHectaresRestored"]
            for item in data["parameters"].get("customRestorationPlan", [])
        }

        if sum(custom_plan.values()) <= project.project_size_ha:
            project.update_restoration_plan(custom_plan)
        else:
            raise ValueError("Restoration plan exceeds total project size.")

        return project
