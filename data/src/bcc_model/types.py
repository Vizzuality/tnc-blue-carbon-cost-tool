from typing import Optional, Literal, TypedDict
import pandas as pd
from pydantic import BaseModel, ConfigDict


## Param type definition for the BlueCarbonCost class
class BlueCarbonProjectParams(BaseModel):

    project_name: str
    project_size_ha: float
    activity: Literal["Restoration", "Conservation"]
    ecosystem: Literal["Mangrove", "Seagrass", "Salt marsh"]
    country: str
    master_table: pd.DataFrame
    base_size: pd.DataFrame
    base_increase: pd.DataFrame

    carbon_price: float
    carbon_revenues_to_cover: Literal["Opex", "capex+Opex"]

    # Restoration-specific
    restoration_activity: Optional[Literal["Planting", "Hybrid", "Hydrology"]] = None
    sequestration_rate_used: Optional[
        Literal[
            "Tier 1 - IPCC default value",
            "Tier 2 - Country-specific rate",
            "Tier 3 - Project-specific rate"
        ]
    ] = None
    project_specific_sequestration_rate: Optional[float] = None
    planting_success_rate: Optional[float] = None

    # Conservation-specific
    loss_rate_used: Optional[Literal["National average", "project-specific"]] = None
    project_specific_loss_rate: Optional[float] = None

    # Emission factor (Tier 3)
    emission_factor_used: Optional[
        Literal[
            "Tier 1 - Global emission factor",
            "Tier 2 - Country-specific emission factor",
            "Tier 3 - Project specific emission factor"
        ]
    ] = None
    tier_3_project_specific_emission: Optional[
        Literal["One emission factor", "AGB and SOC separately"]
    ] = None
    tier_3_project_specific_emission_one_factor: Optional[float] = None
    tier_3_emission_factor_agb: Optional[float] = None
    tier_3_emission_factor_soc: Optional[float] = None

    # Allow arbitrary types for dataframe params
    model_config = ConfigDict(arbitrary_types_allowed=True)