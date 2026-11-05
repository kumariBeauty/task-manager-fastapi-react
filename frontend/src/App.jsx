import { useEffect, useState } from 'react'
import { createTask, deleteTask, getTasks, updateTask } from './api'
import TaskForm from './components/TaskForm'
import TaskItem from './components/TaskItem'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load tasks once when the page opens
  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Each handler calls the API, then updates local state with the result
  async function handleAdd(task) {
    try {
      const created = await createTask(task)
      setTasks((prev) => [...prev, created])
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleToggle(task) {
    try {
      const updated = await updateTask(task.id, { completed: !task.completed })
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const remaining = tasks.filter((t) => !t.completed).length

  return (
    <main className="container">
      <h1>Task Manager</h1>
      <TaskForm onAdd={handleAdd} />

      {error && <p className="error">⚠ {error}. Is the backend running?</p>}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : tasks.length === 0 ? (
        <p className="muted">No tasks yet. Add one above.</p>
      ) : (
        <>
          <ul className="task-list">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </ul>
          <p className="muted">{remaining} of {tasks.length} remaining</p>
        </>
      )}
    </main>
  )
}
