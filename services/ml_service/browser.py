"""
Shared headless-Chrome factory for the scrapers (Bhoomi RTC, schemes).

- Uses the Chromium/chromedriver baked into the Docker image (CHROME_BIN /
  CHROMEDRIVER_PATH) instead of downloading a driver on every call.
- Caps concurrent browsers: each Chrome needs ~300-500 MB, and a free VM must
  not be taken down by a burst of RTC lookups.
"""
import os
import threading
from contextlib import contextmanager

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

MAX_BROWSERS = int(os.getenv("MAX_BROWSERS", "2"))
_slots = threading.BoundedSemaphore(MAX_BROWSERS)


class BrowserBusy(Exception):
    """All browser slots are in use."""


def _build_driver() -> webdriver.Chrome:
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1280,800")
    options.add_argument("--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36")
    if os.getenv("CHROME_BIN"):
        options.binary_location = os.environ["CHROME_BIN"]

    driver_path = os.getenv("CHROMEDRIVER_PATH")
    if driver_path and os.path.exists(driver_path):
        service = Service(driver_path)
    else:  # local development without the Docker image
        from webdriver_manager.chrome import ChromeDriverManager
        service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    driver.set_page_load_timeout(45)
    return driver


@contextmanager
def chrome(wait_seconds: float = 60):
    """Borrow a browser slot; raises BrowserBusy if none frees up in time."""
    if not _slots.acquire(timeout=wait_seconds):
        raise BrowserBusy("Too many land-record lookups in progress, please retry shortly")
    driver = None
    try:
        driver = _build_driver()
        yield driver
    finally:
        try:
            if driver:
                driver.quit()
        finally:
            _slots.release()
