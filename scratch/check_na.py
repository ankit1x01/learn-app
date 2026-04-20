import json

with open('mppsc/metadata.json', 'r') as f:
    data = json.load(f)

print("SSE 'na' papers:")
for p in data:
    if p['exam'] == 'SSE' and p['stage'] == 'na':
        print(f"Year: {p['year']} | Label: {p['label']}")
