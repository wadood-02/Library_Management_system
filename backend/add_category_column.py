from sqlalchemy import text
from database import engine

with engine.connect() as connection:
    connection.execute(text("ALTER TABLE books ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id)"))
    connection.commit()

print("Done. 'category_id' column added to books table (or already existed).")