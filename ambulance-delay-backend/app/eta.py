def ideal_time_minutes(distance_km: float) -> float:
    avg_speed_kmph = 50
    return (distance_km / avg_speed_kmph) * 60
