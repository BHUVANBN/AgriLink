"""
OCR Route — Industry-standard Kannada PDF/Image extraction
BUG-018 fix: no pdftotext dependency — uses pdf2image + Google Vision AI
BUG-019 fix: structured AI parsing instead of fragile regex
BUG-020 fix: normalizeName preserves display form separately
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Optional
import logging, io, os, json, tempfile, re, math
import cv2
import numpy as np

router = APIRouter()
logger = logging.getLogger("ocr-service")

# Google Vision AI (BUG-018/019 fix: industry-standard OCR)
try:
    from google.cloud import vision
    GCP_VISION_AVAILABLE = True
except ImportError:
    GCP_VISION_AVAILABLE = False
    logger.warning("google-cloud-vision not installed — falling back to Tesseract")

# Groq Llama 3 for AI-powered field extraction
try:
    from groq import Groq
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    if GROQ_API_KEY:
        groq_client = Groq(api_key=GROQ_API_KEY)
    GROQ_AVAILABLE = bool(GROQ_API_KEY)
except ImportError:
    GROQ_AVAILABLE = False

# pdf2image for converting PDF pages to images
try:
    from pdf2image import convert_from_bytes
    PDF2IMAGE_AVAILABLE = True
except ImportError:
    PDF2IMAGE_AVAILABLE = False

import pytesseract
from PIL import Image

# ── Models ────────────────────────────────────────────────────

class RTCExtractResult(BaseModel):
    success: bool
    location: Optional[dict] = None
    landIdentification: Optional[dict] = None
    landDetails: Optional[dict] = None
    ownership: Optional[dict] = None
    cultivation: Optional[list] = None
    confidence: Optional[float] = None
    error: Optional[str] = None

class AadhaarExtractResult(BaseModel):
    success: bool
    aadhaarNumber: Optional[str] = None
    nameEnglish: Optional[str] = None
    nameKannada: Optional[str] = None
    nameDisplay: Optional[str] = None      # BUG-020 fix: separate display form
    nameNormalized: Optional[str] = None   # For comparison only
    dob: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    confidence: Optional[float] = None
    error: Optional[str] = None

class LandSketchPoint(BaseModel):
    lat: float
    lng: float
    order: int

class LandSketchExtractResult(BaseModel):
    success: bool
    surveyNumber: Optional[str] = None
    center: Optional[dict] = None # {lat, lng}
    boundary: Optional[list[dict]] = None # [{lat, lng, order}]
    area_sq_mtrs: Optional[float] = None
    edges: Optional[list[dict]] = None # [{from, to, distance_mtrs}]
    confidence: Optional[float] = None
    error: Optional[str] = None

# ── OCR Helpers ───────────────────────────────────────────────

def extract_text_with_vision_ai(image_bytes: bytes) -> str:
    """Uses Google Vision AI for best-in-class Kannada/multilingual OCR."""
    client = vision.ImageAnnotatorClient()
    image = vision.Image(content=image_bytes)
    response = client.document_text_detection(image=image)
    if response.error.message:
        raise Exception(response.error.message)
    return response.full_text_annotation.text

def extract_text_with_tesseract(image: Image.Image) -> str:
    """Fallback OCR using Tesseract with Kannada + English language pack."""
    # Use both Kannada and English for mixed-script documents
    return pytesseract.image_to_string(image, lang='kan+eng', config='--psm 3')

def pdf_to_images(pdf_bytes: bytes) -> list[Image.Image]:
    """Convert PDF bytes to list of PIL Images using pdf2image."""
    if not PDF2IMAGE_AVAILABLE:
        raise Exception("pdf2image not available. Install poppler-utils.")
    return convert_from_bytes(pdf_bytes, dpi=300, fmt='png')

async def extract_text_from_file(content: bytes, content_type: str) -> str:
    """
    Main text extraction pipeline:
    1. Convert PDF to images (no pdftotext dependency — fixes BUG-018)
    2. OCR via Google Vision AI (best quality) or Tesseract (fallback)
    """
    if content_type in ['text/html', 'application/xhtml+xml']:
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(content, 'html.parser')
        # Remove script and style elements
        for script_or_style in soup(['script', 'style']):
            script_or_style.decompose()
        return soup.get_text(separator=' \n ', strip=True)

    images = []
    if content_type == 'application/pdf':
        images = pdf_to_images(content)
    else:
        images = [Image.open(io.BytesIO(content))]

    all_text = []
    for img in images:
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes = img_bytes.getvalue()

        if GCP_VISION_AVAILABLE and os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
            text = extract_text_with_vision_ai(img_bytes)
        else:
            text = extract_text_with_tesseract(img)

        all_text.append(text)

    return '\n'.join(all_text)

# ── AI Field Extractor (Gemini) ─────────────────────────────

async def extract_rtc_fields_with_ai(raw_text: str) -> dict:
    """
    Uses Groq (Llama 3) to intelligently extract structured RTC fields from OCR text.
    """
    if not GROQ_AVAILABLE:
        return {}

    prompt = f"""You are an expert at parsing Karnataka Bhoomi RTC (Record of Rights, Tenancy and Cultivations) documents in Kannada.

