import csv
import json
import os
import sys
from typing import List, Dict

def find_column_index_by_name(header_row: List[str], column_name: str) -> int:
    return header_row.index(column_name)

def find_column_names(header_row: List[str]) -> Dict[str, int]:
    COLUMN_NAMES = [
        "id",
        "hip",
        "proper",
        "ra",
        "dec",
        "dist",
        "mag",
        "ci",
        "x",
        "y",
        "z",
    ]

    return {name: find_column_index_by_name(header_row, name) for name in COLUMN_NAMES}

def csv_to_json(csv_file_path, output_dir, max_entries_per_file=10000):
    if not os.path.exists(csv_file_path):
        print(f"Error: Input CSV file '{csv_file_path}' does not exist")
        sys.exit(1)


    if not os.path.exists(output_dir):
        print(f"Creating output directory '{output_dir}'")
        os.makedirs(output_dir, exist_ok=True)

    with open(csv_file_path, 'r') as csv_file:
        json_data = []
        file_index = 0
        csv_reader = csv.reader(csv_file)
        header_row = next(csv_reader)

        colmap = find_column_names(header_row)
        for k in colmap.keys():
            if colmap[k] is None:
                print(f"Error: Column '{k}' not found in CSV file")
                sys.exit(1)

        for row in csv_reader:
            required_cols = ["id", "hip", "dist", "x", "y", "z", "ci", "ra", "dec", "mag"]
            skip_row = False

            for col in required_cols:
                if colmap[col] >= len(row) or not row[colmap[col]].strip():
                    skip_row = True
                    break

            if skip_row:
                continue

            try:
                obj = {
                    "id": int(row[colmap["id"]]),
                    "idHIP": int(row[colmap["hip"]]) if row[colmap["hip"]] else None,
                    "proper": row[colmap["proper"]],
                    "ra": float(row[colmap["ra"]]) * 15,
                    "dec": float(row[colmap["dec"]]),
                    "distance": float(row[colmap["dist"]]),
                    "magnitude": float(row[colmap["mag"]]),
                    "ci": float(row[colmap["ci"]]) if row[colmap["ci"]] else 0,
                    "position": {
                        "x": float(row[colmap["x"]]),
                        "y": float(row[colmap["y"]]),
                        "z": float(row[colmap["z"]]),
                    }
                }

                if (max_entries_per_file is not None and len(json_data) >= max_entries_per_file):
                    output_file_path = os.path.join(output_dir, f"hyglike_from_athyg-{file_index}.json")
                    with open(output_file_path, 'w') as json_file:
                        json.dump(json_data, json_file, indent=2)
                    json_data = []
                    file_index += 1

                json_data.append(obj)

            except ValueError as e:
                print(f"Skipping row due to parsing error: {e}, id: {row[0]} ra: {row[7]}, dec: {row[8]}, distance: {row[9]}, magnitude: {row[14]}, ci: {row[16]}")
                continue

    
    print(f"Conversion complete. JSON file(s) saved to {output_dir}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python script.py <path_to_csv_file> <output_dir>")
        sys.exit(1)
    
    csv_file_path = sys.argv[1]
    output_dir = sys.argv[2]
    csv_to_json(csv_file_path, output_dir)