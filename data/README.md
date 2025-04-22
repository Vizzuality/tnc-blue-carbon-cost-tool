# TNC Blue Carbon Cost Tool

This repository contains the code and interactive notebooks for the data analysis required in the TNC Blue Carbon Cost Tool. 

## Repository Structure

### Notebooks

- **TNC_BlueCarbonTool_prototype.ipynb**  
  This interactive notebook serves as a working prototype for the Blue Carbon Cost Tool. It is intended for developers and early users to explore and validate the tool’s functionality. Key features include:  
  - **Data Ingestion & Preprocessing:** Demonstrates how raw project data is imported and cleaned.  
  - **Calculation Demonstrations:** Walks through the individual steps of calculating sequestration credits, cost estimates, and revenue/profit projections by integrating various modules from the project.  
  - **Visualization:** Presents graphs, charts, and tables that illustrate the outcomes of the calculations, helping users understand the data flow and results.  
  - **Interactive Components:** May include widgets or sliders that allow users to adjust parameters in real time to observe their impact on the outputs.  
  - **Workflow Overview:** Provides a step-by-step guide of the tool’s process—from data input to final results—making it an ideal resource for testing and prototyping.

- **High_level_overview.ipynb**  
  This notebook provides a comprehensive, non-technical overview of the Blue Carbon project and its associated cost tool. It is designed for stakeholders or users who want to understand the project’s objectives and methodology without delving deeply into code. The notebook includes:  
  - **Project Background:** An introduction to blue carbon concepts and the motivation behind developing the cost tool.  
  - **Methodological Summary:** A high-level description of the analytical approaches and calculations performed, along with an explanation of how different aspects (like cost, revenue, and sequestration credits) interact.  
  - **Results & Insights:** Summarizes key outcomes with supporting visualizations, helping users grasp the overall impact and value of the project.  
  - **Contextual Documentation:** Offers narrative explanations and commentary that link the technical results to broader project goals, making the information accessible to non-technical audiences.  
  - **References:** Provides additional resources or links for further reading on the methodologies and data used in the tool.

### Source Code (`src` Directory)

#### bcc_model Module

This module contains the core functionality for performing blue carbon project calculations. Each script is designed to handle a specific aspect of the analysis:

- **`__init__.py`**  
  Marks the directory as a Python package. It may also include package-level initializations or common imports that simplify access to the module’s functions across the project.

- **blue_carbon_project.py**  
  Acts as the main driver for the blue carbon analysis. This script orchestrates the workflow by:
  - Loading project-specific data.
  - Coordinating calls to the sequestration, revenue, and cost calculation modules.
  - Aggregating the results to produce an overall project evaluation.
  - Handling data input and output, logging, and error management to ensure the analysis runs smoothly.

- **sequestration_credits_calculator.py**  
  Contains the functions that calculate carbon sequestration credits based on project parameters. Key features include:
  - Computing sequestration based on factors such as biomass growth rates, decay factors, and regional carbon baselines.
  - Applying recognized formulas and industry standards.
  - Allowing adjustments for region-specific data to ensure accurate credit estimates.

- **revenue_profit_calculator.py**  
  Computes the potential financial returns of a blue carbon project by:
  - Estimating revenue generated from selling carbon credits.
  - Calculating profit margins after considering operational and maintenance costs.
  - Incorporating market price data and forecast scenarios to help evaluate economic viability.

- **cost_calculator.py**  
  Provides a comprehensive breakdown of project costs. Its functionality includes:
  - Estimating capital expenditures (CAPEX) such as initial setup and infrastructure investments.
  - Calculating operational expenditures (OPEX) and ongoing maintenance costs.
  - Factoring in variables like project scale, regional economic conditions, and technology deployment to generate realistic cost models.

- **utils.py**  
  A collection of helper functions used throughout the module. These utilities include:
  - Data validation routines to ensure input consistency.
  - Unit conversion functions to support various measurement systems.
  - Logging and error handling mechanisms to standardize output and troubleshooting.
  - General-purpose functions that reduce code duplication and enhance maintainability.

#### gadm Module
- **README.md**  
  Documentation for the GADM module, which deals with geographical administrative data.
- **preprocess_gadm.py**  
  Preprocesses GADM (Global Administrative Areas) data for integration with the blue carbon project.
- **insert_countries.sql**  
  An SQL script to insert country data into a database, supporting geographic data integration.

#### restored_code Module
This folder contains legacy or restored versions of the code.
- **blue_carbon_project.py**  
  A restored version of the project’s main workflow for blue carbon calculations.
- **test_calculations.py**  
  Tests to verify the accuracy of calculations in the restored code.
- **sequestration_credits_calculator.py**  
  A legacy version of the sequestration credits calculator.
- **revenue_profit_calculator.py**  
  A legacy version of the revenue and profit calculator.
- **cost_calculator.py**  
  A restored version of the cost calculator.
- **utils.py**  
  Utility functions from a previous iteration of the tool.
- **cost_calculator_bugged.py.back**  
  A backup file of an earlier, bugged version of the cost calculator for reference.

### Excel Files
- **data_ingestion_project_scorecard.xlsm**  
  An Excel workbook used for scoring data ingestion related to the project.
- **Carbon-Cost Data Upload.xlsm**  
  An Excel workbook designed for uploading and managing carbon cost data.

## Development and Testing

In order to run the code and notebooks in this repository, you will need to set up a Python environment using [uv](https://docs.astral.sh/uv/) with the required dependencies. The following steps outline the process:

1- Clone the repository:

```bash
git clone <github-repo-url>
```

2- Navigate to the project directory:

```bash
cd TNC_Blue_Carbon_Cost_Tool
```

3- Install and run the environment locally:

```bash
uv run --refresh --with jupyter jupyter lab --allow-root --no-browser --ServerApp.disable_check_xsrf=True --ServerApp.allow_remote_access=True --ServerApp.token='' --ServerApp.password=''  --ServerApp.port=<notebook port: 8887>
```