Extract the following fields from this OCR text. The document may be in Kannada script.
Return ONLY a valid JSON object with these exact keys:
{{
  "taluk": "string or null",
  "hobli": "string or null", 
  "village": "string or null",
  "district": "string or null",
  "survey_number": "string or null",
  "hissa_number": "string or null",
  "total_extent_acres": "string or null",
  "phut_kharab_a": "string or null",
  "phut_kharab_b": "string or null",
  "land_tax": "string or null",
  "soil_type": "string or null",
  "owner_names": ["array of strings"],
  "account_number": "string or null",
  "mutation_number": "string or null",
  "valid_from": "string or null",
  "cultivation": [
    {{"year": "string", "season": "string", "crop": "string", "extent": "string"}}
  ]
}}

OCR Text:
{raw_text[:8000]}"""

    try:
        print(f"[OCR-RTC] Raw Text Sample: {raw_text[:200]}...")
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You output only valid JSON. No markdown, no prefixes."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        text = completion.choices[0].message.content.strip()
        print(f"[OCR-RTC] LLM Response: {text}")
        return json.loads(text)
    except Exception as e:
        logger.error(f"Groq RTC extraction failed: {e}")
        return {}

async def extract_aadhaar_fields_with_ai(raw_text: str) -> dict:
    """AI-powered Aadhaar field extraction using Groq."""
    if not GROQ_AVAILABLE:
        return {}

    prompt = f"""Extract structured information from this Aadhaar card OCR text.
The document may contain both English and Kannada text.
Return ONLY a valid JSON object:
{{
  "aadhaar_number": "XXXX XXXX XXXX format or null",
  "name_english": "string or null",
  "name_kannada": "Kannada script name or null",
  "dob": "DD/MM/YYYY or null",
  "gender": "MALE or FEMALE or null",
  "address_english": "full English address or null",
  "address_kannada": "full Kannada address or null",
  "mobile": "10-digit number or null"
}}

OCR Text:
{raw_text[:8000]}"""

    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You output only valid JSON. No markdown."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        text = completion.choices[0].message.content.strip()
        return json.loads(text)
    except Exception as e:
        logger.error(f"Groq Aadhaar extraction failed: {e}")
        return {}

async def extract_land_sketch_geometry(image_bytes: bytes) -> dict:
    """
    High-precision Land Sketch integration.
    Calls the battle-tested sketch_to_map.py engine and parses its refined output.
    """
    
    # Securely save temporary file for the engine
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
        tmp.write(image_bytes)
        tmp_path = tmp.name
    
    try:
        from .sketch_to_map import run_pipeline
        
        # Execute the high-precision engine directly (no subprocess needed!)
        fields = run_pipeline(tmp_path)
        
        logger.info(f"Engine Success: Survey {fields.get('survey_number')}")
        
        return {
            "success": True,
            "surveyNumber": fields.get("survey_number"),
            "center": fields.get("center"),
            "boundary": fields.get("boundary"),
            "area_sq_mtrs": fields.get("area_sq_mtrs"),
            "map_path": fields.get("map_path"),
            "raw_output": fields.get("raw_output"),
            "confidence": 0.99
        }
    except Exception as e:
        logger.error(f"Mapping Integration Error: {e}")
        return {"success": False, "error": f"AI Engine failed: {str(e)}"}
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)

async def extract_land_sketch_with_ai(raw_text: str) -> dict:
    """Groq-powered text refinement for sketch headers if regex fails."""
    if not GROQ_AVAILABLE: return {}
    prompt = f"""Extract 'survey_number' and 'center' (lat/lng) from this document snippet.
Return a valid JSON object:
{{
  "survey_number": "string or null",
  "center": {{ "lat": float or null, "lng": float or null }}
}}

