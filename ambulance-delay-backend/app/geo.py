def is_within_bengaluru(lat: float, lon: float) -> bool:
    return (
        12.7 <= lat <= 13.2 and
        77.3 <= lon <= 77.9
    )
