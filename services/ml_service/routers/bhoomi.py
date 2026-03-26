"""
Bhoomi RTC Scraper — fetches Karnataka land records from landrecords.karnataka.gov.in
BUG-023 fix: implements actual automated RTC fetching instead of PDF upload only
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import logging, re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import pytesseract
from PIL import Image
import requests, io, base64

router = APIRouter()
logger = logging.getLogger("bhoomi-scraper")

# ── Models ────────────────────────────────────────────────────

class RTCRequest(BaseModel):
    district: str
    taluk: str
    hobli: str
    village: str
    surveyNumber: str
    hissaNumber: Optional[str] = None

class RTCResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    rawText: Optional[str] = None
    error: Optional[str] = None

# ── CAPTCHA Solver ────────────────────────────────────────────

def solve_captcha_with_ocr(driver: webdriver.Chrome, captcha_element_id: str = "imgCaptcha") -> str:
    """
    Uses Tesseract OCR or Google Vision AI to solve simple text CAPTCHAs.
    For complex CAPTCHAs, consider 2captcha.com API integration.
    """
    try:
        captcha_el = driver.find_element(By.ID, captcha_element_id)
        captcha_b64 = driver.execute_script(
            "var c=document.createElement('canvas'); var ctx=c.getContext('2d');"
            "var img=arguments[0]; c.width=img.naturalWidth; c.height=img.naturalHeight;"
            "ctx.drawImage(img,0,0); return c.toDataURL('image/png').substring(22);",
            captcha_el
        )
        img_data = base64.b64decode(captcha_b64)
        img = Image.open(io.BytesIO(img_data)).convert('L')  # Grayscale
        # Increase contrast for better OCR
        img = img.point(lambda x: 0 if x < 128 else 255, '1')
        text = pytesseract.image_to_string(img, config='--psm 8 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789').strip()
        return text
    except Exception as e:
        logger.error(f"CAPTCHA solve failed: {e}")
        return ""

def get_chrome_driver() -> webdriver.Chrome:
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1280,800")
    options.add_argument("--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36")
    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=options)

# ── RTC Parser (from HTML table — much more reliable than PDF) ──

def parse_rtc_html(html: str) -> dict:
    """
    Parses the RTC HTML table returned by Bhoomi portal.
    Returns structured dict with all land details.
    BUG-019 fix: parse HTML table directly instead of regex on PDF text.
    """
    soup = BeautifulSoup(html, 'lxml')
    result = {
        "location": {},
        "land_identification": {},
        "land_details": {},
        "ownership": [],
        "cultivation": []
    }

    tables = soup.find_all('table')

    for table in tables:
        rows = table.find_all('tr')
        for row in rows:
            cells = [td.get_text(strip=True) for td in row.find_all(['td', 'th'])]
            if not cells:
                continue
            text = ' '.join(cells)

            # Extract location info
            if 'ತಾಲ್ಲೂಕು' in text or 'Taluk' in text:
                for i, cell in enumerate(cells):
                    if 'ತಾಲ್ಲೂಕು' in cell or 'Taluk' in cell:
                        if i + 1 < len(cells):
                            result["location"]["taluk"] = cells[i + 1]
            if 'ಹೋಬಳಿ' in text or 'Hobli' in text:
                for i, cell in enumerate(cells):
                    if 'ಹೋಬಳಿ' in cell or 'Hobli' in cell:
                        if i + 1 < len(cells):
                            result["location"]["hobli"] = cells[i + 1]
            if 'ಗ್ರಾಮ' in text or 'Village' in text:
                for i, cell in enumerate(cells):
                    if 'ಗ್ರಾಮ' in cell or 'Village' in cell:
                        if i + 1 < len(cells):
                            result["location"]["village"] = cells[i + 1]

            # Survey number
            survey_match = re.search(r'(\d+[/\*]?\d*)', text)
            if survey_match and 'ಸರ್ವೆ' in text:
                result["land_identification"]["survey_number"] = survey_match.group(1)

            # Extent
            extent_match = re.search(r'(\d+\.\d+\.\d+\.\d+)', text)
            if extent_match:
                result["land_details"]["total_extent"] = extent_match.group(1)

            # Owner info — look for Kannada name patterns
            if 'ಮಾಲೀಕ' in text or 'Owner' in text:
                for i, cell in enumerate(cells):
                    if 'ಮಾಲೀಕ' in cell or 'Owner' in cell:
                        if i + 1 < len(cells) and cells[i + 1]:
                            result["ownership"].append({
                                "name": cells[i + 1],
                                "type": "owner"
                            })

    return result

# ── Main Scraper Endpoint ─────────────────────────────────────

@router.post("/fetch-rtc", response_model=RTCResponse)
async def fetch_rtc(req: RTCRequest):
    """
    Fetches RTC from Karnataka Bhoomi portal for a given survey number.
    Implements a robust retry loop for CAPTCHA failures.
    """
    max_retries = 3
    last_error = "Unknown error"

    for attempt in range(max_retries):
        driver = None
        try:
            driver = get_chrome_driver()
            wait = WebDriverWait(driver, 20)
            
            # Navigate to Bhoomi RTC portal
            driver.get("https://landrecords.karnataka.gov.in/service1/")
            logger.info(f"Attempt {attempt+1}: Fetching RTC for {req.district}/{req.taluk}/{req.village}/{req.surveyNumber}")

            # 1. Select District (Wait for clickability)
            dist_el = wait.until(EC.element_to_be_clickable((By.ID, "ddlDist")))
            dist_select = Select(dist_el)
            # Try to match district name regardless of case
            dist_options = [o.text for o in dist_select.options]
            match = next((o for o in dist_options if o.upper() == req.district.upper()), req.district)
            dist_select.select_by_visible_text(match)

            # 2. Taluk
            wait.until(EC.presence_of_element_located((By.XPATH, "//select[@id='ddlTaluk']/option[2]")))
            taluk_el = driver.find_element(By.ID, "ddlTaluk")
            taluk_select = Select(taluk_el)
            taluk_options = [o.text for o in taluk_select.options]
            match = next((o for o in taluk_options if o.upper() == req.taluk.upper()), req.taluk)
            taluk_select.select_by_visible_text(match)

            # 3. Hobli
            wait.until(EC.presence_of_element_located((By.XPATH, "//select[@id='ddlHobli']/option[2]")))
            hobli_el = driver.find_element(By.ID, "ddlHobli")
            hobli_select = Select(hobli_el)
            hobli_options = [o.text for o in hobli_select.options]
            match = next((o for o in hobli_options if o.upper() == req.hobli.upper()), req.hobli)
            hobli_select.select_by_visible_text(match)

            # 4. Village
            wait.until(EC.presence_of_element_located((By.XPATH, "//select[@id='ddlVillage']/option[2]")))
            village_el = driver.find_element(By.ID, "ddlVillage")
            village_select = Select(village_el)
            village_options = [o.text for o in village_select.options]
            match = next((o for o in village_options if o.upper() == req.village.upper()), req.village)
            village_select.select_by_visible_text(match)

            # 5. Survey number
            survey_field = wait.until(EC.element_to_be_clickable((By.ID, "txtSurveyNo")))
            survey_field.clear()
            survey_field.send_keys(req.surveyNumber)

            # 6. Solve CAPTCHA
            wait.until(EC.presence_of_element_located((By.ID, "imgCaptcha")))
            captcha_text = solve_captcha_with_ocr(driver)
            if not captcha_text or len(captcha_text) < 4:
                 # Try once more with a fresh screenshot
                 captcha_text = solve_captcha_with_ocr(driver)
            
            if captcha_text:
                captcha_input = driver.find_element(By.ID, "txtCaptcha")
                captcha_input.clear()
                captcha_input.send_keys(captcha_text)

            # 7. Submit
            driver.find_element(By.ID, "btnFetchDetails").click()

            # 8. Check results or CAPTCHA error
            try:
                # wait specifically for result table or error element
                WebDriverWait(driver, 5).until(
                    EC.any_of(
                        EC.presence_of_element_located((By.ID, "tblDetails")),
                        EC.presence_of_element_located((By.ID, "lblError"))
                    )
                )
                
                # Check for CAPTCHA error specifically (it usually shows in an alert or a label)
                # If captcha error, continue loop (retry)
                # ... implementation omitted for brevity but logic is here ...
                
                result_el = driver.find_elements(By.ID, "tblDetails")
                if result_el:
                    result_html = result_el[0].get_attribute("outerHTML")
                    parsed = parse_rtc_html(result_html)
                    return RTCResponse(success=True, data=parsed, rawText=result_html)
                
                err_el = driver.find_element(By.ID, "lblError")
                if "CAPTCHA" in err_el.text.upper():
                    last_error = "CAPTCHA mismatch"
                    continue # Retry loop
                
                return RTCResponse(success=False, error=err_el.text or "No records found")
            except Exception as e:
                 logger.warning(f"Attempt {attempt+1} result wait failed: {e}")
                 last_error = str(e)
                 continue

        except Exception as e:
            logger.error(f"Attempt {attempt+1} failed: {e}")
            last_error = str(e)
        finally:
            if driver:
                driver.quit()

    return RTCResponse(success=False, error=f"Failed after {max_retries} attempts. Last error: {last_error}")
