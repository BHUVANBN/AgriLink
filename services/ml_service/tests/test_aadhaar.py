import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from aadhaar_utils import verhoeff_valid, mask, parse_aadhaar_text

# 2341 2341 2346 is a well-known Verhoeff-valid test pattern (not a real person)
VALID = "234123412346"

def test_verhoeff():
    assert verhoeff_valid(VALID)
    assert verhoeff_valid("2341 2341 2346")
    assert not verhoeff_valid("234123412345")   # one digit off → caught
    assert not verhoeff_valid("134123412346")   # cannot start with 1
    assert not verhoeff_valid("1234")

def test_mask_never_reveals_more_than_last_four():
    assert mask(VALID) == "XXXX XXXX 2346"
    assert mask("abc") is None

def test_parser_extracts_fields_from_typical_card_text():
    text = """ಭಾರತ ಸರ್ಕಾರ
Government of India
ರಮೇಶ್ ಕುಮಾರ್
Ramesh Kumar
DOB: 15/08/1985
MALE
2341 2341 2346
Aadhaar - Aam Aadmi ka Adhikar"""
    f = parse_aadhaar_text(text)
    assert f["aadhaar_number"] == VALID
    assert f["name_english"] == "Ramesh Kumar"
    assert f["name_kannada"] == "ರಮೇಶ್ ಕುಮಾರ್"
    assert f["dob"] == "15/08/1985"
    assert f["gender"] == "MALE"

def test_parser_ignores_numbers_that_fail_checksum():
    f = parse_aadhaar_text("Name Here\nDOB: 01/01/1990\n2341 2341 2345")
    assert "aadhaar_number" not in f

if __name__ == "__main__":
    for name, fn in list(globals().items()):
        if name.startswith("test_"):
            fn(); print("ok", name)
