#!/usr/bin/env python3
"""
AgriLink Predictive Alerts Engine
Scans historical data for volatility and notifies admins via Kafka.
"""
import asyncio
import os
import json
import logging
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load root .env
load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

from aiokafka import AIOKafkaProducer
import asyncpg

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("predictive-alerts")

async def get_db_pool():
    db_url = os.getenv("DATABASE_URL_ML") or os.getenv("DATABASE_URL")
    return await asyncpg.create_pool(db_url)

async def scan_and_alert():
    pool = await get_db_pool()
    kafka_brokers = os.getenv("KAFKA_BROKERS", "localhost:9092")
    producer = AIOKafkaProducer(bootstrap_servers=kafka_brokers)
    await producer.start()

    logger.info("Scanning for price volatility...")

    try:
        async with pool.acquire() as conn:
            # Find commodities with >10% jump in the last 7 days compared to previous 7 days
            volatility_query = '''
                WITH recent AS (
                    SELECT cmdt_name, market_name, AVG(modal_price) as avg_price
                    FROM agmarknet_historical
                    WHERE rep_date >= CURRENT_DATE - INTERVAL '7 days'
                    GROUP BY cmdt_name, market_name
                ),
                prior AS (
                    SELECT cmdt_name, market_name, AVG(modal_price) as avg_price
                    FROM agmarknet_historical
                    WHERE rep_date >= CURRENT_DATE - INTERVAL '14 days'
                      AND rep_date < CURRENT_DATE - INTERVAL '7 days'
                    GROUP BY cmdt_name, market_name
                )
                SELECT r.cmdt_name, r.market_name, r.avg_price as current_avg, p.avg_price as prior_avg,
                       ((r.avg_price - p.avg_price) / p.avg_price) * 100 as percent_change
                FROM recent r
                JOIN prior p ON r.cmdt_name = p.cmdt_name AND r.market_name = p.market_name
                WHERE ((r.avg_price - p.avg_price) / p.avg_price) > 0.10
                ORDER BY percent_change DESC
            '''
            alerts = await conn.fetch(volatility_query)

            if not alerts:
                logger.info("No significant volatility detected.")
                return

            for alert in alerts:
                msg = {
                    "type": "PREDICTIVE_ALERT",
                    "severity": "HIGH" if alert['percent_change'] > 20 else "MEDIUM",
                    "subject": f"Price Volatility Alert: {alert['cmdt_name']}",
                    "body": f"The price of {alert['cmdt_name']} in {alert['market_name']} has jumped by {alert['percent_change']:.2f}% this week (from ₹{alert['prior_avg']:.2f} to ₹{alert['current_avg']:.2f}).",
                    "metadata": {
                        "commodity": alert['cmdt_name'],
                        "market": alert['market_name'],
                        "percentChange": alert['percent_change'],
                        "currentPrice": alert['current_avg']
                    },
                    "channels": ["email"] # Target admin email
                }
                
                # Send to Kafka for Notification service to handle
                # In a real app, we'd target specific admin user IDs. 
                # Here we send a generic alert for the system to broadcast.
                await producer.send_and_wait("notification.send", json.dumps(msg).encode('utf-8'))
                logger.info(f"Alert sent for {alert['cmdt_name']} in {alert['market_name']}")

    except Exception as e:
        logger.error(f"Alert Scraper Error: {e}")
    finally:
        await producer.stop()
        await pool.close()

if __name__ == "__main__":
    asyncio.run(scan_and_alert())
