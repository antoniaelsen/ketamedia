import csv
import json
import sys

def csv_to_json(csv_file_path, output_file_path):
    json_data = []
    
    with open(csv_file_path, 'r') as csv_file:
        csv_reader = csv.reader(csv_file)
        next(csv_reader)  # Skip header row
        
        for row in csv_reader:
            try:
                obj = {
                    "id": int(row[0]),
                    "idHIP": int(row[1]) if row[1] else None,
                    "proper": row[6],
                    "ra": float(row[7]) * 15,
                    "dec": float(row[8]),
                    "distance": float(row[9]),
                    "magnitude": float(row[14]),
                    "ci": float(row[16]) if row[16] else 0,
                    "position": {
                        "x": float(row[17]),
                        "y": float(row[18]),
                        "z": float(row[19]),
                    }
                }
                json_data.append(obj)
            except ValueError as e:
                print(f"Skipping row due to parsing error: {e}, id: {row[0]} ra: {row[7]}, dec: {row[8]}, distance: {row[9]}, magnitude: {row[14]}, ci: {row[16]}")
                continue
    
    with open(output_file_path, 'w') as json_file:
        json.dump(json_data, json_file, indent=2)
    
    print(f"Conversion complete. JSON file saved as {output_file_path}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python script.py <path_to_csv_file> <output_json_file>")
        sys.exit(1)
    
    csv_file_path = sys.argv[1]
    output_file_path = sys.argv[2]
    csv_to_json(csv_file_path, output_file_path)