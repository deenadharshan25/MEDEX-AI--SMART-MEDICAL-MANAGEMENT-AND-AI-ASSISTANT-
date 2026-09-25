from app.utils.database import SessionLocal, create_tables
from app.models.models import User
from app.utils.auth import hash_password

def seed_db():
    db = SessionLocal()
    # Create tables if not exist
    create_tables()

    demo_users = [
        {"email": "admin", "password": "admin123", "name": "Admin", "role": "admin"},
        {"email": "drkumar", "password": "password123", "name": "Dr. Raj Kumar", "role": "doctor"},
        {"email": "johndoe", "password": "password123", "name": "John Doe", "role": "patient"},
        {"email": "patient@mediai.com", "password": "password123", "name": "John Doe", "role": "patient"},
        {"email": "doctor@hospital.com", "password": "password123", "name": "Dr. Smith", "role": "doctor"},
    ]

    for user_data in demo_users:
        existing = db.query(User).filter(User.email == user_data["email"]).first()
        if not existing:
            hashed = hash_password(user_data["password"])
            name_parts = user_data["name"].split(" ", 1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ""
            user = User(email=user_data["email"], hashed_password=hashed, first_name=first_name, last_name=last_name, role=user_data["role"])
            db.add(user)
    
    db.commit()
    db.close()
    print("Demo users seeded successfully.")

if __name__ == "__main__":
    seed_db()
