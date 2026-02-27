print("STARTING DB TEST")

from sqlalchemy import text
from app.db import engine

print("ENGINE LOADED")

with engine.connect() as conn:
    print("CONNECTED")
    result = conn.execute(text("select 1")).scalar()
    print("DB connected:", result)

print("DONE")
