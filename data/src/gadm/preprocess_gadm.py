import os
import zipfile

import geopandas as gpd
import pandas as pd
import requests
from shapely.geometry import MultiPolygon
from shapely.validation import make_valid

# from shapely import wkt


def download_gadm_data():
    # URL with gadm data
    url = "https://geodata.ucdavis.edu/gadm/gadm4.1/gadm_410-levels.zip"

    # Folder to save the data
    folder = "../../raw_data/gadm"
    zip_path = os.path.join(folder, "gadm_410-levels.zip")

    # Create the folder if it doesn't exist
    os.makedirs(folder, exist_ok=True)

    # Download the data
    print("Downloading data from: ", url)
    response = requests.get(url)
    with open(zip_path, "wb") as f:
        f.write(response.content)
    print("Data downloaded and saved at:", zip_path)

    # Unzip the data
    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall(folder)
    print("Data unzipped in the folder:", folder)

    # Load a list of the files in the folder
    files = os.listdir(folder)
    print("Files in the folder: ", files)

    return os.path.join(folder, "gadm_410-levels.gpkg")


def load_and_clean_gadm_data(gpkg_path):
    # Load the data
    print("Loading ADM_0 layer from the geopackage...")
    adm0_gdf = gpd.read_file(gpkg_path, layer="ADM_0")

    # Clean the geometries
    print("Cleaning geometries...")
    adm0_gdf["geometry"] = adm0_gdf["geometry"].apply(fix_geometry)

    # Filter out any empty geometries
    adm0_gdf = adm0_gdf[~adm0_gdf["geometry"].is_empty]
    adm0_gdf = adm0_gdf.dropna(subset=["geometry"])

    print("Loaded and cleaned ADM_0 layer with", len(adm0_gdf), "features")

    # Simplify the geometries
    print("Simplifying geometries...")
    adm0_gdf = simplify_gdf(adm0_gdf, simplification_tolerance=0.01)

    # Save the cleaned  and simplified data
    adm0_gdf.to_file("../../raw_data/gadm/gadm_410-levels_ADM_0_cleaned.geojson", driver="GeoJSON")
    print("Cleaned data saved at: ../../raw_data/gadm/gadm_410-levels_ADM_0_cleaned.geojson")

    return adm0_gdf


def fix_geometry(geom):
    # Validate and fix geometry
    if not geom.is_valid:
        geom = make_valid(geom)
    # Ensure the geometry is in MultiPolygon format
    if geom.geom_type == "Polygon":
        geom = MultiPolygon([geom])
    return geom


def simplify_gdf(gdf, simplification_tolerance=0.01, preserve_topology=True):
    """
    Simplifies the geometries of a GeoDataFrame in place and returns it.

    Parameters:
    - gdf (GeoDataFrame): The original GeoDataFrame with geometries to simplify.
    - simplification_tolerance (float): Tolerance for simplification (e.g., 0.01 for 1% simpl).
    - preserve_topology (bool): If True, attempts to preserve the topology.

    Returns:
    - GeoDataFrame: A new GeoDataFrame with simplified geometries.
    """
    # Simplify the geometries
    simplified_gdf = gdf.copy()
    simplified_gdf["geometry"] = gdf["geometry"].simplify(
        simplification_tolerance, preserve_topology=preserve_topology
    )
    return simplified_gdf


# 3. Join geometries with CSV data
def join_with_csv(geom_gdf, csv_path, key="GID_0"):
    csv_data = pd.read_csv(csv_path)
    merged_gdf = geom_gdf.merge(csv_data, left_on=key, right_on="country_code", how="left")
    # Drop the rows with missing country names
    merged_gdf = merged_gdf.dropna(subset=["country"])
    # Save the merged data
    merged_gdf.to_file("../../raw_data/gadm/gadm_410-levels_ADM_0_merged.geojson", driver="GeoJSON")
    print("Merged data saved at: ../../raw_data/gadm/gadm_410-levels_ADM_0_merged.geojson")

    return merged_gdf


# 4. Generate SQL INSERT statement
def generate_sql_insert(row):
    sql_template = """
    INSERT INTO public.countries
    (code, name, continent, region_1, region_2, numeric_code, hdi, geometry)
    VALUES ('{code}', '{name}', '{continent}'::public.countries_continent_enum, '{region_1}', ''{region_2}'', {numeric_code}, {hdi}, '{geometry}');
    """  # noqa: E501

    geometry_wkt = row["geometry"].wkt  # Get WKT representation of the geometry
    sql = sql_template.format(
        code=row["country_code"],
        name=row["country"],
        continent=row["continent_id"],
        region_1=row["region_1"] if pd.notnull(row["region_1"]) else "NULL",
        region_2=row["region_2"] if pd.notnull(row["region_2"]) else "NULL",
        numeric_code=row["numeric"],
        hdi=row["hdi_id"] if pd.notnull(row["hdi_id"]) else "NULL",
        geometry=geometry_wkt,
    )
    return sql


# 5. Write SQL to a file
def write_sql_file(merged_gdf, output_file):
    with open(output_file, "w") as f:
        for _, row in merged_gdf.iterrows():
            if row["geometry"] is not None:
                sql_statement = generate_sql_insert(row)
                f.write(sql_statement + "\n")


if __name__ == "__main__":
    # Download the data and get the path to the GeoPackage
    gpkg_path = download_gadm_data()

    # Load anf clean the ADM_0 layer
    adm0_gdf = load_and_clean_gadm_data(gpkg_path)

    # Join with the CSV data
    csv_path = "../../raw_data/gadm/countries.csv"
    merged_gdf = join_with_csv(adm0_gdf, csv_path, key="GID_0")

    # Generate and save SQL file
    sql_file = "./insert_countries.sql"
    write_sql_file(merged_gdf, sql_file)
