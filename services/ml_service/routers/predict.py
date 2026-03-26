"""
Crop Price Prediction Router — Standardized AI Core for AgriLink
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import logging, os, json
from datetime import datetime
import pandas as pd
import random
import requests
from db import get_pool
from auth import require_token

router = APIRouter()
logger = logging.getLogger("predict")

# ── Models ────────────────────────────────────────────────────

class PricePoint(BaseModel):
    month: str
    predictedPrice: float
    minPrice: float
    maxPrice: float
    unit: str

class PredictResponse(BaseModel):
    success: bool
    cropName: str
    currentMarketPrice: Optional[float] = None
    forecast: List[PricePoint] = []
    trend: Optional[str] = None
    confidence: float = 0.0
    lastUpdated: Optional[str] = None
    error: Optional[str] = None

class PredictRequest(BaseModel):
    cropName: str
    commodity_id: str
    market_id: str
    forecastMonths: int = 4

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ── Logic ─────────────────────────────────────────────────────

def fetch_agmarknet_data(commodity_id: str, state_id: str, district_id: str, market_id: str, from_date: str, to_date: str) -> list:
    """
    Fetch real-time crop price data from Agmarknet API
    """
    try:
        # Build Agmarknet API URL with fixed and user-selected parameters
        base_url = "https://api.agmarknet.gov.in/v1/all-type-report/all-type-report"
        params = {
            'type': '3',                    # Fixed: Price reports
            'from_date': from_date,           # Fixed: Start date
            'to_date': to_date,               # Fixed: End date
            'msp': '0',                    # Fixed: Minimum Support Price
            'period': 'date',              # Fixed: Daily prices
            'group': '[1]',                # Fixed: Cereals group (most common)
            'commodity': f'[{commodity_id}]',  # User selected: Specific commodity
            'state': '[16]',                  # Fixed: Maharashtra state (16)
            'district': f'[{district_id}]',      # User selected: District
            'market': f'[{market_id}]' if market_id and market_id != "" else '[]',      # User selected: Market
            'page': '1',
            'options': '2',
            'limit': '500'
        }
        
        # Construct full URL for debugging
        import urllib.parse
        query_string = urllib.parse.urlencode(params)
        full_url = f"{base_url}?{query_string}"
        logger.info(f"Full Agmarknet URL: {full_url}")
        
        logger.info(f"Fetching Agmarknet data for commodity: {commodity_id}, district: {district_id}, market: {market_id}")
        
        # Add User-Agent header to avoid blocking
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(base_url, params=params, headers=headers, timeout=30)
        logger.info(f"Response status: {response.status_code}")
        
        response.raise_for_status()
        
        data = response.json()
        records = data.get('rows', [])  # Use 'rows' instead of 'data'
        
        logger.info(f"Successfully fetched {len(records)} records from Agmarknet")
        return records
        
    except requests.RequestException as e:
        logger.error(f"Agmarknet API error: {e}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error fetching Agmarknet data: {e}")
        return []

async def sync_agmarknet_to_database(commodity_id: str, market_id: str, district_id: str) -> list:
    """
    Fetch real-time Agmarknet data and return directly (no database storage)
    """
    try:
        # Get last 5 years of data
        from_date = (datetime.now() - pd.DateOffset(years=5)).strftime('%Y-%m-%d')
        to_date = datetime.now().strftime('%Y-%m-%d')
        
        # Fetch from Agmarknet with fixed state (16 = Maharashtra)
        logger.info(f"Fetching Agmarknet data for commodity: {commodity_id}, district: {district_id}, market: {market_id}")
        
        # Handle empty market case
        market_param = market_id if market_id and market_id != "" else ""
        
        records = fetch_agmarknet_data(commodity_id, '16', district_id, market_param, from_date, to_date)
        
        logger.info(f"Fetched {len(records)} records from Agmarknet")
        
        if not records:
            logger.warning(f"No records found for commodity {commodity_id} in district {district_id}, market {market_id}")
            return []
        
        logger.info(f"Successfully fetched {len(records)} records from Agmarknet")
        return records
        
    except Exception as e:
        logger.error(f"Agmarknet fetch error: {e}")
        return []

# ── Logic ─────────────────────────────────────────────────────

def generate_forecast(base_price: float, months: int, trend_factor: float = 0.02) -> list:
    forecast = []
    price = base_price
    m_names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    curr_m = datetime.utcnow().month

    for i in range(1, months + 1):
        m_idx = (curr_m + i - 1) % 12
        # Simple seasonal nudge
        seasonal = 1.02 if m_idx in [9, 10, 11] else 0.98 if m_idx in [3, 4] else 1.0
        
        price = price * (1 + trend_factor + random.uniform(-0.005, 0.005)) * seasonal
        var = price * 0.05 
        
        forecast.append(PricePoint(
            month=f"{m_names[m_idx]} {datetime.utcnow().year + (curr_m + i - 1) // 12}",
            predictedPrice=round(price, 2),
            minPrice=round(price - var, 2),
            maxPrice=round(price + var, 2),
            unit="INR/quintal"
        ))
    return forecast

# ── Endpoints ─────────────────────────────────────────────────

class SyncRequest(BaseModel):
    commodity_id: str
    market_id: str
    district_id: str  # State is fixed as 16 (Maharashtra)

class SyncResponse(BaseModel):
    success: bool
    message: str
    data: dict = {}
    error: Optional[str] = None

# ── Endpoints ────────────────────────────────────────────────────

@router.post("/sync-agmarknet", response_model=SyncResponse)
async def sync_agmarknet_data(req: SyncRequest):
    """
    Fetch real-time Agmarknet data, display as table, then predict future prices
    """
    try:
        logger.info(f"Fetching Agmarknet data for commodity: {req.commodity_id}, market: {req.market_id}, district: {req.district_id}")
        
        # Fetch 5 years of historical data
        records = await sync_agmarknet_to_database(
            req.commodity_id, 
            req.market_id, 
            req.district_id
        )
        
        if records:
            # Extract all prices for AI prediction (convert strings to numbers)
            prices = [float(record.get('model_price_wt', 0)) for record in records if record.get('model_price_wt')]
            
            # Generate AI prediction using all historical prices
            if prices:
                base_price = prices[0]  # Latest price
                # Calculate trend from all historical data
                if len(prices) > 10:
                    recent_avg = sum(prices[:10]) / 10
                    older_avg = sum(prices[10:20]) / 10 if len(prices) > 20 else sum(prices[10:]) / len(prices[10:])
                    trend_factor = (recent_avg - older_avg) / older_avg if older_avg > 0 else 0.02
                else:
                    trend_factor = 0.02
                
                # Generate 4-month forecast
                forecast = generate_forecast(base_price, 4, trend_factor=trend_factor)
                
                return SyncResponse(
                    success=True,
                    message="Data fetched and predictions generated successfully",
                    data={
                        'historical_data': records,
                        'prices': prices,
                        'forecast': [f.dict() for f in forecast],
                        'base_price': base_price,
                        'trend_factor': trend_factor,
                        'forecast_months': 4
                    },
                    error=None
                )
            else:
                return SyncResponse(
                    success=False,
                    message="No price data found",
                    data={},
                    error="No valid price data in records"
                )
        else:
            return SyncResponse(
                success=False,
                message="No data found",
                data={},
                error="No records found for this selection"
            )
                
    except Exception as e:
        logger.error(f"Agmarknet fetch error: {e}")
        return SyncResponse(
            success=False,
            message=f"Fetch failed: {str(e)}",
            data={},
            error=str(e)
        )

@router.post("/crop-price", response_model=PredictResponse)
@require_token
async def predict_crop_price(req: PredictRequest):
    """
    Analyzes historical local Postgres data to predict the next few months
    for a specific commodity-market combination.
    """
    try:
        pool = get_pool()
        
        # 1. Fetch records from PostgreSQL
        async with pool.acquire() as conn:
            records = await conn.fetch('''
                SELECT rep_date, modal_price 
                FROM agmarknet_historical 
                WHERE cmdt_id = $1 AND market_id = $2
                ORDER BY rep_date DESC
                LIMIT 100
            ''', int(req.commodity_id), int(req.market_id))

        if not records:
            return PredictResponse(success=False, cropName=req.cropName, error="Insufficient historical data for this market.")

        # 2. Process
        matches = [dict(r) for r in records]
        df = pd.DataFrame(matches)
        
        # Already sorted by rep_date DESC from SQL
        latest_row = df.iloc[0]
        latest_price = float(latest_row['modal_price'])
        last_date = latest_row['rep_date'].strftime('%Y-%m-%d')

        # 3. Trend Analysis
        if len(df) > 5:
            # simple trend: comparison of recent 5 vs prior 5
            recent = df.head(min(5, len(df)))['modal_price'].astype(float).mean()
            prior = df.tail(min(5, len(df)))['modal_price'].astype(float).mean()
            trend_val = (recent - prior) / prior if prior > 0 else 0.01
        else:
            trend_val = 0.02

        # 4. Predict
        forecast = generate_forecast(latest_price, req.forecastMonths, trend_factor=trend_val)

        return PredictResponse(
            success=True,
            cropName=req.cropName,
            currentMarketPrice=latest_price,
            forecast=forecast,
            trend="rising" if trend_val > 0 else "falling",
            confidence=round(min(0.95, 0.6 + (len(matches)/100)), 2),
            lastUpdated=last_date
        )

    except Exception as e:
        logger.error(f"Prediction Error: {e}")
        return PredictResponse(success=False, cropName=req.cropName, error=str(e))

@router.get("/metadata")
async def get_metadata():
    """Return unified data.json hierarchy for dropdowns."""
    try:
        path = os.path.join(BASE_DIR, "data.json")
        if not os.path.exists(path):
             path = os.path.join(BASE_DIR, "..", "data.json")
             
        with open(path, 'r') as f:
            return json.load(f)
    except Exception as e:
        return {"error": f"Metadata file not found: {str(e)}"}
