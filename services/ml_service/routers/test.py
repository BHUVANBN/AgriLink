"""
agmarknet_prices.py
Fetches Wheat prices for Mysuru & Nanjangud for the last 3 months.

NOTE: The sample API key returns max 10 records per call.
      For full 3-month history, generate your own FREE key at:
      https://data.gov.in/user/register  →  My Account  →  Generate API Key
      Then replace the API_KEY value below.

Install deps:
    pip install requests pandas tabulate
Run:
    python agmarknet_prices.py
"""

import requests
import pandas as pd
from datetime import date, timedelta

# ─── CONFIG ───────────────────────────────────────────────────────
API_KEY    = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"
STATE      = "Karnataka"
COMMODITY  = "Ragi"
MARKETS    = ["Mysuru", "Nanjangud"]
DATE_FROM  = date.today() - timedelta(days=90)   # 3 months back
DATE_TO    = date.today()
BATCH_SIZE = 10    # records per API call (reduced for stability)
# ──────────────────────────────────────────────────────────────────

RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070"
API_URL     = f"https://api.data.gov.in/resource/{RESOURCE_ID}"


def fetch_market(market: str) -> list[dict]:
    """Paginate through all records for a market, stop when dates go out of range."""
    print(f"\n  Fetching {COMMODITY} prices for {market} ...")
    collected = []
    offset    = 0

    while True:
        params = {
            "api-key":                API_KEY,
            "format":                 "json",
            "limit":                  BATCH_SIZE,
            "offset":                 offset,
            "filters[state]": STATE,
            "filters[commodity]": COMMODITY,
        }

        resp = requests.get(API_URL, params=params, timeout=30)
        resp.raise_for_status()
        data    = resp.json()
        records = data.get("records", [])
        total   = int(data.get("total", 0))

        if not records:
            break

        # Parse dates and keep only those within our range
        for r in records:
            try:
                rec_date = pd.to_datetime(r.get("arrival_date", ""), dayfirst=True).date()
                rec_market = r.get("market", "")
                if market.lower() in rec_market.lower() and (DATE_FROM <= rec_date <= DATE_TO):
                    r["_date_parsed"] = rec_date
                    collected.append(r)
            except Exception:
                pass

        offset += BATCH_SIZE
        print(f"    Page offset {offset}/{total} — kept {len(collected)} records so far")

        # Stop if we've fetched all available records
        if offset >= total:
            break

    return collected


# ── Fetch both markets ────────────────────────────────────────────
print("=" * 55)
print(f"  Wheat Prices — Mysuru & Nanjangud")
print(f"  Period: {DATE_FROM} to {DATE_TO}")
print("=" * 55)

all_records = []
for market in MARKETS:
    all_records.extend(fetch_market(market))

if not all_records:
    print("\nNo records found in the last 3 months for these markets.")
    print("Tip: Wheat may not be actively traded in these mandis.")
    exit()

# ── Build & clean DataFrame ───────────────────────────────────────
df = pd.DataFrame(all_records).rename(columns={
    "state":        "State",
    "district":     "District",
    "market":       "Market",
    "commodity":    "Commodity",
    "variety":      "Variety",
    "grade":        "Grade",
    "arrival_date": "Date",
    "min_price":    "Min (Rs/Qtl)",
    "max_price":    "Max (Rs/Qtl)",
    "modal_price":  "Modal (Rs/Qtl)",
})

df = (df
      .sort_values(["Market", "_date_parsed"], ascending=[True, False])
      .drop(columns=["_date_parsed"], errors="ignore")
      .reset_index(drop=True))

# ── Save & display ────────────────────────────────────────────────
df.to_csv("wheat_prices_3months.csv", index=False)
print(f"\n  {len(df)} records saved to wheat_prices_3months.csv\n")

display_cols = ["Date", "Market", "Variety", "Min (Rs/Qtl)", "Max (Rs/Qtl)", "Modal (Rs/Qtl)"]
display_cols = [c for c in display_cols if c in df.columns]

try:
    from tabulate import tabulate
    print(tabulate(df[display_cols], headers="keys", tablefmt="rounded_outline", showindex=False))
except ImportError:
    print(df[display_cols].to_string(index=False))