"""
Crop price forecasting — damped Holt linear trend (double exponential smoothing).

Deterministic and explainable; replaces the old "compound the historical
trend every month + random noise" logic that could blow a 30% swing into a
5x forecast. Mirrors apps/web/lib/forecast.ts — keep them in sync.
"""
from __future__ import annotations

import math
from typing import Iterable

ALPHAS = (0.2, 0.35, 0.5, 0.65, 0.8)
BETAS = (0.05, 0.1, 0.2, 0.3)
PHI = 0.9        # trend damping
Z80 = 1.2816     # 80% prediction interval


def _fit(series: list[float], alpha: float, beta: float):
    level = series[0]
    trend = series[1] - series[0] if len(series) > 1 else 0.0
    sse = 0.0
    residuals: list[float] = []
    for y in series[1:]:
        predicted = level + PHI * trend
        err = y - predicted
        residuals.append(err)
        sse += err * err
        prev_level = level
        level = alpha * y + (1 - alpha) * (level + PHI * trend)
        trend = beta * (level - prev_level) + (1 - beta) * PHI * trend
    return level, trend, sse, residuals


def forecast_prices(chronological: Iterable[float], horizon: int = 4) -> list[dict]:
    """chronological: prices oldest -> newest. Returns horizon points with 80% bands."""
    series = [float(p) for p in chronological if p is not None and math.isfinite(float(p)) and float(p) > 0]
    if not series:
        return []
    if len(series) < 3:
        last = series[-1]
        return [
            {"step": h, "predictedPrice": round(last), "minPrice": round(last * 0.9), "maxPrice": round(last * 1.1)}
            for h in range(1, horizon + 1)
        ]

    best = min((_fit(series, a, b) for a in ALPHAS for b in BETAS), key=lambda f: f[2])
    level, trend, _, residuals = best
    n = len(residuals)
    sigma = math.sqrt(sum(r * r for r in residuals) / max(n - 1, 1))

    out = []
    damped_sum = 0.0
    for h in range(1, horizon + 1):
        damped_sum += PHI ** h
        point = max(0.0, level + damped_sum * trend)
        band = Z80 * sigma * math.sqrt(h)
        out.append({
            "step": h,
            "predictedPrice": round(point),
            "minPrice": round(max(0.0, point - band)),
            "maxPrice": round(point + band),
        })
    return out
