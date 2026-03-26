"""
Government Schemes Router
BUG-022 fix: MongoDB-backed schemes with Selenium scraper to populate from govt websites
Enhanced with the AgriLink Eligibility Engine for Top 10 Central Schemes.
"""
from fastapi import APIRouter, Query, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import logging, os, json
from datetime import datetime, timedelta
from db import get_pool
from eligibility_engine import match_schemes
from auth import require_token

router = APIRouter()
logger = logging.getLogger("schemes")

# ── Models ────────────────────────────────────────────────────

class SchemeSearchRequest(BaseModel):
    state: Optional[str] = None
    farmCategory: Optional[str] = None     # small, marginal, medium, large
    landHoldingAcres: Optional[float] = None
    annualIncomeINR: Optional[float] = None
    cropType: Optional[str] = None
    castCategory: Optional[str] = None     # SC, ST, OBC, General
    gender: Optional[str] = None
    # Advanced fields from BPFIS_v5
    isIncomeTaxPayer: Optional[bool] = False
    isGovtEmployee: Optional[bool] = False
    hasLivestock: Optional[bool] = False
    farmingType: Optional[str] = "CONVENTIONAL"
    hasKCC: Optional[bool] = False
    hasAadhaarLinkedBank: Optional[bool] = False

# ── Search Endpoint ───────────────────────────────────────────

@router.post("/search")
@require_token
async def search_schemes(req: SchemeSearchRequest, background_tasks: BackgroundTasks):
    pool = get_pool()
    
    clauses = ["1=1"]
    params = []
    
    if req.state:
        clauses.append(f"(state = ${len(params)+1} OR state IS NULL OR state = 'All')")
        params.append(req.state)
        
    if req.farmCategory:
        clauses.append(f"(eligibility->>'farmCategory' = ${len(params)+1} OR eligibility->>'farmCategory' IS NULL OR eligibility->>'farmCategory' = 'any')")
        params.append(req.farmCategory)

    if req.castCategory:
        clauses.append(f"(eligibility->>'castCategory' = ${len(params)+1} OR eligibility->>'castCategory' IS NULL OR eligibility->>'castCategory' = 'any' OR eligibility->>'castCategory' = 'all')")
        params.append(req.castCategory)

    if req.gender:
        clauses.append(f"(eligibility->>'gender' = ${len(params)+1} OR eligibility->>'gender' IS NULL OR eligibility->>'gender' = 'any' OR eligibility->>'gender' = 'all')")
        params.append(req.gender.lower())

    if req.landHoldingAcres is not None:
        clauses.append(f"(CAST(eligibility->>'maxLandAcres' AS FLOAT) >= ${len(params)+1} OR eligibility->>'maxLandAcres' IS NULL)")
        params.append(req.landHoldingAcres)

    # 1. Advanced Eligibility Engine (Hardcoded top 10 rules)
    eligibility_data = req.dict()
    matched_top_10 = match_schemes(eligibility_data)

    # 2. Database Search (Scraped schemes)
    where_clause = " AND ".join(clauses)
    query = f'SELECT name, "sourceUrl", state, ministry, "scrapedAt", eligibility FROM schemes WHERE {where_clause} LIMIT 50'
    
    async with pool.acquire() as conn:
        rows = await conn.fetch(query, *params)
        scraped_schemes = []
        for r in rows:
            d = dict(r)
            if d.get('eligibility') and isinstance(d['eligibility'], str):
                d['eligibility'] = json.loads(d['eligibility'])
            if d.get('scrapedAt'):
                d['scrapedAt'] = d['scrapedAt'].isoformat()
            scraped_schemes.append(d)
        
        # Merge Top 10 with Scraped
        combined = matched_top_10 + scraped_schemes
        
        last_scheme = await conn.fetchrow('SELECT "scrapedAt" FROM schemes ORDER BY "scrapedAt" DESC LIMIT 1')

    if not last_scheme or not last_scheme["scrapedAt"] or (datetime.utcnow() - last_scheme["scrapedAt"]) > timedelta(days=7):
        background_tasks.add_task(scrape_and_store_schemes)

    return {"success": True, "data": {"schemes": combined, "count": len(combined)}}