OCR Snippet:
{raw_text}"""
    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a specialized document parser. Output only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        logger.error(f"Groq Sketch extraction failed: {str(e)}")
        return {}

# ── Name Normalization (BUG-020 fix) ─────────────────────────

def normalize_name_for_comparison(name: Optional[str]) -> Optional[str]:
    """Strips spaces and punctuation — used ONLY for cross-doc comparison."""
    if not name:
        return None
    import re
    return re.sub(r'[\s.,;:!?\'"(){}\[\]\\]', '', name).upper()

def normalize_name_for_display(name: Optional[str]) -> Optional[str]:
    """Cleans up spacing/punctuation but preserves readability."""
    if not name:
        return None
    import re
    return re.sub(r'\s+', ' ', name.strip().strip('.,'))

# ── Endpoints ─────────────────────────────────────────────────

@router.post("/extract-rtc", response_model=RTCExtractResult)
async def extract_rtc(file: UploadFile = File(...)):
    """
    Extract structured data from RTC PDF/image.
    Uses Google Vision AI + Gemini for Kannada OCR — fixes BUG-018, BUG-019.
    """
    content = await file.read()
    content_type = file.content_type or 'application/pdf'

    try:
        raw_text = await extract_text_from_file(content, content_type)
        if not raw_text.strip():
            return {"success": False, "error": "Could not extract text from document"}

        # AI-powered extraction (BUG-019 fix)
        fields = await extract_rtc_fields_with_ai(raw_text)

        return {
            "success": True,
            "location": {
                "taluk": fields.get("taluk"),
                "hobli": fields.get("hobli"),
                "village": fields.get("village"),
                "district": fields.get("district"),
            },
            "landIdentification": {
                "survey_number": fields.get("survey_number"),
                "hissa_number": fields.get("hissa_number"),
                "valid_from": fields.get("valid_from"),
            },
            "landDetails": {
                "total_extent": fields.get("total_extent_acres"),
                "phut_kharab_a": fields.get("phut_kharab_a"),
                "phut_kharab_b": fields.get("phut_kharab_b"),
                "land_tax": fields.get("land_tax"),
                "soil_type": fields.get("soil_type"),
            },
            "ownership": {
                "owners": fields.get("owner_names", []),
                "account_number": fields.get("account_number"),
                "mutation_number": fields.get("mutation_number"),
            },
            "cultivation": fields.get("cultivation", []),
            "confidence": 0.9 if GROQ_AVAILABLE else 0.6,
        }
    except Exception as e:
        logger.error(f"RTC extraction error: {e}")
        return {"success": False, "error": str(e)}


@router.post("/extract-aadhaar", response_model=AadhaarExtractResult)
async def extract_aadhaar(file: UploadFile = File(...)):
    """Extract structured data from Aadhaar card PDF/image."""
    content = await file.read()
    content_type = file.content_type or 'application/pdf'

    try:
        raw_text = await extract_text_from_file(content, content_type)
        if not raw_text.strip():
            return {"success": False, "error": "Could not extract text"}

        fields = await extract_aadhaar_fields_with_ai(raw_text)

        name_eng = fields.get("name_english")
        name_kan = fields.get("name_kannada")

        return {
            "success": True,
            "aadhaarNumber": fields.get("aadhaar_number"),
            "nameEnglish": name_eng,
            "nameKannada": name_kan,
            # BUG-020 fix: separate display vs comparison forms
            "nameDisplay": normalize_name_for_display(name_eng or name_kan),
            "nameNormalized": normalize_name_for_comparison(name_eng or name_kan),
            "dob": fields.get("dob"),
            "gender": fields.get("gender"),
            "address": fields.get("address_english") or fields.get("address_kannada"),
            "confidence": 0.92 if GROQ_AVAILABLE else 0.65,
        }
    except Exception as e:
        logger.error(f"Aadhaar extraction error: {e}")
        return {"success": False, "error": str(e)}

@router.post("/extract-land-sketch", response_model=LandSketchExtractResult)
async def extract_land_sketch(file: UploadFile = File(...)):
    """Extract structured boundary data from a Land Survey Sketch."""
    content = await file.read()
    content_type = file.content_type or 'image/png'

    try:
        # New high-precision CV pipeline
        fields = await extract_land_sketch_geometry(content)
        
        if not fields.get("success"):
            return {"success": False, "error": fields.get("error", "Vision pipeline failed")}

        return {
            "success": True,
            "surveyNumber": fields.get("survey_number"),
            "center": fields.get("center"),
            "boundary": fields.get("boundary"),
            "area_sq_mtrs": fields.get("area_sq_mtrs"),
            "map_path": fields.get("map_path"),
            "raw_output": fields.get("raw_output"),
            "confidence": 0.99
        }
    except Exception as e:
        logger.error(f"Land sketch extraction error: {e}")
        return {"success": False, "error": str(e)}
