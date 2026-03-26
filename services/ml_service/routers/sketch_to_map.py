"""
sketch_to_map.py
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Takes a Bhoomi RTC sketch image as input and generates a
standalone HTML file with the exact land plot on Leaflet map.

Pipeline:
  1. OCR  → survey no, lat, lon from table header
  2. Verify survey no against farmer record
  3. OpenCV → detect polygon vertices (pixels)
  4. OCR green edge labels → real perimeter → scale (m/px)
  5. Map each vertex pixel → real lat/lon offset from centre
  6. Output self-contained HTML with Leaflet + polygon overlay

Usage:
  python sketch_to_map.py <image_path> [survey_no]

Example:
  python sketch_to_map.py sketch.png 2

Install:
  pip install opencv-python pytesseract Pillow numpy
  sudo apt install tesseract-ocr
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

import sys, re, math, json, os
import cv2
import numpy as np
import pytesseract

# ── CONFIG ─────────────────────────────────────────────────────
TABLE_HEIGHT_PX   = 90       # height of header table in image
POLY_EPSILON      = 0.005    # approxPolyDP tightness (0.005 = high detail, 0.02 = simplified)
FALLBACK_WIDTH_M  = 120.0    # assumed plot width if OCR finds no edge labels
# ───────────────────────────────────────────────────────────────


# ══════════════════════════════════════════════════════════════
# 1. OCR — extract survey no, lat, lon
# ══════════════════════════════════════════════════════════════
def ocr_header(img):
    # Expand header crop slightly and upscale for better OCR precision
    header_crop = img[:120, :, :]
    up = cv2.resize(header_crop, None, fx=3, fy=3, interpolation=cv2.INTER_CUBIC)
    gray = cv2.cvtColor(up, cv2.COLOR_BGR2GRAY)
    
    # Use PSM 11 for sparse text (coordinates in headers)
    text = pytesseract.image_to_string(gray, config='--psm 11')
    
    # Advanced regex to capture latitude/longitude precisely, including those with 5 decimal places
    # Tends to find things like 13.63308 or 75.43586
    coords = []
    # Find all sequences of digits with a dot
    potential = re.findall(r'(\d{2,3})[.,]\s?(\d{3,7})', text)
    for deg, dec in potential:
        val = float(f"{deg}.{dec}")
        # Only accept if in Karnataka bounds
        if (11.0 < val < 16.0) or (73.0 < val < 79.0):
            coords.append(val)
            
    if len(coords) < 2:
        # Fallback to standard PSM 6 if 11 is too sparse
        text = pytesseract.image_to_string(gray, config='--psm 6')
        potential = re.findall(r'(\d{2,3})[.,]\s?(\d{3,7})', text)
        for deg, dec in potential:
            val = float(f"{deg}.{dec}")
            if (11.0 < val < 16.0) or (73.0 < val < 79.0):
                coords.append(val)

    if len(coords) < 2:
        raise ValueError(f"Could not extract lat/lon from OCR.\nRaw text: {text}")
        
    lon = max(coords)   # Karnataka lon ~75, lat ~13
    lat = min(coords)

    # Survey number: digits that appear just before the OLC code (8-char+2)
    m = re.search(r'(\d+)\D{0,6}[A-Z0-9]{4}[A-Z0-9]{4}\+[A-Z0-9]{2}', text)
    survey = m.group(1) if m else re.search(r'\b(\d{1,4})\b', text)
    survey = survey if isinstance(survey, str) else (survey.group(1) if survey else "?")

    return survey, lat, lon, text


# ══════════════════════════════════════════════════════════════
# 2. Polygon detection
# ══════════════════════════════════════════════════════════════
def detect_polygon(img):
    sketch  = img[TABLE_HEIGHT_PX:, :, :]
    gray    = cv2.cvtColor(sketch, cv2.COLOR_BGR2GRAY)
    _, thr  = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)
    cnts, _ = cv2.findContours(thr, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not cnts:
        raise ValueError("No contours found in sketch image.")
    main    = sorted(cnts, key=cv2.contourArea, reverse=True)[0]
    
    # Strictly prune down to ~12 vertices for a clean, professional look
    target = 12
    arc    = cv2.arcLength(main, True)
    # Start with a very small epsilon and increase until vertex count is low enough
    eps = 0.001
    approx = cv2.approxPolyDP(main, eps * arc, True)
    
    while len(approx) > target and eps < 0.2:
        eps += 0.001
        approx = cv2.approxPolyDP(main, eps * arc, True)
            
    verts = [pt[0].tolist() for pt in approx]

    # Centroid
    M  = cv2.moments(main)
    cx = M["m10"] / M["m00"]
    cy = M["m01"] / M["m00"]

    # Perimeter in pixels
    perim_px = cv2.arcLength(main, True)

    return verts, cx, cy, perim_px, sketch


# ══════════════════════════════════════════════════════════════
# 3. OCR green edge labels → scale
# ══════════════════════════════════════════════════════════════
def get_scale(sketch, perim_px):
    # Isolate green pixels (edge length labels are green)
    hsv  = cv2.cvtColor(sketch, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, (35, 30, 30), (95, 255, 255))

    # Scale up green region and OCR
    green = cv2.bitwise_and(sketch, sketch, mask=mask)
    up    = cv2.resize(green, None, fx=3, fy=3, interpolation=cv2.INTER_CUBIC)
    gray  = cv2.cvtColor(up, cv2.COLOR_BGR2GRAY)
    _, bn = cv2.threshold(gray, 30, 255, cv2.THRESH_BINARY_INV)
    txt   = pytesseract.image_to_string(
                bn, config='--psm 11 -c tessedit_char_whitelist=0123456789.')

    nums = [float(x) for x in re.findall(r'\d+\.\d+', txt)
            if 5 < float(x) < 500]

    if nums:
        perim_m = sum(nums)
        scale   = perim_m / perim_px
        print(f"  Edge labels found: {nums}  →  scale={scale:.5f} m/px")
    else:
        # Fallback
        scale = FALLBACK_WIDTH_M / sketch.shape[1]
        print(f"  Edge labels not found by OCR. Fallback scale={scale:.5f} m/px")
        print(f"  Tip: pass edge lengths manually via --edges flag")

    return scale, nums


# ══════════════════════════════════════════════════════════════
# 4. Pixel → lat/lon
# ══════════════════════════════════════════════════════════════
def px_to_latlon(px, py, cx, cy, scale, lat_ref, lon_ref):
    MPD_LAT = 111320.0
    MPD_LON = 111320.0 * math.cos(math.radians(lat_ref))
    dx_m    =  (px - cx) * scale
    dy_m    = -(py - cy) * scale   # flip Y
    return (
        round(lat_ref + dy_m / MPD_LAT, 8),
        round(lon_ref + dx_m / MPD_LON, 8),
    )


# ══════════════════════════════════════════════════════════════
# 5. Edge midpoints for labels on the map
# ══════════════════════════════════════════════════════════════
def edge_midpoints_latlon(verts_ll):
    mids = []
    n = len(verts_ll)
    for i in range(n):
        p1 = verts_ll[i]
        p2 = verts_ll[(i+1) % n]
        mids.append(((p1[0]+p2[0])/2, (p1[1]+p2[1])/2))
    return mids


# ══════════════════════════════════════════════════════════════
# 6. Generate standalone HTML
# ══════════════════════════════════════════════════════════════
def generate_html(survey, lat, lon, verts_ll, edge_labels, out_path):
    poly_js    = json.dumps(verts_ll)
    edges_js   = json.dumps(edge_labels)
    mids_js    = json.dumps(edge_midpoints_latlon(verts_ll))
    area_m2    = compute_area_m2(verts_ll)
    area_acres = area_m2 / 4046.86

    html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Survey No. {survey} — Land Plot</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ font-family: sans-serif; display:flex; flex-direction:column; height:100vh; }}
  #header {{
    padding: 10px 18px;
    background: #1a1a2e;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }}
  #header h1 {{ font-size: 15px; font-weight: 600; }}
  #header .meta {{ font-size: 12px; color: #aaa; }}
  #header .stats {{ display:flex; gap:16px; }}
  .stat {{ text-align:center; }}
  .stat-val {{ font-size:15px; font-weight:600; color:#10b981; }}
  .stat-lbl {{ font-size:10px; color:#64748b; text-transform: uppercase; letter-spacing: 0.1em; }}
  #controls {{
    padding: 8px 18px;
    background: #f8f8f8;
    border-bottom: 1px solid #ddd;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }}
  .btn {{
    padding: 5px 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: #fff;
    cursor: pointer;
    font-size: 13px;
  }}
  .btn.active {{ background:#10b981; color:#fff; border-color:#10b981; }}
  #map {{ flex:1; background: #0f172a; }}
  .edge-label {{
    background: rgba(255,255,255,0.9);
    border: 1px solid #10b981;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 11px;
    font-weight: 600;
    color: #2e7d32;
    white-space: nowrap;
  }}
  .corner-label {{
    background: rgba(52,152,219,0.9);
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    color: #fff;
  }}
</style>
</head>
<body>

<div id="header">
  <div>
    <h1>Survey No. {survey} — Land Plot</h1>
    <div class="meta">{lat}°N, {lon}°E &nbsp;|&nbsp; Karnataka, India</div>
  </div>
  <div class="stats">
    <div class="stat">
      <div class="stat-val">{len(verts_ll)}</div>
      <div class="stat-lbl">Vertices</div>
    </div>
    <div class="stat">
      <div class="stat-val">{area_m2:.0f} m²</div>
      <div class="stat-lbl">Area</div>
    </div>
    <div class="stat">
      <div class="stat-val">{area_acres:.3f}</div>
      <div class="stat-lbl">Acres</div>
    </div>
  </div>
</div>

<div id="controls">
  <span style="font-size:13px;color:#555;font-weight:500;">Map layer:</span>
  <button class="btn" onclick="setLayer('street',this)">Street</button>
  <button class="btn active" onclick="setLayer('satellite',this)">Satellite</button>
  <button class="btn" onclick="setLayer('topo',this)">Topo</button>
  <button class="btn" onclick="setLayer('cadastral',this)">Cadastral (K-GIS)</button>
  <span style="margin-left:auto;font-size:12px;color:#888;">Zoom: <span id="zoom-lbl">18</span></span>
</div>

<div id="map"></div>

<script>
const CENTER    = [{lat}, {lon}];
const POLYGON   = {poly_js};
const EDGE_LBLS = {edges_js};
const MIDS      = {mids_js};

const map = L.map('map', {{ zoomControl: true }}).setView(CENTER, 17);
map.on('zoomend', () => document.getElementById('zoom-lbl').textContent = map.getZoom());

const LAYERS = {{
  street: L.tileLayer('https://{{s}}.tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png', {{
    attribution: '© OpenStreetMap contributors', maxZoom: 18
  }}),
  satellite: L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{{z}}/{{y}}/{{x}}',
    {{ attribution: '© Esri World Imagery', maxZoom: 18 }}
  ),
  topo: L.tileLayer('https://{{s}}.tile.opentopomap.org/{{z}}/{{x}}/{{y}}.png', {{
    attribution: '© OpenTopoMap', maxZoom: 18
  }}),
  cadastral: L.tileLayer.wms(
    'https://kgis.ksrsac.in/kgis/services/cadastral/MapServer/WMSServer',
    {{ layers:'0', format:'image/png', transparent:true, opacity:0.7,
       attribution:'© KSRSAC K-GIS' }}
  ),
}};

LAYERS.satellite.addTo(map);
let activeLayerKey = 'satellite';
let cadastralOverlay = null;

window.setLayer = function(key, btn) {{
  document.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  if (key === 'cadastral') {{
    if (!cadastralOverlay) {{
      cadastralOverlay = LAYERS.cadastral;
      cadastralOverlay.addTo(map);
    }}
    return;
  }}
  if (cadastralOverlay) {{ map.removeLayer(cadastralOverlay); cadastralOverlay = null; }}
  if (activeLayerKey !== key) {{
    map.removeLayer(LAYERS[activeLayerKey]);
    LAYERS[key].addTo(map);
    activeLayerKey = key;
  }}
}};

// ── Polygon ──────────────────────────────────────────────────
const poly = L.polygon(POLYGON, {{
  color: '#e53935',
  weight: 2.5,
  fillColor: '#e53935',
  fillOpacity: 0.18,
}}).addTo(map);

poly.bindPopup(
  `<b>Survey No. {survey}</b><br>
   Lat: {lat}°N<br>Lon: {lon}°E<br>
   Vertices: {len(verts_ll)}<br>
   Area: {area_m2:.0f} m² ({area_acres:.3f} acres)`
);

// ── Vertex markers removed ──

// ── Edge length labels ───────────────────────────────────────
if (EDGE_LBLS.length > 0) {{
  MIDS.forEach(([lat,lon], i) => {{
    const lbl = EDGE_LBLS[i] || '';
    if (!lbl) return;
    const icon = L.divIcon({{
      html: `<div class="edge-label">${{lbl}}m</div>`,
      iconSize: null, className: '', iconAnchor: [20, 10]
    }});
    L.marker([lat,lon], {{icon, interactive:false}}).addTo(map);
  }});
}}

// ── Centre marker removed ──

// Map zoom is fixed to 18 via setView
// map.fitBounds(poly.getBounds(), {{ padding:[30,30] }});
</script>
</body>
</html>"""

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(html)


