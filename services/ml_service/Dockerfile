# ── Stage 1: Build ────────────────────────────────────────────
FROM python:3.12-slim AS build

# Install system deps: Chrome + Tesseract with Kannada, PDF tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    # Poppler for pdf2image (NOT pdftotext — BUG-018 fix)
    poppler-utils \
    # Tesseract with Kannada language data
    tesseract-ocr \
    tesseract-ocr-kan \
    tesseract-ocr-eng \
    # Chrome for Selenium
    chromium \
    chromium-driver \
    # Build tools
    gcc g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── Stage 2: Production ────────────────────────────────────────
FROM python:3.12-slim AS production

RUN apt-get update && apt-get install -y --no-install-recommends \
    poppler-utils \
    tesseract-ocr \
    tesseract-ocr-kan \
    tesseract-ocr-eng \
    chromium \
    chromium-driver \
    && rm -rf /var/lib/apt/lists/*

# Set Chrome binary path for Selenium
ENV CHROME_BIN=/usr/bin/chromium
ENV CHROMEDRIVER_PATH=/usr/bin/chromedriver

WORKDIR /app

COPY --from=build /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=build /usr/local/bin /usr/local/bin
COPY . .

# Create non-root user
RUN useradd -m agrilink && chown -R agrilink:agrilink /app
USER agrilink

EXPOSE 4006
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:4006/health')"

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "4006", "--workers", "2"]
