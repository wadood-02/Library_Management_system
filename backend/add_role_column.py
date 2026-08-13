from sqlalchemy import text
from database import engine

with engine.connect() as connection:
    connection.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user'"))
    connection.commit()

print("Done. 'role' column added to users table (or already existed).")