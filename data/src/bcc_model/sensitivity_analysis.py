import pandas as pd
from v2.cost_calculator import CostCalculator
from IPython.display import Markdown, display


def compute_pct_change(min, max, base):
    """Compute the percentage change between two values."""
    pct_min = (((base - min) / base) * -1) * 100
    pct_max = ((max - base) / max) * 100
    return pct_min, pct_max


def sensitivity_analysis(carbon_project, costCalculatorEngine, range_value=25):
    min_range_factor = 1 - (range_value / 100)
    max_range_factor = 1 + (range_value / 100)
    # Calculate the range of values for each cost input parameter
    cost_input_base_parameters = carbon_project.get_cost_inputs()
    min_cost_input_base_parameters = {
        k: v * min_range_factor for k, v in cost_input_base_parameters.items()
    }
    max_cost_input_base_parameters = {
        k: v * max_range_factor for k, v in cost_input_base_parameters.items()
    }
    # Calculate the cost per tCO2e for the base project
    base_carbon_cost_per_tCO2e = costCalculatorEngine(carbon_project).cost_per_tCO2e
    # Calculate the cost per tCO2e for the min and max cost inputs
    min_cost_per_tCO2e = {}
    max_cost_per_tCO2e = {}
    pct_change = {}
    # Iterate over the cost input parameters and calculate the cost per tCO2e
    # for each parameter
    for key in cost_input_base_parameters.keys():
        # Create a new project with the modified min cost input
        cost_input_override_parameters = cost_input_base_parameters.copy()
        cost_input_override_parameters[key] = min_cost_input_base_parameters[key]
        carbon_project.override_cost_input(**cost_input_override_parameters)
        min_cost_per_tCO2e[key] = costCalculatorEngine(carbon_project).cost_per_tCO2e
        # Create a new project with the modified max cost input
        cost_input_override_parameters[key] = max_cost_input_base_parameters[key]
        carbon_project.override_cost_input(**cost_input_override_parameters)
        max_cost_per_tCO2e[key] = costCalculatorEngine(carbon_project).cost_per_tCO2e
        # Calculate the percentage change
        (pct_change[f"{key}_min"], pct_change[f"{key}_max"]) = compute_pct_change(
            min_cost_per_tCO2e[key], max_cost_per_tCO2e[key], base_carbon_cost_per_tCO2e
        )
    return min_cost_per_tCO2e, max_cost_per_tCO2e, pct_change, base_carbon_cost_per_tCO2e


def plot_sensitivity_analysis(carbon_project, calculatorEngine, export_table=False):
    # Perform the sensitivity analysis
    min_cost_per_tCO2e, max_cost_per_tCO2e, pct_change, base_carbon_cost_per_tCO2e = (
        sensitivity_analysis(carbon_project, calculatorEngine)
    )
    # Get the base cost input parameters
    cost_input_base_parameters = carbon_project.get_cost_inputs()
    # Create a DataFrame to hold the results
    df = pd.DataFrame(
        {
            "Cost Input": list(cost_input_base_parameters.keys()),
            "Min % Change": [v for k, v in pct_change.items() if "_min" in k],
            "Max % Change": [v for k, v in pct_change.items() if "_max" in k],
            "Base params": list(cost_input_base_parameters.values()),
            "Base Cost per tCO2e": [base_carbon_cost_per_tCO2e] * len(cost_input_base_parameters),
            "Min Cost per tCO2e": list(min_cost_per_tCO2e.values()),
            "Max Cost per tCO2e": list(max_cost_per_tCO2e.values()),
        }
    )
    if export_table:
        # Export the DataFrame to a CSV file
        df.to_json("../test_data/sensitivity_analysis_results_v2.json", orient="records")
        print("Sensitivity analysis results exported to sensitivity_analysis_results.csv")

    # Display the DataFrame
    display(Markdown("## Sensitivity Analysis (±25%)"))
    # Plot the results
    df.plot(
        x="Cost Input",
        y=["Min % Change", "Max % Change"],
        sharey=True,
        sharex=True,
        stacked=True,
        title="Sensitivity Analysis Results",
        ylabel="Percentage Change (%)",
        xlabel="Cost Input",
        legend=True,
        kind="barh",
        figsize=(10, 6),
        color=["#FF9999", "#66B3FF"],
    )
    display(df)
