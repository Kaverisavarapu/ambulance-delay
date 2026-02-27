from pydantic import BaseModel

class DelayRequest(BaseModel):
    distance_km: float
    hour: int
    is_weekend: int

class DelayResponse(BaseModel):
    predicted_delay: float
    
class RecommendRequest(BaseModel):
    lat: float
    lon: float
    hour: int
    is_weekend: int

class RecommendResponse(BaseModel):
    hospital_name: str
    eta_minutes: float
    predicted_delay: float
    distance_km: float
    traffic_level: int

