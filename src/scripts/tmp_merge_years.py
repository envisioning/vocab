import json

# Load both JSON files
with open('../data/years-missing.json', 'r') as f:
    missing_data = json.load(f)

with open('../data/years.json', 'r') as f:
    years_data = json.load(f)

# Merge data - only replace entries with 0 in years.json
for key, value in missing_data.items():
    if key in years_data and years_data[key] == 0:
        years_data[key] = value

# Write the merged data back to years.json
with open('../data/years.json', 'w') as f:
    json.dump(years_data, f, indent=2)