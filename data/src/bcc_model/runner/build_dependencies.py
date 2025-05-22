import pandas as pd
from typing import Tuple
from bcc_model.utils import generate_master_table


def get_data_dependencies(path: str) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Get the data dependencies for the BlueCarbonCost project.
    Args:
        path (str): Path to the Excel file containing the data.
    Returns:
        Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]: A tuple containing the master table, base_size and base_increase dataframes.
    """
    # Generate the master table
    master_table = generate_master_table(path)

    # Get the base size table
    base_size = pd.read_excel(path, sheet_name="Base_size_table")

    # Get the base increase table
    base_increase = pd.read_excel(path, sheet_name="Base_increase")

    return master_table, base_size, base_increase

