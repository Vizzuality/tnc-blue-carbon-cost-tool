## Quick utility function to get a country multipolygon, as we have a country, world wide geojson file


import geopandas as gpd
from shapely.geometry import MultiPolygon, Polygon

county_codes_of_interest = ['ABW', 'HKG', 'MAC']

## Ensure the right path to the geojson file
gdf = gpd.read_file("countries.geojson")

gdf_filtered = gdf[gdf['country_code'].isin(county_codes_of_interest)]


for code in county_codes_of_interest:
    country = gdf_filtered[gdf_filtered['country_code'] == code]
    geom = country.iloc[0].geometry
    if isinstance(geom, Polygon):
        geom = MultiPolygon([geom])
        wkt = geom.wkt
        print(f"Multipolygon for {code}: {wkt}")
    elif isinstance(geom, MultiPolygon):
        wkt = geom.wkt
        print(f"Multipolygon for {code}: {wkt}")
    else:
        raise ValueError(f"Geometry for {code} is not a Polygon or MultiPolygon.")



