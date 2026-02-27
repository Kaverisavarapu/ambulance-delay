from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, Integer, Float, Boolean, DateTime, ForeignKey, func

class Base(DeclarativeBase):
    pass

class Hospital(Base):
    __tablename__ = "hospitals"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    hospital_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    lat: Mapped[float] = mapped_column(Float)
    lon: Mapped[float] = mapped_column(Float)
    emergency_available: Mapped[bool] = mapped_column(Boolean, default=True)

    created_at: Mapped["DateTime"] = mapped_column(DateTime(timezone=True), server_default=func.now())

class PredictionRequest(Base):
    __tablename__ = "prediction_requests"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    source_lat: Mapped[float] = mapped_column(Float)
    source_lon: Mapped[float] = mapped_column(Float)
    hour: Mapped[int] = mapped_column(Integer)
    is_weekend: Mapped[int] = mapped_column(Integer)

    traffic_level: Mapped[int] = mapped_column(Integer)
    rush_hour: Mapped[int] = mapped_column(Integer)

    recommended_hospital_id: Mapped[int] = mapped_column(ForeignKey("hospitals.id"))

    distance_km: Mapped[float] = mapped_column(Float)
    ideal_time_minutes: Mapped[float] = mapped_column(Float)
    predicted_delay_minutes: Mapped[float] = mapped_column(Float)
    eta_minutes: Mapped[float] = mapped_column(Float)

    created_at: Mapped["DateTime"] = mapped_column(DateTime(timezone=True), server_default=func.now())