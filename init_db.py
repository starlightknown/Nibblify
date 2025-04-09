from app.db.init_db import init_db
from app.db.session import SessionLocal

def init() -> None:
    db = SessionLocal()
    init_db(db)

def main() -> None:
    print("Creating initial data")
    init()
    print("Initial data created")

if __name__ == "__main__":
    main() 