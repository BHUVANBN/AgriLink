import json
import requests
import urllib3
import os

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

BASE_URL = "https://api.agmarknet.gov.in/v1"
HEADERS = {"Referer": "https://agmarknet.gov.in/"}
STATE_ID = 16

def finalize_integrated():
    print("🚀 Merging NEW HITS into data.json ...")
    
    # 1. Load the discovered flat mappings (mid.json)
    try:
        with open("mid.json") as f:
            market_mappings = json.load(f)
    except:
        print("✗ mid.json not found.")
        return

    # 2. Get the HARDCODED district ID mapping (we validated these earlier)
    # Range 242-269
    dist_id_to_name = {
        "242": "Bagalkot", "243": "Bangalore", "244": "Belgaum", "245": "Bellary",
        "246": "Bidar", "247": "Bijapur", "248": "Chamrajnagar", "249": "Chikmagalur",
        "250": "Chitradurga", "251": "Davangere", "252": "Dharwad", "253": "Gadag",
        "254": "Hassan", "255": "Haveri", "256": "Kalburgi", "257": "Karwar(Uttar Kannad)",
        "258": "Kolar", "259": "Koppal", "260": "Madikeri(Kodagu)", "261": "Mandya",
        "262": "Mangalore(Dakshin Kannad)", "263": "Mysore", "264": "Raichur",
        "265": "Ramanagar", "266": "Shimoga", "267": "Tumkur", "268": "Udupi", "269": "Yadgiri"
    }
    dist_name_to_id = {v: k for k, v in dist_id_to_name.items()}

    # 3. Load existing data.json
    if not os.path.exists("data.json"):
        print("✗ data.json not found.")
        return
        
    with open("data.json", "r") as f:
        data = json.load(f)

    # 4. Integrate Markets
    new_adds = 0
    for m in market_mappings:
        m_id = m["m_id"]
        m_name = m["m_name"]
        d_name = m["d_name"]
        
        # Determine district ID
        d_id = dist_name_to_id.get(d_name)
        if not d_id:
            # Try fuzzy match for names like "Bangalore" vs "Bangalore (Rural)"? 
            # For now, exact match from our 28.
            continue
            
        if d_id not in data["districts"]:
            data["districts"][d_id] = {"name": d_name, "markets": {}}
        
        if m_id not in data["districts"][d_id]["markets"]:
            data["districts"][d_id]["markets"][m_id] = m_name
            new_adds += 1

    # 5. Save
    with open("data.json", "w") as out:
        json.dump(data, out, indent=4)
        
    print(f"\n✅ SUCCESS! Added {new_adds} new markets to data.json.")
    print(f"Total Markets now: {sum(len(v['markets']) for v in data['districts'].values())}")

if __name__ == "__main__":
    finalize_integrated()
