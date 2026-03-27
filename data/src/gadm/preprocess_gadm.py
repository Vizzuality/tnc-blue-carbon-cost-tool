from pathlib import Path
import zipfile

import geopandas as gpd
import pandas as pd
import requests
from shapely.geometry import MultiPolygon
from shapely.validation import make_valid

from tqdm.auto import tqdm


# from shapely import wkt
def download_gadm_data(path: str | None = None) -> Path:
    # URL with gadm data
    url = "https://geodata.ucdavis.edu/gadm/gadm4.1/gadm_410-levels.zip"

    if not path:
        path = "../../raw_data"

    path = Path(path)

    folder = path.joinpath("gadm").resolve()
    folder.mkdir(parents=True, exist_ok=True)

    zip_path = folder.joinpath(folder, "gadm_410-levels.zip")

    if not zip_path.exists():
        print(f"Downloading data from:  {url} \n to {zip_path}")
        chunk_size = 8192
        with requests.get(url, stream=True) as r:
            r.raise_for_status()
            with open(zip_path, "wb") as f:
                for chunk in tqdm(
                    r.iter_content(chunk_size=chunk_size),
                    desc="Downloading",
                    unit="chunk",
                    total=int(r.headers.get("Content-Length", 0)) // chunk_size,
                ):
                    f.write(chunk)
        print("Data downloaded and saved at:", zip_path)

    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall(folder)

    print("Data unzipped in the folder:", folder)

    # Load a list of the files in the folder
    file = folder.glob("*.gpkg")

    return list(file)[0]


def preprocess_gadm_data(gpkg_path: Path | str, xlsx_path: Path | str) -> gpd.GeoDataFrame:
    """
    Preprocess the GADM data and save it to a GeoPackage.
    """
    if isinstance(gpkg_path, str):
        gpkg_path = Path(gpkg_path)

    if isinstance(xlsx_path, str):
        xlsx_path = Path(xlsx_path)

    adm0_gdf = gpd.read_file(gpkg_path.as_posix(), layer="ADM_0")
    adm1_gdf = gpd.read_file(gpkg_path.as_posix(), layer="ADM_1")
    df = pd.read_excel(xlsx_path, sheet_name="Countries")

    country_dataset = prepare_adm_datasets(adm0_gdf, adm1_gdf)

    final = gpd.GeoDataFrame(
        (
            country_dataset.pipe(prepare_geometries)
            .pipe(filter_empty_geometries)
            .pipe(compute_area)
            .merge(df, on="country_code", how="right")
        ),
        crs="epsg:4326",
    )
    # Save the cleaned  and simplified data
    print(
        "Saving the cleaned data to a csv in: ",
        gpkg_path.parent.joinpath("countries.csv").as_posix(),
    )
    final.dropna(subset="geometry").to_wkb(hex=True).to_csv(
        gpkg_path.parent.joinpath("countries.csv"),
        index=False,
    )

    return final


def prepare_geometries(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """
    Fix geometries for countries with invalid geometries.
    """
    gdf.geometry = (
        gdf.geometry.make_valid()
        .simplify(0.01, preserve_topology=True)
        .buffer(0)
        .make_valid()
        .apply(lambda geom: MultiPolygon([geom]) if geom.geom_type == "Polygon" else geom)
    )
    return gdf


def filter_empty_geometries(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """
    Filter out empty geometries.
    """
    return gdf[~gdf.geometry.is_empty].dropna(subset=["geometry"])


def compute_area(
    gdf: gpd.GeoDataFrame, area_col: str = "area_ha", code_col: str = "country_code"
) -> gpd.GeoDataFrame:
    """
    Compute area of geometries. using EPSG:6933 that is an equal area projection. for area calculation.
    """
    # we ensure that the areas of this countries match the area used in the excel sheet
    country_size_ha = {
        "USA": 947084624.2706754,
        "IDN": 188785480.2259437,
        "AUS": 768882542.08165,
        "BHS": 1338557.8163060332,
        "KEN": 58606174.82755706,
        "MEX": 195179334.58619106,
        "COL": 113742621.27637246,
        "IND": 297769359.954299,
        "CHN": 934894938.3876103,
    }
    gdf[area_col] = gdf.to_crs(epsg=6933).geometry.area / 10000
    gdf.loc[gdf[code_col].isin(country_size_ha.keys()), area_col] = gdf[code_col].map(
        country_size_ha
    )
    return gdf


def prepare_adm_datasets(adm0: gpd.GeoDataFrame, adm1: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """
    Merge the two datasets on the 'GID_0' and 'GID_1' columns. concatenating countries with Macao & Hongkong
    """
    adm1_prep = (
        adm1[adm1["NAME_1"].isin(["Hong Kong", "Macau"])][["GID_1", "NAME_1", "geometry"]]
        .rename(columns={"GID_1": "country_code", "NAME_1": "country"})
        .pipe(lambda df: df.assign(country_code=df.country_code.str.replace("CHN.", "")))
    )

    return pd.concat(
        [
            adm0.rename(columns={"COUNTRY": "country", "GID_0": "country_code"}),
            adm1_prep,
        ],
        ignore_index=True,
    )[["geometry", "country_code"]]


# 4. Generate SQL INSERT statement
def generate_row_sql(row: pd.Series) -> str:
    sql_template = """
    ('{code}', '{name}', '{continent}'::public.countries_continent_enum, '{region_1}', ''{region_2}'', {numeric_code}, {hdi}, ST_GeomFromWKB(decode({geometry}, 'hex'), 4326), {area_ha})
    """
    geometry_wkb = row["geometry"].wkb.hex()  # Get WKb representation of the geometry
    sql_row = sql_template.format(
        code=row["country_code"],
        name=row["country"],
        continent=row["continent_id"],
        region_1=row["region_1"] if pd.notnull(row["region_1"]) else "NULL",
        region_2=row["region_2"] if pd.notnull(row["region_2"]) else "NULL",
        numeric_code=row["numeric"],
        hdi=row["hdi_id"] if pd.notnull(row["hdi_id"]) else "NULL",
        geometry=geometry_wkb,
        area_ha=row["area_ha"],
    )
    return sql_row


def generate_sql_insert(rows: str) -> str:
    return f"""
    INSERT INTO public.countries
    (code, name, continent, region_1, region_2, numeric_code, hdi, geometry, area_ha)
    VALUES
    {rows};
    ON CONFLICT(code)
    DO UPDATE SET
    area_ha = EXCLUDED.area_ha,
    geometry = EXCLUDED.geometry;
    """


# 5. Write SQL to a file
def write_sql_file(merged_gdf: gpd.GeoDataFrame, output_file: str) -> None:
    sql_rows = []
    with open(output_file, "w") as f:
        for _, row in merged_gdf.iterrows():
            if row["geometry"] is not None:
                sql_rows.append(generate_row_sql(row))
        rows_statement = ",\n".join(sql_rows)
        sql_statement = generate_sql_insert(rows_statement)
        f.write(sql_statement + "\n")
