def get_traffic_level(hour: int, is_weekend: int) -> int:
    if is_weekend:
        return 1 if hour < 10 or hour > 20 else 2
    if 7 <= hour <= 10 or 17 <= hour <= 21:
        return 3
    elif 10 < hour < 17:
        return 2
    else:
        return 1


def is_rush_hour(hour: int) -> int:
    return 1 if (7 <= hour <= 10 or 17 <= hour <= 21) else 0
