# GADM preprocessing

This Python script automates the downloading, cleaning, and processing of GADM data, producing simplified geometries, a merged dataset with country information, and a SQL file ready for database ingestion.

## Features:

- Download GADM Data: Downloads and extracts global administrative boundaries.
- Clean and Simplify Geometries: Validates and simplifies geometries to reduce file size.
- Data Merging: Merges geometries with additional country data from a CSV file.
- SQL Generation: Generates SQL INSERT statements for easy insertion into a database.

## Script Workflow

#### 1. Download and Unzip GADM Data
The function download_gadm_data() downloads the GADM data from UC Davis and unzips it to the specified folder.

#### 2. Load and Clean Data
The function load_and_clean_gadm_data(gpkg_path) loads the ADM_0 layer (country boundaries) from the downloaded GeoPackage file, validates and fixes geometries, and simplifies them to reduce file size. Cleaned data is saved to ../../raw_data/gadm/gadm_410-levels_ADM_0_cleaned.geojson.

#### 3. Join with CSV Data
The join_with_csv() function merges country geometries with additional country information from a CSV file (e.g., countries.csv) based on a specified key (default GID_0).

#### 4. Generate SQL File
The function write_sql_file() generates SQL INSERT statements from the merged dataset, saving them to insert_countries.sql. Each statement includes geometry in Well-Known Text (WKT) format.

## How to use:

Download GADM Data and Process: Run the main script with:

```
python preprocess_gadm.py
 ```

This will:

- Download and unzip GADM data into ../../raw_data/gadm.
- Load, clean, and simplify the ADM_0 layer.
- Merge with additional country data from ../../raw_data/gadm/countries.csv.
- Generate SQL INSERT statements in insert_countries.sql.
