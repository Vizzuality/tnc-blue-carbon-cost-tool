from cost_calculator import CostCalculator


class BreakevenCostCalculator:
    """
    Class to calculate the breakeven cost of carbon for a given project.
    This class uses the CostCalculator to determine the NPV covering cost
    and the number of credits issued, and iteratively adjusts the carbon price
    until the NPV covering cost is close to zero.

    Attributes:
        project (object): The project object containing project parameters.
    Methods:
        calculate_breakeven_cost(max_iterations=100, tolerance=1e-5):
            Calculates the breakeven cost of carbon for the project.
    Example:
        breakeven_cost_calculator = BreakevenCostCalculator(project)
        result = breakeven_cost_calculator.calculate_breakeven_cost()
    """

    def __init__(self, project):
        """Initialize the BreakevenCostCalculator with a project object."""
        self.project = project

    def calculate_breakeven_cost(self, max_iterations=100, tolerance=1e-5):
        """
        Method to calculate the breakeven cost of carbon
        """
        # Start the calculation with the initial carbon price
        carbon_price = self.project.carbon_price

        for iteration in range(max_iterations):
            # Update the project carbon price and initialize cost calculator
            self.project.carbon_price = carbon_price
            cost_calculator = CostCalculator(self.project)

            # Retrieve additional project parameters and cost summary
            project_params = self.project.get_project_parameters(table=False)
            cost_summary = cost_calculator.get_summary(table=False)
            cost_estimates = cost_calculator.get_cost_estimates(table=False)
            cost_pro_forma = cost_calculator.get_yearly_cost_breakdown(table=False)

            # Calculate NPV covering cost
            npv_covering_cost = cost_calculator.NPV_covering_cost
            credits_issued = cost_calculator.credits_issued

            print(f"""Iteration {iteration}: NPV covering cost = {npv_covering_cost},
            Carbon price = {carbon_price}""")

            # Check if the NPV covering cost is within the acceptable tolerance
            if abs(npv_covering_cost) < tolerance:
                print("Converged successfully.")

                return {
                    "breakeven_carbon_price": float(carbon_price),
                    "project_params": project_params,
                    "cost_summary": cost_summary,
                    "cost_estimates": cost_estimates,
                    "cost_pro_forma": cost_pro_forma,
                }

            # Ensure credits_issued is not zero to avoid division errors
            if credits_issued == 0:
                print("Error: Credits issued are zero, breakeven cost cannot be calculated.")
                return None

            # Update carbon price based on the NPV covering cost and credits issued
            carbon_price -= npv_covering_cost / credits_issued

        # If max_iterations are reached without convergence, return the last calculated price
        print("Warning: Max iterations reached without convergence.")
        return {
            "breakeven_carbon_price": float(carbon_price),
            "project_params": project_params,
            "cost_summary": cost_summary,
            "cost_estimates": cost_estimates,
            "cost_pro_forma": cost_pro_forma,
        }
