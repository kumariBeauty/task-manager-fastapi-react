"""App entry point. Run locally with:  uvicorn app.main:app --reload"""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import tasks


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables if they don't exist. (Later you can switch to Alembic migrations.)
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Task Manager API", lifespan=lifespan)

# Allow the React frontend (a different origin) to call this API.
origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router)


@app.get("/health")
def health():
    """Simple endpoint to check the server is up (useful after deploying)."""
    return {"status": "ok"}
