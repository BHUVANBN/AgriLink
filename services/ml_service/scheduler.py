import asyncio
import os
import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from scripts.predictive_alerts import scan_and_alert

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("scheduler")

async def scheduled_task():
    logger.info("Triggering scheduled price volatility scan...")
    try:
        await scan_and_alert()
        logger.info("Volatility scan completed successfully.")
    except Exception as e:
        logger.error(f"Scheduled task failed: {e}")

async def main():
    scheduler = AsyncIOScheduler()
    
    # Run every 4 hours (0, 4, 8, 12, 16, 20)
    scheduler.add_job(scheduled_task, 'cron', hour='0,4,8,12,16,20')
    
    # Also run immediately on startup for verification
    scheduler.add_job(scheduled_task, 'date')
    
    scheduler.start()
    logger.info("AgriLink ML Scheduler started. Inter-service alert scans active every 4h.")
    
    try:
        while True:
            await asyncio.sleep(1000)
    except (KeyboardInterrupt, SystemExit):
        logger.info("Scheduler shutting down...")

if __name__ == "__main__":
    asyncio.run(main())
