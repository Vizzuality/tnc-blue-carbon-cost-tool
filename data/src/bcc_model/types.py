from typing import Optional, Literal, TypedDict
import pandas as pd
import pydantic


## Param type definition for the BlueCarbonCost class
class BlueCarbonProjectParams(TypedDict, total=False):
    project_name: str
    activity: Literal["Restoration", "Conservation"]
    ecosystem: Literal["Mangrove", "Seagrass", "Salt marsh"]
    country: str
    master_table: pd.DataFrame
    base_size: pd.DataFrame
    base_increase: pd.DataFrame

    carbon_price: float
    carbon_revenues_to_cover: Literal["Opex", "capex+Opex"]
    project_size_ha: float

    # Restoration-specific
    restoration_activity: Optional[Literal["Planting", "Hybrid", "Hydrology"]]
    sequestration_rate_used: Optional[
        Literal[
            "Tier 1 - IPCC default value",
            "Tier 2 - Country-specific rate",
            "Tier 3 - Project-specific rate"
        ]
    ]
    project_specific_sequestration_rate: Optional[float]
    planting_success_rate: Optional[float]

    # Conservation-specific
    loss_rate_used: Optional[Literal["National average", "project-specific"]]
    project_specific_loss_rate: Optional[float]

    # Emission factor (Tier 3)
    emission_factor_used: Optional[
        Literal[
            "Tier 1 - Global emission factor",
            "Tier 2 - Country-specific emission factor",
            "Tier 3 - Project specific emission factor"
        ]
    ]
    tier_3_project_specific_emission: Optional[
        Literal["One emission factor", "AGB and SOC separately"]
    ]
    tier_3_project_specific_emission_one_factor: Optional[float]
    tier_3_emission_factor_agb: Optional[float]
    tier_3_emission_factor_soc: Optional[float]