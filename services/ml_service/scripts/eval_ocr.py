"""
Measure OCR + field-extraction accuracy on YOUR documents.

  samples/
    ramesh-aadhaar.jpg
    ramesh-aadhaar.expected.json   {"type": "aadhaar", "name_english": "Ramesh Kumar", "dob": "15/08/1985", "gender": "MALE"}
    plot45-rtc.pdf
    plot45-rtc.expected.json       {"type": "rtc", "survey_number": "45/2", "owner": "Ramesh Kumar", "total_extent": "2.10.0"}

Run inside the ML image (has Tesseract/poppler; add GCP + GROQ keys to test
the full pipeline):

  docker run --rm -v $PWD/samples:/samples --env-file .env agrilink/ml \\
      python scripts/eval_ocr.py /samples

Never commit real Aadhaar/RTC scans to the repository.
"""
import json, mimetypes, os, re, sys
from difflib import SequenceMatcher

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from routers.ocr import extract_text_from_file, extract_aadhaar_fields_with_ai, extract_rtc_fields_with_ai  # noqa: E402
from aadhaar_utils import parse_aadhaar_text  # noqa: E402


def norm(v):
    return re.sub(r"[^0-9a-zಀ-೿/.]", "", str(v or "").lower())


def similar(a, b):
    return SequenceMatcher(None, norm(a), norm(b)).ratio()


def evaluate(folder):
    results = {}
    files = sorted(f for f in os.listdir(folder) if not f.endswith(".json"))
    for f in files:
        base = os.path.splitext(f)[0]
        exp_path = os.path.join(folder, base + ".expected.json")
        if not os.path.exists(exp_path):
            print(f"skip {f} (no {base}.expected.json)")
            continue
        expected = json.load(open(exp_path))
        content = open(os.path.join(folder, f), "rb").read()
        ctype = mimetypes.guess_type(f)[0] or "application/pdf"
        text = extract_text_from_file(content, ctype)

        if expected["type"] == "aadhaar":
            got = {**parse_aadhaar_text(text), **{k: v for k, v in (extract_aadhaar_fields_with_ai(text) or {}).items() if v}}
            checks = {k: got.get(k) for k in ("name_english", "dob", "gender")}
        else:
            got = extract_rtc_fields_with_ai(text) or {}
            checks = {
                "survey_number": got.get("survey_number"),
                "owner": (got.get("owner_names") or [None])[0],
                "total_extent": got.get("total_extent_acres"),
            }

        print(f"\n{f}")
        for field, value in checks.items():
            if field not in expected:
                continue
            score = similar(value, expected[field])
            ok = score >= (0.85 if field in ("name_english", "owner") else 1.0)
            results.setdefault(field, []).append(ok)
            print(f"  {'✓' if ok else '✗'} {field:15} expected={expected[field]!r:25} got={value!r} ({score:.2f})")

    print("\nAccuracy by field")
    for field, oks in results.items():
        print(f"  {field:15} {sum(oks)}/{len(oks)} = {100 * sum(oks) / len(oks):.0f}%")
    if not results:
        print("  no labelled samples found")


if __name__ == "__main__":
    evaluate(sys.argv[1] if len(sys.argv) > 1 else "samples")
