import os
import asyncpg
import logging

logger = logging.getLogger("ml-db")
_pool = None

async def init_db():
    global _pool
    # Accept the new POSTGRES variable
    db_url = os.getenv("DATABASE_URL_ML") or os.getenv("DATABASE_URL")
    if not db_url or "mongodb" in db_url:
        # Failsafe if string isn't swapped yet
        logger.error(f"Invalid POSTGRES db_url: {db_url}")
        return

    logger.info("Connecting to PostgreSQL pool...")
    _pool = await asyncpg.create_pool(db_url)

    async with _pool.acquire() as conn:
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS crop_prices (
                id SERIAL PRIMARY KEY,
                "cropName" VARCHAR NOT NULL,
                "modalPrice" FLOAT,
                "minPrice" FLOAT,
                "maxPrice" FLOAT,
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS agmarknet_historical (
                id SERIAL PRIMARY KEY,
                rep_date DATE NOT NULL,
                cmdt_name VARCHAR,
                cmdt_id INT,
                market_name VARCHAR,
                market_id INT,
                district_name VARCHAR,
                district_id INT,
                group_id INT,
                state_id INT DEFAULT 16,
                modal_price FLOAT,
                arrival_qty FLOAT,
                UNIQUE(rep_date, cmdt_id, market_id)
            );
            CREATE TABLE IF NOT EXISTS schemes (
                id SERIAL PRIMARY KEY,
                name VARCHAR NOT NULL,
                description TEXT,
                benefit TEXT,
                "sourceUrl" TEXT NOT NULL,
                state VARCHAR,
                ministry VARCHAR,
                "scrapedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                eligibility JSONB,
                UNIQUE(name, "sourceUrl")
            );
        ''')
    logger.info("PostgreSQL schema initialized for prediction and historical data.")

async def close_db():
    global _pool
    if _pool:
        await _pool.close()

def get_pool():
    if not _pool:
        raise Exception("Database pool not initialized")
    return _pool
