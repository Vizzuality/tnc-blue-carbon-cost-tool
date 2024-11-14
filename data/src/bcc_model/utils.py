# utils.py

import numpy_financial as npf


def load_country_code(master_table, country):
    """Utility function to get the country code from the master table."""
    country_code = master_table[master_table["country"] == country]["country_code"].values[0]
    return country_code


def initialize_restoration_plan():
    restoration_plan = {i: 0 for i in range(1, 41)}
    restoration_plan[-1] = 250
    return restoration_plan


def get_value_from_master_table(master_table, country_code, ecosystem, column):
    """Utility function to get a value from the master table."""
    return master_table.loc[
        (master_table["country_code"] == country_code) & (master_table["ecosystem"] == ecosystem),
        column,
    ].values[0]


def calculate_funding_gap(reference_npv, total_revenue_npv):
    "Calculate the funding gap based on NPV values."
    value = total_revenue_npv - reference_npv
    if value > 0:
        funding_gap = 0
    else:
        funding_gap = value * -1
    return funding_gap


def aggregate_costs(cost_plan, total_cost_plan):
    """
    Helper to sum costs into the total cost plan (either capex or opex).
    Args:
        cost_plan (dict): A dictionary with year as the key and cost as the value.
        total_cost_plan (dict): The total cost plan (either for capex or opex).
    Returns:
        dict: Updated total cost plan with aggregated costs.
    """
    for year, value in cost_plan.items():
        total_cost_plan[year] += value
    return total_cost_plan


def calculate_npv(cost_plan, discount_rate, actual_year=-4):
    """Calculate NPV given a cost plan, adjusting for the correct exponent for years >= 1."""
    npv = 0

    for year, cost in cost_plan.items():
        if year == actual_year:
            npv += cost
        elif year > 0:
            npv += cost / (1 + discount_rate) ** (
                year + (-actual_year - 1)
            )  # Exponent adjusted by 4 for years > 0
        else:
            npv += cost / (1 + discount_rate) ** (-actual_year + year)

    return npv


def calculate_cost_plan(
    base_size_df, base_increase_df, project_size_ha, base_key, base_cost, activity, ecosystem
):
    """
    Utility to calculate base cost for any plan.

    Args:
        base_size_df (pd.DataFrame): DataFrame containing the base size information.
        base_increase_df (pd.DataFrame): DataFrame containing the base increase information.
        project_size_ha (float): The size of the project in hectares.
        base_key (str): The key used to filter the base size and base increase dataframes.
        base_cost (float): The base cost value associated with the project.
        activity (str): The type of activity (e.g., 'Restoration', 'Conservation').
        ecosystem (str): The ecosystem associated with the project.

    Returns:
        float: The calculated total base cost.
    """
    base_cost_value = float(base_cost)
    increased_by = float(
        base_increase_df.loc[base_increase_df["ecosystem"] == ecosystem, base_key].values[0]
    )
    base_size = float(
        base_size_df.loc[
            (base_size_df["ecosystem"] == ecosystem) & (base_size_df["activity"] == activity),
            base_key,
        ].values[0]
    )
    starting_point_scaling = 500 if activity == "Restoration" else 20000
    size_difference = project_size_ha - starting_point_scaling
    value = max(round(size_difference / base_size), 0)
    total_base_cost = base_cost_value + (increased_by * value * base_cost_value)
    return total_base_cost


def create_simple_plan(total_base_cost, years=None):
    """Utility to create a simple fixed-cost plan over the provided years."""
    if years is None:
        years = [-4, -3, -2, -1]
    return {year: total_base_cost for year in years}


def find_first_zero_value(cost_plan):
    # Start checking from year 1 upwards and return the first occurrence of a zero value
    for year, value in cost_plan.items():
        if year >= 1 and value == 0:  # Only check positive years
            return year
    return None  # Return None if no zero value is found


def calculate_irr(net_cash_flow, net_income, use_capex=False):
    """
    Calculates the IRR based on either CAPEX-OPEX net cash flow or OPEX-only net income.

    Parameters:
    - net_cash_flow (dict): Dictionary of CAPEX-OPEX net cash flow per year.
    - net_income (dict): Dictionary of OPEX-only net income per year.
    - use_capex (bool): If True, calculates IRR for CAPEX-OPEX, otherwise for OPEX-only.

    Returns:
    - IRR (float): The calculated IRR for the specified scenario.
    """
    if use_capex:
        # Use CAPEX-OPEX net cash flow
        cash_flow_array = [v for k, v in net_cash_flow.items()]
        irr = npf.irr(cash_flow_array)
    else:
        # Use OPEX-only net income
        net_income_array = [v for k, v in net_income.items()]
        irr = npf.irr(net_income_array)

    return irr