@router.get("/all")
@require_token
async def list_all_schemes(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    state: Optional[str] = None,
):
    skip = (page - 1) * limit
    pool = get_pool()
    async with pool.acquire() as conn:
        if state:
            rows = await conn.fetch('SELECT * FROM schemes WHERE state = $1 OR state IS NULL LIMIT $2 OFFSET $3', state, limit, skip)
            total = await conn.fetchval('SELECT COUNT(*) FROM schemes WHERE state = $1 OR state IS NULL', state)
        else:
            rows = await conn.fetch('SELECT * FROM schemes LIMIT $1 OFFSET $2', limit, skip)
            total = await conn.fetchval('SELECT COUNT(*) FROM schemes')

    schemes = []
    for r in rows:
        d = dict(r)
        if d.get('eligibility') and isinstance(d['eligibility'], str):
            d['eligibility'] = json.loads(d['eligibility'])
        if d.get('scrapedAt'):
            d['scrapedAt'] = d['scrapedAt'].isoformat()
        schemes.append(d)

    return {
        "success": True,
        "data": {
            "schemes": schemes,
            "total": total,
            "page": page,
            "pages": (total + limit - 1) // limit,
        }
    }

# ── Admin Management ──────────────────────────────────────────

class SchemeCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    benefit: Optional[str] = None
    ministry: Optional[str] = None
    sourceUrl: str
    state: Optional[str] = None
    eligibility: Optional[Dict[str, Any]] = {}

@router.post("/add")
@require_token
async def add_scheme(req: SchemeCreateRequest):
    pool = get_pool()
    async with pool.acquire() as conn:
        await conn.execute('''
            INSERT INTO schemes (name, description, benefit, ministry, "sourceUrl", state, "scrapedAt", eligibility)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (name, "sourceUrl") DO UPDATE SET
                description = EXCLUDED.description,
                benefit = EXCLUDED.benefit,
                ministry = EXCLUDED.ministry,
                state = EXCLUDED.state,
                eligibility = EXCLUDED.eligibility
        ''', req.name, req.description, req.benefit, req.ministry, req.sourceUrl, req.state, datetime.utcnow(), json.dumps(req.eligibility))
    return {"success": True, "data": {"message": f"Scheme {req.name} added/updated successfully"}}

@router.delete("/delete")
@require_token
async def delete_scheme(name: str):
    pool = get_pool()
    async with pool.acquire() as conn:
        await conn.execute('DELETE FROM schemes WHERE name = $1', name)
    return {"success": True, "data": {"message": f"Scheme {name} deleted"}}

# ── Selenium Scraper ──────────────────────────────────────────

async def scrape_and_store_schemes():
    """
    Selenium scraper for live government scheme data
    """
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    from webdriver_manager.chrome import ChromeDriverManager
    from bs4 import BeautifulSoup

    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    sources = [
        {"url": "https://pmkisan.gov.in/", "state": None, "ministry": "Ministry of Agriculture"},
        {"url": "https://agricoop.nic.in/en/schemes-programmes", "state": None, "ministry": "Ministry of Agriculture & Farmers Welfare"},
        {"url": "https://raitamitra.karnataka.gov.in/", "state": "Karnataka", "ministry": "Karnataka Agriculture Dept"},
    ]

    schemes_to_store = []
    driver = None
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)

        for source in sources:
            try:
                driver.get(source["url"])
                soup = BeautifulSoup(driver.page_source, 'lxml')
                for link in soup.find_all('a', href=True):
                    text = link.get_text(strip=True)
                    if len(text) < 10 or len(text) > 200: continue
                    keywords = ['scheme', 'yojana', 'mission', 'krishi', 'ಗೌರವ']
                    if any(k.lower() in text.lower() for k in keywords):
                        href = link['href']
                        full_url = href if href.startswith('http') else source["url"].rstrip('/') + '/' + href.lstrip('/')
                        schemes_to_store.append({
                            "name": text,
                            "sourceUrl": full_url,
                            "state": source["state"],
                            "ministry": source["ministry"],
                            "scrapedAt": datetime.utcnow(),
                            "eligibility": json.dumps({})
                        })
            except Exception as e:
                logger.error(f"Error scraping {source['url']}: {e}")

        if schemes_to_store:
            pool = get_pool()
            async with pool.acquire() as conn:
                for s in schemes_to_store:
                    await conn.execute('''
                        INSERT INTO schemes (name, "sourceUrl", state, ministry, "scrapedAt", eligibility)
                        VALUES ($1, $2, $3, $4, $5, $6)
                        ON CONFLICT (name, "sourceUrl") DO UPDATE SET
                            state = EXCLUDED.state,
                            ministry = EXCLUDED.ministry,
                            "scrapedAt" = EXCLUDED."scrapedAt"
                    ''', s["name"], s["sourceUrl"], s["state"], s["ministry"], s["scrapedAt"], s["eligibility"])
            logger.info(f"Stored {len(schemes_to_store)} schemes")
    except Exception as e:
        logger.error(f"Scheme scrape error: {e}")
    finally:
        if driver: driver.quit()
