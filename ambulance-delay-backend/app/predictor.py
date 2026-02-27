import pandas as pd
from app.model_loader import model
from app.traffic import get_traffic_level, is_rush_hour


FEATURES = [
    "distance_km",
    "hour",
    "is_weekend",
    "traffic_level",
    "rush_hour"
]


def predict_delay(distance_km: float, hour: int, is_weekend: int):
    traffic_level = get_traffic_level(hour, is_weekend)
    rush_hour = is_rush_hour(hour)

    X = pd.DataFrame([{
        "distance_km": distance_km,
        "hour": hour,
        "is_weekend": is_weekend,
        "traffic_level": traffic_level,
        "rush_hour": rush_hour
    }])

    delay = float(model.predict(X)[0])
    return delay, traffic_level

