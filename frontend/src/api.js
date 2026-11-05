// All calls to the FastAPI backend live here, so components stay simple.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`)
  }
  // DELETE returns 204 No Content, so there is no JSON to read
  return res.status === 204 ? null : res.json()
}

export const getTasks = () => request('/tasks')

export const createTask = (task) =>
  request('/tasks', { method: 'POST', body: JSON.stringify(task) })

export const updateTask = (id, changes) =>
  request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(changes) })

export const deleteTask = (id) => request(`/tasks/${id}`, { method: 'DELETE' })
