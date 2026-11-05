# Task Manager API (FastAPI)

## Run locally

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # optional; without DATABASE_URL it uses SQLite (tasks.db)
uvicorn app.main:app --reload
```

- API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs

## Run tests

```bash
pytest
```

## Endpoints

| Method | Path          | What it does        |
|--------|---------------|---------------------|
| GET    | /health       | Health check        |
| GET    | /tasks        | List all tasks      |
| POST   | /tasks        | Create a task       |
| GET    | /tasks/{id}   | Get one task        |
| PUT    | /tasks/{id}   | Update a task       |
| DELETE | /tasks/{id}   | Delete a task       |

## Deploy (Render + Neon)

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Env vars: `DATABASE_URL` (Neon connection string), `CORS_ORIGINS` (your Vercel URL)
