import os
import json
import asyncio
import sys
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

import asyncpg

async def import_data():
    db_url = os.getenv("DATABASE_URL_ML")
    if not db_url:
        print("Required DATABASE_URL_ML not found.")
        return

    pool = await asyncpg.create_pool(db_url)
    
    # Initialize schema
    async with pool.acquire() as conn:
        await conn.execute('''
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
        ''')
        print("Schema verified.")
    
    file_path = os.path.join(os.path.dirname(__file__), '../data/full_agmarknet_data_with_ids.json')
    if not os.path.exists(file_path):
        print(f"Data file not found at {file_path}")
        return
        
    with open(file_path, 'r') as f:
        data = json.load(f)
        
    print(f"Loaded {len(data)} records. Preparing insertion.")

    inserted = 0
    skipped = 0
    
    async with pool.acquire() as conn:
        for p in data:
            try:
                # data.json rep_date might be DD-MM-YYYY, Postgres expects YYYY-MM-DD for casting or string standard
                dt_parts = p.get('rep_date', '01-01-2000').split('-')
                if len(dt_parts) == 3:
                     pg_date = f"{dt_parts[2]}-{dt_parts[1]}-{dt_parts[0]}"
                else: 
                     pg_date = p.get('rep_date')

                await conn.execute('''
                    INSERT INTO agmarknet_historical (
                        rep_date, cmdt_name, cmdt_id, market_name, market_id,
                        district_name, district_id, group_id, modal_price, arrival_qty
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    ON CONFLICT(rep_date, cmdt_id, market_id) DO NOTHING
                ''', 
                pg_date,
                p.get('commodity'), 
                int(p.get('commodity_id', 0)), 
                p.get('market'), 
                int(p.get('market_id', 0)),
                p.get('district'), 
                int(p.get('district_id', 0)), 
                int(p.get('group_id', 0)), 
                float(p.get('model_price_wt') or 0), 
                float(p.get('arrival_wt') or 0))
                
                inserted += 1
            except Exception as e:
                skipped += 1
                # print(f"Error skipping: {e}")
                pass
                
    print(f"Migrated JSON data to PostgreSQL. Inserted: {inserted}. Skipped/Dupes: {skipped}")
    await pool.close()

if __name__ == "__main__":
    asyncio.run(import_data())
