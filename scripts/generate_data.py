import csv
import json
import os
from pathlib import Path
from dotenv import load_dotenv

# Load default .env file
load_dotenv(dotenv_path=".env")

# Load .env.local if exists, overriding values from .env
load_dotenv(dotenv_path=".env.local", override=True)

input_file = Path(os.getenv("INPUT_FILE"))
output_dir = Path(os.getenv("OUTPUT_DIR"))

# Ensure output directory exists
output_dir.mkdir(parents=True, exist_ok=True)

# Read input_file where each row represents a single court case
all_court_cases = []
with input_file.open(newline='', encoding='utf-8') as input:
    reader = csv.DictReader(input, delimiter='\t')
    for row in reader:
        if len(row["position"]) == 0:
            continue
        coords = list(map(float, row["position"].split(",")))
        court_case = {
            "caseId": row["caseId"].strip() or None,
            "caseNumber": row["caseNumber"].strip() or None,
            "country": row["country"].strip() or None,
            "borderSign": row["borderSign"].strip() or None,
            "arrestDate": row["arrestDate"].strip() or None,
            "arrestTime": row["arrestTime"].strip() or None,
            "publicationDate": row["publicationDate"].strip() or None,
            "locality": {
                "settlement": row["settlement"].strip() or None,
                "gromada": row["gromada"].strip() or None,
                "rayon": row["rayon"].strip() or None,
                "oblast": row["oblast"].strip() or None
            },
            "fine": row["fine"].strip() or None,
            "distance": row["distance"].strip() or None,
            "guard": row["guard"].strip() or None,
            "group": row["group"].strip() or None,
            "position": row["position"].strip() or None
        }
        all_court_cases.append(court_case)

geocoded_cases = [court_case for court_case in all_court_cases if
                  court_case["position"] is not None and court_case["arrestDate"] is not None]

# Group all court cases into arrests by date, time and position
arrest_dict = {}
for court_case in geocoded_cases:
    arrest_key = (court_case["arrestDate"], court_case["arrestTime"], court_case["position"])
    arrest = arrest_dict.get(arrest_key)
    if arrest is None:
        arrest = {
            "id": court_case["caseId"],
            "date": court_case["arrestDate"],
            "time": court_case["arrestTime"],
            "position": court_case["position"],
            "cases": [court_case],
        }
        arrest_dict[arrest_key] = arrest
    else:
        arrest["cases"].append(court_case)
    if arrest.get("distance") is None and court_case.get("distance") is not None:
        arrest["distance"] = int(court_case["distance"])
arrests = list(arrest_dict.values())

# print(json.dumps(arrests, ensure_ascii=False, indent=2))

features = []
for arrest in arrests:
    coords = list(map(float, arrest["position"].split(",")))
    if len(coords) != 2:
        raise ValueError("Expected two coordinates")

    cases = []
    for court_case in arrest["cases"]:
        arrest_case = {
            "id": court_case["caseId"],
            "pub": court_case["publicationDate"],
            "fine": court_case["fine"],
        }
        cases.append(arrest_case)

    feature = {
        "type": "Feature",
        "id": arrest["id"],
        "properties": {
            "date": arrest["date"],
            "cases": cases,
            "distance": arrest.get("distance"),
        },
        "geometry": {
            "type": "Point",
            "coordinates": [coords[1], coords[0]],
        },
    }
    features.append(feature)

geojson = {
    "type": "FeatureCollection",
    "features": features
}

# Write the geojson file
geojson_file = output_dir / "arrests.json"
with geojson_file.open("w", encoding="utf-8") as out:
    # Generate json without indentation and spaces after comma and colon
    json.dump(geojson, out, ensure_ascii=False, separators=(',', ':'), indent=None)

print(f"✅ GeoJSON written to {geojson_file}")
