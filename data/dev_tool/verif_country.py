# Metrop : MIT License
# This script is used to verif the validity of the boundary.json file

#***************#
# Not commplete #
#***************#


print("Metrop analyse...")

import json, math
from pathlib import Path

script_dir = Path(__file__).parent
boundary_path = (script_dir / "../../country/boundary.json").resolve()

with open(boundary_path, "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"\nThere are {len(data) - 1} continents.")

listOfCountryPerContinent = {}
total_countries = 0

for continent, content in data.items():
    if continent == "WD":
        continue

    countries = content.get("get", {}) 
    listOfCountryPerContinent[continent] = countries

    count = len(countries)
    total_countries += count

print(f"\nTotal countries: {total_countries}")
print("Repartition : |", end=" ")

for continent, countries in listOfCountryPerContinent.items():
    print(f"{continent} : {len(countries)}", end=" | ")

print("\n")


cwf = 0

numOfRegion = 0
numOfCountryWithRegion = 0

for continent, countries in listOfCountryPerContinent.items():
    for country_name, country_data in countries.items():
        if country_data.get("flag"):
            cwf += 1
        if country_data.get("get"):
            numOfRegion += len(country_data.get("get"))
            numOfCountryWithRegion += 1

percent = math.floor(cwf / total_countries * 100) if total_countries else 0
print(f"{percent}% of countries have a flag")

print(f"There are {numOfRegion} region in {numOfCountryWithRegion} different country\n")