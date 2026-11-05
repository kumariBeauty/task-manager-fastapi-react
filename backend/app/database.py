"""Database connection setup.

The connection string comes from the DATABASE_URL environment variable, so the
same code works locally (SQLite / Docker Postgres) and in production (Neon).
"""
import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tasks.db")

# Some providers hand out "postgres://", which SQLAlchemy no longer accepts.
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SQLite needs this flag because FastAPI may use the connection across threads.
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_db():
    """FastAPI dependency: open a session per request and always close it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
