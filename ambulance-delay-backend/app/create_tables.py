from app.db import engine
from app.models import Base

print("✅ Starting table creation...")

Base.metadata.create_all(bind=engine)

print("✅ Done! Tables created (if they didn't already exist).")