import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from forecasting import forecast_prices


def test_deterministic():
    s = [2000, 2050, 2100, 2080, 2150, 2200, 2180, 2250]
    assert forecast_prices(s) == forecast_prices(s)


def test_damped_trend_does_not_explode():
    # A 30% run-up used to compound into a ~5x forecast; damping must keep it sane
    s = [1000, 1050, 1100, 1150, 1200, 1250, 1300]
    f = forecast_prices(s, horizon=6)
    assert f[-1]["predictedPrice"] < 1300 * 1.5
    assert all(p["minPrice"] <= p["predictedPrice"] <= p["maxPrice"] for p in f)


def test_flat_series_stays_flat():
    f = forecast_prices([1500] * 10, horizon=4)
    assert all(abs(p["predictedPrice"] - 1500) <= 1 for p in f)


def test_short_and_empty_series():
    assert forecast_prices([]) == []
    assert len(forecast_prices([1200], horizon=3)) == 3


if __name__ == "__main__":
    for name, fn in list(globals().items()):
        if name.startswith("test_"):
            fn()
            print("ok", name)
