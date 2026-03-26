"""
agmarknet_tool.py
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Agmarknet Market-Wise Price & Arrivals Fetcher

FIXED settings:
  • Report Type  → Market-wise (type=3)
  • State        → Karnataka   (auto-resolved)
  • Options      → Both Arrival Qty & Weighted Avg Modal Price (options=2)
  • Period       → Date-wise
  • Date range   → Past 5 years (today − 1825 days)

USER-SELECTED (interactive dropdowns loaded from the API itself):
  • Commodity Group
  • Commodity
  • District
  • Market

HOW IT WORKS:
  Step 1 — Calls master/dropdown API endpoints to get all ID→Name mappings
            and caches them in agmarknet_cache.json (so you don't repeat this)
  Step 2 — Shows numbered menus for Group → Commodity → District → Market
  Step 3 — Fetches all paginated data and saves to CSV

Install:
    pip install requests pandas tabulate

Run:
    python agmarknet_tool.py
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

import requests, json, os, sys, math
import pandas as pd
from datetime import date, timedelta

# ── Constants ──────────────────────────────────────────────────────
BASE      = "https://api.agmarknet.gov.in/v1"
STATE_ID  = 16          # Karnataka — fixed
REPORT_TYPE = 3         # Market-wise — fixed
OPTIONS   = 2           # Both Arrivals + Weighted Avg Modal Price — fixed
PERIOD    = "date"      # Date-wise — fixed
MSP       = 0
DATE_TO   = date.today()
DATE_FROM = DATE_TO - timedelta(days=5*365)   # 5 years back
LIMIT     = 500         # records per page
CACHE_FILE = "agmarknet_cache.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Referer":    "https://agmarknet.gov.in/",
    "Origin":     "https://agmarknet.gov.in",
    "Accept":     "application/json, text/plain, */*",
}

# ── Master endpoint candidates ─────────────────────────────────────
# The API follows REST conventions — we probe these paths to find dropdowns.
MASTER_ENDPOINTS = {
    "commodity_groups": [
        f"{BASE}/masters/commodity-groups",
        f"{BASE}/masters/commodity-group",
        f"{BASE}/commodity-groups",
        f"{BASE}/commodity/groups",
        f"{BASE}/masters/groups",
        f"{BASE}/filters/commodity-groups",
    ],
    "commodities": [
        f"{BASE}/masters/commodities",
        f"{BASE}/masters/commodity",
        f"{BASE}/commodity",
        f"{BASE}/filters/commodities",
    ],
    "districts": [
        f"{BASE}/masters/districts",
        f"{BASE}/masters/district",
        f"{BASE}/districts",
        f"{BASE}/filters/districts",
        f"{BASE}/masters/districts?state_id={STATE_ID}",
        f"{BASE}/masters/districts?state={STATE_ID}",
    ],
    "markets": [
        f"{BASE}/masters/markets",
        f"{BASE}/masters/market",
        f"{BASE}/markets",
        f"{BASE}/filters/markets",
    ],
}


# ── Utilities ──────────────────────────────────────────────────────
def get(url, params=None):
    try:
        r = requests.get(url, params=params, headers=HEADERS, timeout=15)
        if r.status_code == 200:
            return r.json()
    except Exception:
        pass
    return None


def probe_master(key, candidates):
    """Try each candidate URL until one returns usable data."""
    print(f"  Probing {key} endpoints ...", end=" ", flush=True)
    for url in candidates:
        data = get(url)
        if data:
            # Handle various response shapes: list, {"data": [...]}, {"result": [...]}
            if isinstance(data, list) and len(data) > 0:
                print(f"✔ ({url.split('/v1')[1]})")
                return url, data
            for key2 in ["data", "result", "records", "items", "list"]:
                if isinstance(data, dict) and key2 in data and data[key2]:
                    print(f"✔ ({url.split('/v1')[1]})")
                    return url, data[key2]
    print("✗ not found")
    return None, []


def extract_id_name(records, id_keys=None, name_keys=None):
    """
    Try to extract id→name pairs from a list of dicts.
    Handles different naming conventions (id/Id/ID, name/Name/label etc.)
    """
    id_keys   = id_keys   or ["id", "Id", "ID", "code", "Code", "value",
                               "commodity_id", "group_id", "district_id",
                               "market_id", "state_id"]
    name_keys = name_keys or ["name", "Name", "label", "Label", "text",
                               "commodity_name", "group_name", "district_name",
                               "market_name", "state_name", "title"]
    result = {}
    for rec in records:
        if not isinstance(rec, dict):
            continue
        rid   = next((rec[k] for k in id_keys   if k in rec), None)
        rname = next((rec[k] for k in name_keys if k in rec), None)
        if rid is not None and rname:
            result[str(rid)] = str(rname)
    return result


def load_cache():
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE) as f:
                cache = json.load(f)
            print(f"✔ Loaded mappings from cache ({CACHE_FILE})")
            return cache
        except Exception:
            pass
    return {}


def save_cache(cache):
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f, indent=2)
    print(f"✔ Mappings cached → {CACHE_FILE}")


# ── Interactive menu ───────────────────────────────────────────────
def pick(label, mapping, filter_fn=None):
    """
    Show a numbered menu and return (id, name).
    mapping = {id_str: name_str}
    """
    items = sorted(mapping.items(), key=lambda x: x[1])
    if filter_fn:
        items = [(k, v) for k, v in items if filter_fn(k, v)]

    if not items:
        print(f"  No options available for {label}.")
        return None, None

    print(f"\n{'─'*55}")
    print(f"  Select {label}:")
    print(f"{'─'*55}")
    for i, (k, v) in enumerate(items, 1):
        print(f"  {i:>3}. {v}  (id={k})")
    print(f"{'─'*55}")

    while True:
        try:
            choice = int(input(f"  Enter number [1-{len(items)}]: ").strip())
            if 1 <= choice <= len(items):
                k, v = items[choice - 1]
                print(f"  ✔ Selected: {v}")
                return k, v
        except (ValueError, KeyboardInterrupt):
            pass
        print(f"  Please enter a number between 1 and {len(items)}.")


# ── Data fetcher ───────────────────────────────────────────────────
def fetch_data(group_id, commodity_id, district_id, market_id):
    """Paginate through all results for the selected parameters."""
    url  = f"{BASE}/all-type-report/all-type-report"
    page = 1
    all_records = []

    print(f"\n  Fetching data ...", flush=True)

    while True:
        params = {
            "type":       REPORT_TYPE,
            "from_date":  DATE_FROM.strftime("%Y-%m-%d"),
            "to_date":    DATE_TO.strftime("%Y-%m-%d"),
            "msp":        MSP,
            "period":     PERIOD,
            "group":      f"[{group_id}]",
            "commodity":  f"[{commodity_id}]",
            "state":      f"[{STATE_ID}]",
            "district":   f"[{district_id}]",
            "market":     f"[{market_id}]" if market_id else "[]",
            "page":       page,
            "options":    OPTIONS,
            "limit":      LIMIT,
        }

        data = get(url, params)

        if not data:
            print(f"  ✗ No response on page {page}. Stopping.")
            break

        # Extract records — handle various shapes
        records = None
        for k in ["data", "records", "result", "items", "list"]:
            if isinstance(data, dict) and k in data:
                records = data[k]
                break
        if isinstance(data, list):
            records = data

        if not records:
            print(f"  ✔ No more data at page {page}.")
            break

        all_records.extend(records)

        # Pagination info
        total = data.get("total", data.get("count", None)) if isinstance(data, dict) else None
        if total:
            total_pages = math.ceil(int(total) / LIMIT)
            print(f"  📄 Page {page}/{total_pages}: {len(records)} records  "
                  f"(total so far: {len(all_records)})")
            if page >= total_pages:
                break
        else:
            print(f"  📄 Page {page}: {len(records)} records  (total so far: {len(all_records)})")
            if len(records) < LIMIT:
                break   # last page

        page += 1

    return all_records


# ── Main ───────────────────────────────────────────────────────────
def main():
    print("=" * 55)
    print("  Agmarknet Market-Wise Fetcher")
    print(f"  State   : Karnataka (fixed)")
    print(f"  Period  : {DATE_FROM} → {DATE_TO}  (5 years)")
    print(f"  Options : Arrivals + Weighted Avg Modal Price")
    print("=" * 55)

    # ── Step 1: Load or discover mappings ───────────────────────────
    cache = load_cache()

    if not cache:
        print("\n🔍 Discovering dropdown mappings from API ...\n")

        # Commodity Groups
        _, grp_records = probe_master("commodity_groups", MASTER_ENDPOINTS["commodity_groups"])
        cache["groups"] = extract_id_name(grp_records)

        # Commodities
        _, comm_records = probe_master("commodities", MASTER_ENDPOINTS["commodities"])
        cache["commodities"] = extract_id_name(comm_records)

        # Districts (filtered to Karnataka)
        _, dist_records = probe_master("districts", MASTER_ENDPOINTS["districts"])
        cache["districts"] = extract_id_name(dist_records)

        # Markets
        _, mkt_records = probe_master("markets", MASTER_ENDPOINTS["markets"])
        cache["markets"] = extract_id_name(mkt_records)

        if not any(cache.values()):
            # ── Fallback: scrape the form page for option values ─────
            print("\n  ⚠  API master endpoints not found. Falling back to scraping form dropdowns ...")
            try:
                import re
                r = requests.get(
                    "https://agmarknet.gov.in/alltypeofreports",
                    headers=HEADERS, timeout=20
                )
                html = r.text
                # Extract all <select> option values and text
                pattern = r'<select[^>]*id=["\']([^"\']*)["\'][^>]*>(.*?)</select>'
                selects = re.findall(pattern, html, re.DOTALL | re.IGNORECASE)
                opt_pat = r'<option[^>]*value=["\'](\d+)["\'][^>]*>(.*?)</option>'
                for sel_id, sel_body in selects:
                    opts = re.findall(opt_pat, sel_body, re.DOTALL)
                    if opts:
                        mapping = {v: n.strip() for v, n in opts if v and v != "0"}
                        label = sel_id.lower()
                        if "group" in label:
                            cache.setdefault("groups", {}).update(mapping)
                        elif "comm" in label:
                            cache.setdefault("commodities", {}).update(mapping)
                        elif "dist" in label:
                            cache.setdefault("districts", {}).update(mapping)
                        elif "market" in label or "mkt" in label:
                            cache.setdefault("markets", {}).update(mapping)
                        print(f"  ✔ Scraped '{sel_id}': {len(mapping)} options")
            except Exception as e:
                print(f"  ✗ Fallback scrape failed: {e}")

        save_cache(cache)

    # ── Print what we found ─────────────────────────────────────────
    print(f"\n  Mappings loaded:")
    print(f"    Commodity Groups : {len(cache.get('groups', {}))} options")
    print(f"    Commodities      : {len(cache.get('commodities', {}))} options")
    print(f"    Districts        : {len(cache.get('districts', {}))} options")
    print(f"    Markets          : {len(cache.get('markets', {}))} options")

    if not any(cache.values()):
        print("\n❌ Could not load any dropdown mappings.")
        print("   Please run the script on your machine with internet access to agmarknet.gov.in")
        print("   Then paste the agmarknet_cache.json content here for debugging.")
        sys.exit(1)

    # ── Step 2: User picks selections ───────────────────────────────
    group_id,   group_name   = pick("Commodity Group", cache.get("groups", {}))
    if not group_id: sys.exit(1)

    # Filter commodities by group if possible (IDs in same numeric range usually)
    commodity_id, commodity_name = pick("Commodity", cache.get("commodities", {}))
    if not commodity_id: sys.exit(1)

    district_id,  district_name  = pick("District (Karnataka)", cache.get("districts", {}))
    if not district_id: sys.exit(1)

    # Filter markets by district if the cache has district_id field
    market_id,    market_name    = pick("Market", cache.get("markets", {}))
    # market is optional — allow empty
    if not market_id:
        market_id = ""

    # ── Step 3: Fetch data ──────────────────────────────────────────
    print(f"\n{'='*55}")
    print(f"  Fetching: {commodity_name} | {district_name} | {market_name or 'All markets'}")
    print(f"  {DATE_FROM} → {DATE_TO}")
    print(f"{'='*55}")

    records = fetch_data(group_id, commodity_id, district_id, market_id)

    if not records:
        print("\n❌ No data returned for these selections.")
        print("   Check that this commodity is traded in the selected market.")
        sys.exit(1)

    # ── Step 4: Save ────────────────────────────────────────────────
    df       = pd.DataFrame(records)
    filename = f"{commodity_name}_{district_name}_{market_name or 'all'}.csv".replace(" ", "_")

    # Sort by date if possible
    date_col = next((c for c in df.columns if "date" in str(c).lower()), None)
    if date_col:
        df[date_col] = pd.to_datetime(df[date_col], errors="coerce")
        df = df.sort_values(date_col, ascending=False)
        df[date_col] = df[date_col].dt.strftime("%d-%b-%Y")

    df.to_csv(filename, index=False)
    print(f"\n✅  {len(df)} records saved → {filename}\n")

    try:
        from tabulate import tabulate
        print(tabulate(df.head(20), headers="keys", tablefmt="rounded_outline", showindex=False))
    except ImportError:
        print(df.head(20).to_string(index=False))

    print(f"\n  Columns in data: {list(df.columns)}")


if __name__ == "__main__":
    main()
