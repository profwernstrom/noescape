import csv
import io
import json
import os
import zipfile
from collections import defaultdict
from datetime import datetime
from math import ceil, sqrt
from pathlib import Path

import xlsxwriter
from dotenv import load_dotenv


# Read cases from a tab-separated data file
# The first row of the file contains column headers
def read_court_cases(input_file):
    court_cases = []
    with input_file.open(newline='', encoding='utf-8') as input:
        reader = csv.DictReader(input, delimiter='\t')
        for row in reader:
            court_case = {
                "caseId": row["caseId"].strip() or None,
                "caseNumber": row["caseNumber"].strip() or None,
                "country": row["country"].strip() or None,
                "borderSign": row["borderSign"].strip() or None,
                "arrestDate": row["arrestDate"].strip() or None,
                "arrestTime": row["arrestTime"].strip() or None,
                "publicationDate": row["publicationDate"].strip() or None,
                "settlement": row["settlement"].strip() or None,
                "gromada": row["gromada"].strip() or None,
                "rayon": row["rayon"].strip() or None,
                "oblast": row["oblast"].strip() or None,
                "fine": row["fine"].strip() or None,
                "distance": row["distance"].strip() or None,
                "guard": row["guard"].strip() or None,
                "group": row["group"].strip() or None,
                "position": row["position"].strip() or None,
            }
            court_cases.append(court_case)
    return court_cases


# Group court cases into arrests by date, time and position
def collect_arrests(court_cases):
    arrests = {}
    for court_case in court_cases:
        arrest_key = (court_case["arrestDate"], court_case["arrestTime"], court_case["position"])
        arrest = arrests.get(arrest_key)
        if arrest is None:
            arrest = {
                "id": court_case["caseId"],
                "date": court_case["arrestDate"],
                "time": court_case["arrestTime"],
                "position": court_case["position"],
                "cases": [court_case],
            }
            arrests[arrest_key] = arrest
        else:
            arrest["cases"].append(court_case)
        if arrest.get("distance") is None and court_case.get("distance") is not None:
            arrest["distance"] = int(court_case["distance"])

    result = list(arrests.values())
    return sorted(result, key=lambda item: (item["date"], str(item["time"]), item["id"]))


# Generate GeoJSON file with arrests
# The file used to display markers on the map
def generate_arrests_geojson(arrests):
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
    return geojson


# Serialize data to json and write to file
def write_json(file, data):
    with file.open("w", encoding="utf-8") as out:
        # Generate json without indentation and spaces after comma and colon
        json.dump(data, out, ensure_ascii=False, separators=(',', ':'), indent=None)
    print("Created file", file)


# Get year of the arrest
# if arrest date is missing, fall back to court case date
def get_year(court_case):
    arrest_date = court_case.get("arrestDate")
    if arrest_date is not None:
        return int(arrest_date[:4])
    registration_date = court_case.get("registrationDate")
    if registration_date is not None:
        return int(registration_date[:4])
    publication_date = court_case.get("publicationDate")
    if publication_date is not None:
        return int(publication_date[:4])
    return None


# Generate Excel file with all court cases
def generate_excel_file(output_file, court_cases):
    workbook = xlsxwriter.Workbook(output_file)

    for year in range(2022, datetime.now().year + 1):
        worksheet = workbook.add_worksheet(name=str(year))

        selected_cases = [court_case for court_case in court_cases if get_year(court_case) == year]

        header_row = ["Кордон", "Прикордонний знак", "Дата затримання", "Час затримання", "Дата оприлюднення",
                      "Відстань до кордону", "Прикордонний наряд", "Населенний пункт", "Громада", "Район", "Область",
                      "Штраф, грн", "Номер справи", "Координати", "Посилання"]
        worksheet.write_row(0, 0, header_row)
        worksheet.freeze_panes(1, 0)

        col_widths = [0] * len(header_row)

        for col_index, value in enumerate(header_row):
            col_widths[col_index] = max(col_widths[col_index], len(value) + 2)

        for row_index, court_case in enumerate(selected_cases):
            position = court_case.get("position")
            if position is not None:
                position = ",".join(f"{float(v):.5f}" for v in position.split(","))

            data_row = [court_case.get("country"),
                        court_case.get("borderSign"),
                        court_case.get("arrestDate"),
                        court_case.get("arrestTime"),
                        court_case.get("publicationDate"),
                        court_case.get("distance"),
                        court_case.get("guard"),
                        court_case.get("settlement"),
                        court_case.get("gromada"),
                        court_case.get("rayon"),
                        court_case.get("oblast"),
                        court_case.get("fine"),
                        court_case.get("caseNumber"),
                        position,
                        "https://reyestr.court.gov.ua/Review/" + court_case["caseId"],
                        ]
            for col_index, value in enumerate(data_row):
                col_widths[col_index] = max(col_widths[col_index], len(str(value)))
            worksheet.write_row(row_index + 1, 0, data_row)

        worksheet.autofilter(0, 0, len(selected_cases), len(header_row) - 1)
        # Set column widths
        for col_index, width in enumerate(col_widths):
            worksheet.set_column(col_index, col_index, width + 1)

    workbook.close()


