import os
import pandas as pd
from sqlalchemy.orm import Session

from app.db import engine
from app.models import Hospital

# Path to CSV file
DATA_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "data",
    "hospitals_clean.csv"
)

def main():
    print("📂 Loading CSV file...")

    df = pd.read_csv(DATA_PATH, sep="\t")
    df.columns = df.columns.str.strip().str.lower()

    # Keep only emergency hospitals
    df = df[df["emergency_available"] == 1]

    print(f"Found {len(df)} emergency hospitals")

    with Session(engine) as session:

        for _, row in df.iterrows():

            # Check if hospital already exists
            exists = session.query(Hospital).filter(
                Hospital.hospital_id == str(row["hospital_id"])
            ).first()

            if exists:
                continue

            hospital = Hospital(
                hospital_id=str(row["hospital_id"]),
                name=row["name"],
                lat=float(row["lat"]),
                lon=float(row["lon"]),
                emergency_available=True
            )

            session.add(hospital)

        session.commit()

    print("✅ Hospitals inserted into database!")

if __name__ == "__main__":
    main()