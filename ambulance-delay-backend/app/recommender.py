from sqlalchemy.orm import Session
from app.models import Hospital
from app.distance import haversine_km
from app.eta import ideal_time_minutes
from app.predictor import predict_delay

def recommend_hospital(db: Session, lat, lon, hour, is_weekend):
    hospitals = db.query(Hospital).filter(Hospital.emergency_available == True).all()

    results = []

    for h in hospitals:
        distance = haversine_km(lat, lon, h.lat, h.lon)

        ideal_time = ideal_time_minutes(distance)
        delay, traffic_level = predict_delay(distance, hour, is_weekend)

        eta = ideal_time + delay

        results.append({
            "db_id": h.id,   # ✅ NEW (db primary key)
            "hospital_id": h.hospital_id,
            "hospital_name": h.name,
            "distance_km": round(distance, 2),
            "ideal_time_minutes": round(ideal_time, 2),
            "eta_minutes": round(eta, 2),
            "predicted_delay": round(delay, 2),
            "traffic_level": traffic_level
        })

    results.sort(key=lambda x: x["eta_minutes"])
    return results[0], results