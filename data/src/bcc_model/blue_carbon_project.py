# src/blue_carbon_project.py
import logging

from utils import get_value_from_master_table, initialize_restoration_plan, load_country_code


class BlueCarbonProject:
    # Class-level constants
    VERIFICATION_FREQUENCY = 5
    BASELINE_REASSESSMENT_FREQUENCY = 10
    DISCOUNT_RATE = 0.04
    CARBON_PRICE_INCREASE = 0.015
    ANNUAL_COST_INCREASE = 0
    BUFFER = 0.2
    SOIL_ORGANIC_CARBON_RELEASE_LENGTH = 10
    RESTORATION_STARTING_POINT_SCALING = 500
    CONSERVATION_STARTING_POINT_SCALING = 20000
    RESTORATION_PROJECT_LENGTH = 20
    CONSERVATION_PROJECT_LENGTH = 20
    RESTORATION_RATE = 250
    DEFAULT_PROJECT_LENGTH = 40

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
        planting_success_rate=0.8,
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

        self.activity = activity  # 'Conservation' or 'Restoration'
        self.ecosystem = ecosystem
        self.master_table = master_table
        self.base_size = base_size
        self.base_increase = base_increase
        self.country = country
        self.carbon_price = carbon_price
        self.carbon_revenues_to_cover = carbon_revenues_to_cover
        self.project_size_ha = project_size_ha

        # Load country code
        self.country_code = load_country_code(self.master_table, self.country)

        # Restoration-specific attributes:
        self.restoration_activity = restoration_activity
        self.sequestration_rate_used = sequestration_rate_used
        self.project_specific_sequestration_rate = project_specific_sequestration_rate
        self.planting_success_rate = planting_success_rate

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

        # Initialize default values for additional assumptions
        self.verification_frequency = BlueCarbonProject.VERIFICATION_FREQUENCY
        self.baseline_reassessment_frequency = BlueCarbonProject.BASELINE_REASSESSMENT_FREQUENCY
        self.discount_rate = BlueCarbonProject.DISCOUNT_RATE
        self.carbon_price_increase = BlueCarbonProject.CARBON_PRICE_INCREASE
        self.annual_cost_increase = BlueCarbonProject.ANNUAL_COST_INCREASE
        self.buffer = BlueCarbonProject.BUFFER
        self.soil_organic_carbon_release_length = (
            10  # I think this is just used for conservation projects
        )
        if self.activity == "Restoration":
            self.starting_point_scaling = BlueCarbonProject.RESTORATION_STARTING_POINT_SCALING
        elif self.activity == "Conservation":
            self.starting_point_scaling = BlueCarbonProject.CONSERVATION_STARTING_POINT_SCALING

        # Initialize default project lengths
        self.conservation_project_length = BlueCarbonProject.CONSERVATION_PROJECT_LENGTH
        self.restoration_project_length = BlueCarbonProject.RESTORATION_PROJECT_LENGTH
        self.restoration_rate = (
            BlueCarbonProject.RESTORATION_RATE
        )  # Default restoration rate for all ecosystems
        self.default_project_length = BlueCarbonProject.DEFAULT_PROJECT_LENGTH

        # Initialize cost inputs with default values from master table
        self.initialize_cost_inputs()

        # Calculate additional project parameters and carbon revenues
        self.carbon_revenues_will_not_cover = (
            "Capex" if self.carbon_revenues_to_cover == "Opex" else "None"
        )
        self.calculate_project_parameters()

        # Initialize the restoration plan as part of the BlueCarbonProject
        self.restoration_plan = initialize_restoration_plan()

    def get_project_parameters(self):
        if self.activity == "Restoration":
            additional_parameters = {
                "Activity type - Restoration": self.restoration_activity,
                "Sequestration rate used": self.sequestration_rate_used,
                f"{self.sequestration_rate_used}": float(self.project_specific_sequestration_rate)
                if self.sequestration_rate_used == "Tier 3 - Project-specific rate"
                else float(self.sequestration_rate),
                "Planting Success Rate (prc)": self.planting_success_rate * 100
                if self.restoration_activity == "Planting"
                else None,
            }
            additional_assumptions = {
                "Restoration project length (yr)": self.restoration_project_length,
                "Restoration rate (ha/yr)": self.restoration_rate,
            }
        else:
            additional_parameters = {
                "Loss rate used": self.loss_rate_used,
                f"{self.loss_rate_used}": self.project_specific_loss_rate
                if self.loss_rate_used == "Project-specific"
                else self.loss_rate,
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

        return {
            "Activity": self.activity,
            "Ecosystem": self.ecosystem,
            "Country": self.country,
            "Country codee": self.country_code,
            "Project size (ha)": self.project_size_ha,
            "Initial carbon price assumption ($)": self.carbon_price,
            "Carbon revenues to cover": self.carbon_revenues_to_cover,
            "Carbon revenues will not cover": self.carbon_revenues_will_not_cover,
            f"{self.activity} additional parameters": additional_parameters,
            "Additional assumptions": {
                "Verification frequency (years)": self.verification_frequency,
                "Discount rate (%)": self.discount_rate * 100,
                "Carbon price increase (%)": self.carbon_price_increase * 100,
                "Buffer (%)": round(self.buffer * 100),
                "Baseline reassessment frequency (years)": self.baseline_reassessment_frequency,
                f"For {self.activity} projects only": additional_assumptions,
            },
            "Cost inputs": {
                "CAPEX": {
                    f"Feasibility analysis ($/project): {float(self.feasibility_analysis):,.0f}",
                    f"Conservation planning and admin ($/yr): {
                        float(self.conservation_planning_and_admin):,.0f
                        }",
                    f"Data collection and field cost ($/yr): {
                        float(self.data_collection_and_field_cost):,.0f
                        }",
                    f"Community representation ($/yr): {
                        float(self.community_representation):,.0f
                        }",
                    f"Blue carbon project planning ($/project): {
                        float(self.blue_carbon_project_planning):,.0f
                        }",
                    f"Establishing carbon rights ($/yr): {
                        float(self.establishing_carbon_rights):,.0f
                        }",
                    f"Validation ($/project): {float(self.validation):,.0f}",
                    f"Implementation labor ($/ha): {float(self.implementation_labor):,.0f}",
                },
                "OPEX": {
                    f"Monitoring ($/yr): {float(self.monitoring):,.0f}",
                    f"Maintenance (prc of implementation labor): {
                        float(self.maintenance * 100):,.0f
                        }",
                    f"Community benefit sharing fund (prc of revenue): {
                        float(self.community_benefit_sharing_fund * 100):,.0f
                        }",
                    f"Carbon standard fees ($/credit): {float(self.carbon_standard_fees):,.2f}",
                    f"Baseline reassessment ($/event): {float(self.baseline_reassessment):,.0f}",
                    f"MRV ($/event): {float(self.MRV):,.0f}",
                    f"Long-term project operating ($/yr): {
                        float(self.long_term_project_operating):,.0f
                        }",
                },
                "Other": {f"Financing cost (prc of capex) {float(self.financing_cost * 100):,.0f}"},
            },
        }

    def set_additional_assumptions(self, **kwargs):
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
            elif self.ecosystem == "Seagrass":
                self.restoration_rate = kwargs.get(
                    "restoration_rate", BlueCarbonProject.RESTORATION_RATE
                )
            elif self.ecosystem == "Salt marsh":
                self.restoration_rate = kwargs.get(
                    "restoration_rate", BlueCarbonProject.RESTORATION_RATE
                )

    def calculate_project_parameters(self):
        if self.activity == "Restoration":
            self.get_sequestration_rate()
            self.get_planting_success_rate()
        elif self.activity == "Conservation":
            self.get_loss_rate()
            self.get_emission_factor()

    def get_sequestration_rate(self):
        if self.activity != "Restoration":
            raise ValueError("Sequestration rate can only be calculated for restoration projects.")
        if self.sequestration_rate_used == "Tier 1 - IPCC default value":
            self.sequestration_rate = get_value_from_master_table(
                self.master_table, self.country_code, self.ecosystem, "tier_1_sequestration_rate"
            )
        elif self.sequestration_rate_used == "Tier 2 - Country-specific rate":
            if self.ecosystem == "Mangrove":
                self.sequestration_rate = get_value_from_master_table(
                    self.master_table,
                    self.country_code,
                    self.ecosystem,
                    "tier_2_sequestration_rate",
                )
            else:
                raise ValueError(
                    "Country-specific sequestration rate is not available for this ecosystem."
                )
        elif self.sequestration_rate_used == "Tier 3 - Project-specific rate":
            if self.project_specific_sequestration_rate is not None:
                self.sequestration_rate = self.project_specific_sequestration_rate
            else:
                raise ValueError(
                    """Project-specific sequestration rate must be provided when
                     'Tier 3 - Project-specific rate' is selected."""
                )

    def get_planting_success_rate(self):
        if self.activity != "Restoration":
            raise ValueError(
                "Planting success rate can only be calculated for restoration projects."
            )
        if self.restoration_activity == "Planting":
            if self.planting_success_rate is None:
                raise ValueError(
                    "Planting success rate must be provided when 'Planting' is selected."
                )

    def get_loss_rate(self):
        if self.activity != "Conservation":
            raise ValueError("Loss rate can only be calculated for conservation projects.")
        if self.loss_rate_used == "National average":
            self.loss_rate = get_value_from_master_table(
                self.master_table, self.country_code, self.ecosystem, "ecosystem_loss_rate"
            )
        else:
            if self.project_specific_loss_rate is not None:
                self.loss_rate = self.project_specific_loss_rate
            else:
                raise ValueError(
                    """Project-specific loss rate must be provided
                    when 'project-specific' is selected."""
                )

    def get_emission_factor(self):
        if self.activity != "Conservation":
            raise ValueError("Emission factor can only be calculated for conservation projects.")
        if self.emission_factor_used == "Tier 1 - Global emission factor":
            self.emission_factor = get_value_from_master_table(
                self.master_table, self.country_code, self.ecosystem, "tier_1_emission_factor"
            )
        elif self.emission_factor_used == "Tier 2 - Country-specific emission factor":
            self.emission_factor_AGB = get_value_from_master_table(
                self.master_table, self.country_code, self.ecosystem, "emission_factor_AGB"
            )
            self.emission_factor_SOC = get_value_from_master_table(
                self.master_table, self.country_code, self.ecosystem, "emission_factor_SOC"
            )
        elif self.emission_factor_used == "Tier 3 - Project specific emission factor":
            if self.tier_3_project_specific_emission == "One emission factor":
                self.emission_factor = self.tier_3_project_specific_emission_one_factor
                self.emission_factor_AGB = 0  # Set to None ideally
                self.emission_factor_SOC = 0
            elif self.tier_3_project_specific_emission == "AGB and SOC separately":
                self.emission_factor_AGB = self.tier_3_emission_factor_agb
                self.emission_factor_SOC = self.tier_3_emission_factor_soc
                self.logger.info(
                    f"""Emission Factor AGB: {self.tier_3_emission_factor_agb},
                     SOC: {self.tier_3_emission_factor_soc}"""
                )
            else:
                raise ValueError(
                    """Tier 3 project specific emission factor or AGB & SOC values must be provided
                    when 'Tier 3 - Project specific emission factor' is selected."""
                )

    def override_cost_input(self, **kwargs):
        # Define the mapping between input arguments and the corresponding master table columns
        cost_items = {
            "feasibility_analysis": "feasibility_analysis",
            "conservation_planning_and_admin": "conservation_planning_and_admin",
            "data_collection_and_field_cost": "data_collection_and_field_cost",
            "community_representation": "community_representation",
            "blue_carbon_project_planning": "blue_carbon_project_planning",
            "establishing_carbon_rights": "establishing_carbon_rights",
            "validation": "validation",
            "implementation_labor": "implementation_labor",
            "monitoring": "monitoring",
            "maintenance": "maintenance",
            "community_benefit_sharing_fund": "community_benefit_sharing_fund",
            "carbon_standard_fees": "carbon standard_fees",
            "baseline_reassessment": "baseline_reassessment",
            "MRV": "MRV",
            "long_term_project_operating": "long_term_project_operating_cost",
            "financing_cost": "financing_cost",
        }

        # Loop through the cost items.
        # Use the provided value or look it up in the master table
        for key, column in cost_items.items():
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
                                ]["implementation_labor_planting"].values[0],
                            )
                        elif self.restoration_activity == "Hybrid":
                            setattr(
                                self,
                                key,
                                self.master_table[
                                    (self.master_table["country_code"] == self.country_code)
                                    & (self.master_table["ecosystem"] == self.ecosystem)
                                ]["implementation_labor_hybrid"].values[0],
                            )
                        elif self.restoration_activity == "Hydrology":
                            setattr(
                                self,
                                key,
                                self.master_table[
                                    (self.master_table["country_code"] == self.country_code)
                                    & (self.master_table["ecosystem"] == self.ecosystem)
                                ]["implementation_labor_hydrology"].values[0],
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

    def update_restoration_plan(self, **kwargs):
        """
        Update the restoration plan with user-defined values for specific years.
        """
        for year, hectares in kwargs.items():
            if year in self.restoration_plan:
                self.restoration_plan[year] = hectares
            else:
                self.logger.info(f"Year {year} is not part of the restoration plan.")

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
            self.logger.info(f"Year {year}: {hectares} ha")

    def initialize_cost_inputs(self):
        # Initialize cost inputs with default values from the master table
        cost_items = {
            "feasibility_analysis": "feasibility_analysis",
            "conservation_planning_and_admin": "conservation_planning_and_admin",
            "data_collection_and_field_cost": "data_collection_and_field_cost",
            "community_representation": "community_representation",
            "blue_carbon_project_planning": "blue_carbon_project_planning",
            "establishing_carbon_rights": "establishing_carbon_rights",
            "validation": "validation",
            "implementation_labor": "implementation_labor",
            "monitoring": "monitoring",
            "maintenance": "maintenance",
            "community_benefit_sharing_fund": "community_benefit_sharing_fund",
            "carbon_standard_fees": "carbon standard_fees",
            "baseline_reassessment": "baseline_reassessment",
            "MRV": "MRV",
            "long_term_project_operating": "long_term_project_operating_cost",
            "financing_cost": "financing_cost",
        }

        for key, column in cost_items.items():
            # For 'implementation_labor', handle based on activity type
            if key == "implementation_labor":
                if self.activity == "Restoration":
                    if self.restoration_activity == "Planting":
                        value = get_value_from_master_table(
                            self.master_table,
                            self.country_code,
                            self.ecosystem,
                            "implementation_labor_planting",
                        )
                    elif self.restoration_activity == "Hybrid":
                        value = get_value_from_master_table(
                            self.master_table,
                            self.country_code,
                            self.ecosystem,
                            "implementation_labor_hybrid",
                        )
                    elif self.restoration_activity == "Hydrology":
                        value = get_value_from_master_table(
                            self.master_table,
                            self.country_code,
                            self.ecosystem,
                            "implementation_labor_hydrology",
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
