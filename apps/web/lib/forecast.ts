/**
 * Crop price forecasting — damped Holt linear trend (double exponential smoothing).
 *
 * Why this instead of the old in-browser "LSTM": that model used random,
 * untrained weights plus Math.random() noise, so the same input produced a
 * different answer on every click. This is deterministic, explainable, cheap
 * enough to run in the browser, and gives an honest uncertainty band.
 *
 * Mirrors services/ml_service/forecasting.py — keep them in sync.
 */

export interface ForecastPoint {
  step: number;
  predictedPrice: number;
  minPrice: number;
  maxPrice: number;
}

const ALPHAS = [0.2, 0.35, 0.5, 0.65, 0.8];
const BETAS = [0.05, 0.1, 0.2, 0.3];
const PHI = 0.9;      // trend damping: long horizons flatten instead of exploding
const Z80 = 1.2816;   // 80% prediction interval

function fit(series: number[], alpha: number, beta: number) {
  let level = series[0];
  let trend = series.length > 1 ? series[1] - series[0] : 0;
  let sse = 0;
  const residuals: number[] = [];
  for (let t = 1; t < series.length; t++) {
    const predicted = level + PHI * trend;
    const err = series[t] - predicted;
    residuals.push(err);
    sse += err * err;
    const prevLevel = level;
    level = alpha * series[t] + (1 - alpha) * (level + PHI * trend);
    trend = beta * (level - prevLevel) + (1 - beta) * PHI * trend;
  }
  return { level, trend, sse, residuals };
}

/**
 * @param chronological prices oldest → newest (must be > 0)
 * @param horizon       number of future periods
 */
export function forecastPrices(chronological: number[], horizon = 4): ForecastPoint[] {
  const series = chronological.filter((p) => Number.isFinite(p) && p > 0);
  if (series.length === 0) return [];

  if (series.length < 3) {
    const last = series[series.length - 1];
    return Array.from({ length: horizon }, (_, i) => ({
      step: i + 1,
      predictedPrice: Math.round(last),
      minPrice: Math.round(last * 0.9),
      maxPrice: Math.round(last * 1.1),
    }));
  }

  // Small grid search for the smoothing parameters with the lowest one-step error
  let best = fit(series, ALPHAS[0], BETAS[0]);
  for (const a of ALPHAS) for (const b of BETAS) {
    const candidate = fit(series, a, b);
    if (candidate.sse < best.sse) best = candidate;
  }

  const n = best.residuals.length;
  const sigma = Math.sqrt(best.residuals.reduce((s, r) => s + r * r, 0) / Math.max(n - 1, 1));

  const out: ForecastPoint[] = [];
  let dampedSum = 0;
  for (let h = 1; h <= horizon; h++) {
    dampedSum += Math.pow(PHI, h);
    const point = Math.max(0, best.level + dampedSum * best.trend);
    const band = Z80 * sigma * Math.sqrt(h);
    out.push({
      step: h,
      predictedPrice: Math.round(point),
      minPrice: Math.round(Math.max(0, point - band)),
      maxPrice: Math.round(point + band),
    });
  }
  return out;
}