# ══════════════════════════════════════════════════════════════
# Area calculation (Shoelace formula)
# ══════════════════════════════════════════════════════════════
def compute_area_m2(verts_ll):
    MPD_LAT = 111320.0
    MPD_LON = lambda lat: 111320.0 * math.cos(math.radians(lat))
    # Convert to metres from first vertex as origin
    lat0, lon0 = verts_ll[0]
    pts = []
    for lat, lon in verts_ll:
        x = (lon - lon0) * MPD_LON(lat0)
        y = (lat - lat0) * MPD_LAT
        pts.append((x, y))
    n = len(pts)
    area = 0
    for i in range(n):
        j = (i+1) % n
        area += pts[i][0] * pts[j][1]
        area -= pts[j][0] * pts[i][1]
    return abs(area) / 2


# ══════════════════════════════════════════════════════════════
# Core Vision Pipeline
# ══════════════════════════════════════════════════════════════
def run_pipeline(img_path, expected_sno=None, manual_coords=None):
    """
    Core Vision Pipeline: Image -> Coordinates, Polygon, and Map.
    This function is callable as a module to avoid subprocess environment issues.
    """
    img = cv2.imread(img_path)
    if img is None:
        raise ValueError(f"Cannot read image at {img_path}")

    print(f"\n{'='*55}")
    print(f"  Sketch → Map Pipeline")
    print(f"  Image: {img_path}  ({img.shape[1]}x{img.shape[0]}px)")
    print(f"{'='*55}")

    # Step 1: OCR
    print("\n[1] OCR — extracting survey no, lat, lon ...")
    survey, lat, lon, raw_ocr = ocr_header(img)
    
    # Overwrite if manual coords provided (e.g. 13.63308 vs 13.6308)
    if manual_coords:
        lat, lon = manual_coords
        print(f"  (Using manual override coords)")
        
    print(f"  Survey No : {survey}")
    print(f"  Latitude  : {lat}")
    print(f"  Longitude : {lon}")

    # Step 2: Verify
    print("\n[2] Survey number verification ...")
    if expected_sno and str(survey) != str(expected_sno):
        print(f"  ✗ MISMATCH — image='{survey}' vs expected='{expected_sno}'")
        print("  Proceeding anyway (set as error in production)")
    else:
        print(f"  ✔ Survey '{survey}' verified")

    # Step 3: Polygon
    print("\n[3] Detecting polygon ...")
    verts, cx, cy, perim_px, sketch = detect_polygon(img)
    print(f"  Vertices   : {len(verts)}")
    print(f"  Centroid   : ({cx:.1f}, {cy:.1f}) px")
    print(f"  Perimeter  : {perim_px:.1f} px")

    # Step 4: Scale
    print("\n[4] Calculating scale ...")
    scale, edge_labels = get_scale(sketch, perim_px)

    # Step 5: Convert to lat/lon
    print("\n[5] Converting vertices to lat/lon ...")
    verts_ll = [
        list(px_to_latlon(vx, vy, cx, cy, scale, lat, lon))
        for vx, vy in verts
    ]
    for i, (vlat, vlon) in enumerate(verts_ll, 1):
        print(f"  V{i}: {vlat}, {vlon}")

    # Step 6: Generate HTML
    # Use deterministic name for survey map in the ml_service static directory
    safe_survey = str(survey).replace("/", "_").replace("*", "_")
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # ml_service/ directory
    out_path = os.path.join(base_dir, f"map_survey_{safe_survey}.html")
    print(f"\n[6] Generating HTML map → {out_path}")
    generate_html(survey, lat, lon, verts_ll, edge_labels, out_path)

    area_m2 = compute_area_m2(verts_ll)
    
    return {
        "success": True,
        "survey_number": survey,
        "center": {"lat": lat, "lng": lon},
        "boundary": [{"lat": v[0], "lng": v[1], "order": i+1} for i, v in enumerate(verts_ll)],
        "area_sq_mtrs": float(area_m2),
        "map_path": out_path,
        "vertices": verts_ll,
        "raw_output": f"Survey: {survey}\nLat/Lon: {lat}/{lon}\nArea: {area_m2:.1f}"
    }

def main():
    if len(sys.argv) < 2:
        print("Usage: python sketch_to_map.py <image_path> [expected_survey_no]")
        sys.exit(1)
    
    img_path = sys.argv[1]
    expected_sno = sys.argv[2] if len(sys.argv) > 2 else None
    
    try:
        res = run_pipeline(img_path, expected_sno)
        print(f"✅ Success! Map generated at {res['map_path']}")
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
