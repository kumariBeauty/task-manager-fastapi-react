"""API tests. They use a separate in-memory SQLite DB, so your real data is untouched."""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

test_engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSession = sessionmaker(bind=test_engine)


def override_get_db():
    db = TestingSession()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture
def client():
    Base.metadata.create_all(bind=test_engine)
    with TestClient(app) as c:
        yield c
    Base.metadata.drop_all(bind=test_engine)


def test_health(client):
    assert client.get("/health").json() == {"status": "ok"}


def test_create_and_list(client):
    res = client.post("/tasks", json={"title": "Learn FastAPI"})
    assert res.status_code == 201
    assert res.json()["completed"] is False

    tasks = client.get("/tasks").json()
    assert [t["title"] for t in tasks] == ["Learn FastAPI"]


def test_update(client):
    task_id = client.post("/tasks", json={"title": "Write tests"}).json()["id"]
    res = client.put(f"/tasks/{task_id}", json={"completed": True})
    assert res.status_code == 200
    assert res.json()["completed"] is True
    assert res.json()["title"] == "Write tests"


def test_delete(client):
    task_id = client.post("/tasks", json={"title": "Temp"}).json()["id"]
    assert client.delete(f"/tasks/{task_id}").status_code == 204
    assert client.get(f"/tasks/{task_id}").status_code == 404


def test_validation(client):
    assert client.post("/tasks", json={"title": ""}).status_code == 422
