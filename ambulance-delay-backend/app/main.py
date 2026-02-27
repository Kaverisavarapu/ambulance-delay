
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import DelayRequest, DelayResponse
from app.predictor import predict_delay
from app.geo import is_within_bengaluru
from app.recommender import recommend_hospital
from app.models import PredictionRequest
from app.schemas import RecommendRequest, RecommendResponse
from fastapi import Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import Hospital

app = FastAPI(title="Ambulance Delay Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://medroute-beryl.vercel.app",
        "https://ambulance-delay-frontend.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "API is running"}


@app.post("/predict-delay", response_model=DelayResponse)
def predict(request: DelayRequest):
    delay = predict_delay(
        distance_km=request.distance_km,
        hour=request.hour,
        is_weekend=request.is_weekend
    )
    return {"predicted_delay": delay}

@app.post("/recommend-hospital", response_model=RecommendResponse)
def recommend(req: RecommendRequest, db: Session = Depends(get_db)):

    if not is_within_bengaluru(req.lat, req.lon):
        return {
            "hospital_name": "N/A",
            "eta_minutes": -1,
            "predicted_delay": -1,
            "distance_km": -1,
            "traffic_level": -1
        }

    best, _ = recommend_hospital(
        db,                 # 👈 IMPORTANT: pass db
        req.lat,
        req.lon,
        req.hour,
        req.is_weekend
    )

    # Determine rush hour
    rush_hour = 1 if (7 <= req.hour <= 10 or 17 <= req.hour <= 21) else 0

    # 🔥 Save request into database
    log = PredictionRequest(
        source_lat=req.lat,
        source_lon=req.lon,
        hour=req.hour,
        is_weekend=req.is_weekend,
        traffic_level=best["traffic_level"],
        rush_hour=rush_hour,
        recommended_hospital_id=best["db_id"],
        distance_km=best["distance_km"],
        ideal_time_minutes=best["ideal_time_minutes"],
        predicted_delay_minutes=best["predicted_delay"],
        eta_minutes=best["eta_minutes"]
    )

    db.add(log)
    db.commit()

    return {
        "hospital_name": best["hospital_name"],
        "eta_minutes": best["eta_minutes"],
        "predicted_delay": best["predicted_delay"],
        "distance_km": best["distance_km"],
        "traffic_level": best["traffic_level"]
    }


@app.get("/hospitals")
def get_hospitals(db: Session = Depends(get_db)):
    hospitals = (
        db.query(Hospital)
        .filter(Hospital.emergency_available == True)
        .all()
    )

    return [
        {
            "hospital_id": h.hospital_id,
            "name": h.name,
            "lat": h.lat,
            "lon": h.lon
        }
        for h in hospitals
    ]