import requests
import json
import urllib3
import time
import os

# Suppress insecure request warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# CONFIG
BASE_URL = "https://api.agmarknet.gov.in/v1"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Referer": "https://agmarknet.gov.in/",
}
STATE_ID = 16
FROM_DATE = "2022-01-01"
TO_DATE = "2026-03-20"
LIMIT = 1000
TYPE = 3 
MAX_IDS_PER_CALL = 25 

def fetch_agmarknet_data():
    if not os.path.exists("agmarknet_mappings.json"):
        print("✗ agmarknet_mappings.json not found. Run discovery script first.")
        return
    
    with open("agmarknet_mappings.json") as f:
        maps = json.load(f)

    # Pre-map market names to IDs for quick lookup in each record
    # We invert the markets map for district (since districts vary)
    market_name_to_id = {}
    for dist_id, markets_list in maps.get("markets", {}).items():
        for mkt in markets_list:
            # key looks like "Badami APMC" -> "id"
            market_name_to_id[mkt["name"]] = str(mkt["id"])

    # Pre-map commodity names to IDs
    # (Sometimes the API returns multiple commodities in one call, we want the right ID for each)
    cmdt_name_to_id = {}
    for grp_id, cmdts_list in maps.get("commodities", {}).items():
        for cmdt in cmdts_list:
            cmdt_name_to_id[cmdt["name"]] = str(cmdt["id"])

    outfile = "full_agmarknet_data_with_ids.json"
    print(f"Starting fetch. Data will be saved to {outfile}")
    
    with open(outfile, "w") as out:
        out.write("[\n")
        first = True
        
        for group_id in range(15):
            group_id_str = str(group_id)
            if group_id_str not in maps["commodities"]:
                continue
            
            commodity_ids = [item["id"] for item in maps["commodities"][group_id_str]]
            
            for district_id in range(242, 270):
                # We reuse the logic: pass all commodities in a chunk, let the API filter them
                for k in range(0, len(commodity_ids), MAX_IDS_PER_CALL):
                    chunk_cids = commodity_ids[k : k + MAX_IDS_PER_CALL]
                    c_ids_str = "[" + ",".join(map(str, chunk_cids)) + "]"
                    
                    params = {
                        "type": TYPE,
                        "from_date": FROM_DATE,
                        "to_date": TO_DATE,
                        "msp": 0,
                        "period": "date",
                        "group": f"[{group_id}]",
                        "commodity": c_ids_str,
                        "market": "[]", # Get all markets
                        "state": f"[{STATE_ID}]",
                        "district": f"[{district_id}]",
                        "page": 1,
                        "options": 2,
                        "limit": LIMIT
                    }
                    
                    print(f"-> Fetching: Group={group_id}, District={district_id}, Chunk={k//MAX_IDS_PER_CALL} ...", flush=True)
                    try:
                        resp = requests.get(f"{BASE_URL}/all-type-report/all-type-report", params=params, headers=HEADERS, verify=False, timeout=60)
                        if resp.status_code == 200:
                            data = resp.json()
                            rows = data.get("rows", [])
                            
                            if rows and isinstance(rows, list):
                                count = 0
                                for row in rows:
                                    # INJECT THE IDs
                                    # 1. Commodity ID
                                    c_name = row.get("cmdt_name")
                                    if c_name in cmdt_name_to_id:
                                        row["commodity_id"] = cmdt_name_to_id[c_name]
                                    
                                    # 2. Market ID
                                    m_name = row.get("market_name")
                                    if m_name in market_name_to_id:
                                        row["market_id"] = market_name_to_id[m_name]
                                    
                                    # 3. Static IDs
                                    row["group_id"] = str(group_id)
                                    row["district_id"] = str(district_id)
                                    row["state_id"] = str(STATE_ID)
                                    
                                    if not first:
                                        out.write(",\n")
                                    json.dump(row, out)
                                    first = False
                                    count += 1
                                print(f"   ✔ Found and ID-tagged {count} records.")
                            else:
                                print(f"   ⚠ No data found.")
                        else:
                            print(f"   ✗ HTTP {resp.status_code}")
                    except Exception as e:
                        print(f"   ✗ Error: {e}")
                    
                    time.sleep(1.0) 

        out.write("\n]\n")
    
    print(f"\n✅ ALL data with IDs fetched and saved to {outfile}")

if __name__ == "__main__":
    fetch_agmarknet_data()
