from database import Base, engine
import models

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Done. Table 'books' should now exist in your database.")