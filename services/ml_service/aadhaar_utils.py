"""
Aadhaar helpers: Verhoeff checksum, masking, and a deterministic parser used
when the AI extractor (Groq) is unavailable.

Compliance: never store or return a full Aadhaar number — only the masked
form (last 4 digits) and whether the checksum was valid.
"""
from __future__ import annotations

import re
from typing import Optional

# Verhoeff tables (Aadhaar's check-digit scheme)
_D = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 0, 6, 7, 8, 9, 5], [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7], [4, 0, 1, 2, 3, 9, 5, 6, 7, 8], [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2], [7, 6, 5, 9, 8, 2, 1, 0, 4, 3], [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
]
_P = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 5, 7, 6, 2, 8, 3, 0, 9, 4], [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7], [9, 4, 5, 3, 1, 2, 6, 8, 7, 0], [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5], [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
]


def verhoeff_valid(number: str) -> bool:
    digits = re.sub(r"\D", "", number or "")
    if len(digits) != 12 or digits[0] in "01":  # Aadhaar never starts with 0 or 1
        return False
    c = 0
    for i, ch in enumerate(reversed(digits)):
        c = _D[c][_P[i % 8][int(ch)]]
    return c == 0


def mask(number: Optional[str]) -> Optional[str]:
    digits = re.sub(r"\D", "", number or "")
    return f"XXXX XXXX {digits[-4:]}" if len(digits) == 12 else None


_NUM = re.compile(r"\b(\d{4})\s?(\d{4})\s?(\d{4})\b")
_DOB = re.compile(r"(?:DOB|D\.O\.B|Date of Birth|ಜನ್ಮ ದಿನಾಂಕ)\s*[:/]?\s*(\d{2}[/-]\d{2}[/-]\d{4})", re.I)
_YOB = re.compile(r"(?:Year of Birth|YOB)\s*[:/]?\s*(\d{4})", re.I)
_GENDER = re.compile(r"\b(MALE|FEMALE|TRANSGENDER)\b|(ಪುರುಷ)|(ಮಹಿಳೆ)", re.I)
_SKIP = re.compile(r"government|india|aadhaar|ಭಾರತ|ಸರ್ಕಾರ|dob|birth|male|female|ಆಧಾರ್|vid|enrol|help|www|uidai", re.I)


def parse_aadhaar_text(text: str) -> dict:
    """Best-effort field extraction from OCR text without an LLM."""
    out: dict = {}
    text = text or ""
    for m in _NUM.finditer(text):
        candidate = "".join(m.groups())
        if verhoeff_valid(candidate):
            out["aadhaar_number"] = candidate
            break
    dob = _DOB.search(text) or _YOB.search(text)
    if dob:
        out["dob"] = dob.group(1).replace("-", "/")
    g = _GENDER.search(text)
    if g:
        out["gender"] = "MALE" if (g.group(1) or "").upper() == "MALE" or g.group(2) else (
            "FEMALE" if (g.group(1) or "").upper() == "FEMALE" or g.group(3) else "TRANSGENDER")

    # Name: the English line just above the DOB/YOB line is the cardholder name
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    for i, line in enumerate(lines):
        if _DOB.search(line) or _YOB.search(line):
            for back in range(i - 1, max(i - 4, -1), -1):
                cand = lines[back]
                if _SKIP.search(cand) or re.search(r"\d", cand):
                    continue
                if "name_english" not in out and re.fullmatch(r"[A-Za-z][A-Za-z .']{2,60}", cand):
                    out["name_english"] = re.sub(r"\s+", " ", cand).title()
                elif "name_kannada" not in out and re.search("[ಀ-೿]", cand):
                    out["name_kannada"] = cand
                if "name_english" in out and "name_kannada" in out:
                    break
            break
    return out