# Make sure arrests don't step on each other. Add 20 meters space between them.
def distribute_same_positions(arrests):
    space_between_positions = 20
    lat_per_meter = 1.0 / 111320
    lng_per_meter = 1.0 / 71700

    position_map = {}

    # Group arrests by position
    for arrest in arrests:
        position = arrest["position"]
        if position in position_map:
            position_map[position].append(arrest)
        else:
            position_map[position] = [arrest]

    result = []

    for position, position_arrests in position_map.items():
        side = int(ceil(sqrt(len(position_arrests))))

        for i, arrest in enumerate(position_arrests):
            coords = list(map(float, arrest["position"].split(",")))
            row = i // side
            col = i % side
            lat = coords[0] + (row - side / 2.0) * lat_per_meter * space_between_positions
            lng = coords[1] + (col - side / 2.0) * lng_per_meter * space_between_positions
            new_arrest = arrest.copy()
            new_arrest["position"] = str(lat) + ',' + str(lng)
            result.append(new_arrest)

    # Sort arrests by caseId to have predicatable order, so that it is easier to diff
    result.sort(key=lambda a: (a["cases"][0]["caseId"]))
    return result


# Generate KML with all arrests
# The KML contains placemarks with arrests, grouped into folders by year and month
def generate_kml(arrests):
    grouped_by_year_month = defaultdict(list)
    for arrest in arrests:
        year_month = arrest["date"][:7]
        grouped_by_year_month[year_month].append(arrest)
    year_months = list(sorted(grouped_by_year_month.keys()))

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">',
        '<Document>'
    ]
    for year_month in year_months:
        month_arrests = grouped_by_year_month[year_month]

        lines.append('<Folder>')
        lines.append('<name>' + year_month + '</name>')
        lines.append('<open>0</open>')

        for arrest in month_arrests:
            arrest_date_time = arrest['date']
            if arrest.get('time'):
                arrest_date_time += ' ' + arrest['time']
            lines.append('<Placemark>')
            lines.append('<name>' + arrest_date_time + '</name>')
            lines.append('<Style><LabelStyle><scale>0.8</scale></LabelStyle></Style>')
            if year_month not in year_months[-3:]:
                # Hide markers by default, so that the application where the file is imported, won't die
                lines.append("<visibility>0</visibility>")
            lines.append('<description>')
            for i, court_case in enumerate(arrest["cases"]):
                line = f'<a href="https://reyestr.court.gov.ua/Review/{court_case["caseId"]}">Справа №{court_case["caseNumber"]}</a>'
                if i > 0:
                    line = '<br/>' + line
                lines.append(line)
            lines.append('</description>')
            coords = arrest["position"].split(',')
            lines.append(f'<Point><coordinates>{coords[1]},{coords[0]}</coordinates></Point>')
            lines.append('</Placemark>')
        lines.append('</Folder>')
    lines.append('</Document>')
    lines.append('</kml>')
    return '\n'.join(lines)


# Compress KML content into kmz format
def kmz(content):
    baos = io.BytesIO()
    with zipfile.ZipFile(baos, 'w', zipfile.ZIP_DEFLATED) as zos:
        entry = zipfile.ZipInfo("doc.kml")
        zos.writestr(entry, content.encode('utf-8'))
    return baos.getvalue()


# Load default .env file
load_dotenv(dotenv_path=".env")
# Load .env.local if exists, overriding values from .env
load_dotenv(dotenv_path=".env.local", override=True)

input_file = Path(os.getenv("INPUT_FILE"))
output_dir = Path(os.getenv("OUTPUT_DIR"))

# Ensure output directory exists
output_dir.mkdir(parents=True, exist_ok=True)

# Read input_file where each row represents a single court case
all_court_cases = read_court_cases(input_file)

# Select court cases that where successfully geocoded
geocoded_cases = [court_case for court_case in all_court_cases if
                  court_case["position"] is not None and court_case["arrestDate"] is not None]

# Group all court cases into arrests by date, time and position
geocoded_arrests = collect_arrests(geocoded_cases)

# Generate and write KML file with latest arrests
latest_arrests = geocoded_arrests[-9000:]
latest_kml_file = output_dir / "arrests-latest.kmz"
latest_kml_file.write_bytes(kmz(generate_kml(latest_arrests)))

# Generate and write GeoJSON file with arrests
arrests_geojson = generate_arrests_geojson(distribute_same_positions(geocoded_arrests))
arrests_json_file = output_dir / "arrests.json"
write_json(arrests_json_file, arrests_geojson)

# Generate Excel file with all court cases
excel_file = output_dir / "спроби_перетинання_кордону.xlsx"
generate_excel_file(excel_file, all_court_cases)
