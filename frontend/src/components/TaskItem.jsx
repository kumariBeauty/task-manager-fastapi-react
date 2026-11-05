import { useState } from 'react'

// One row in the task list: checkbox to complete, edit title/description, delete.
export default function TaskItem({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? '')

  function startEdit() {
    // Start from the latest saved values
    setTitle(task.title)
    setDescription(task.description ?? '')
    setEditing(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!title.trim()) return
    const saved = await onUpdate(task.id, {
      title: title.trim(),
      description: description.trim() || null,
    })
    if (saved) setEditing(false) // stay in edit mode if the request failed
  }

  if (editing) {
    return (
      <li className="task">
        <form className="edit-form" onSubmit={handleSave}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            maxLength={200}
            autoFocus
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            maxLength={1000}
          />
          <div className="edit-actions">
            <button type="submit" className="save" disabled={!title.trim()}>Save</button>
            <button type="button" className="cancel" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className={task.completed ? 'task done' : 'task'}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onUpdate(task.id, { completed: !task.completed })}
      />
      <div className="task-text">
        <span className="task-title">{task.title}</span>
        {task.description && <span className="task-desc">{task.description}</span>}
      </div>
      <button className="icon-btn" onClick={startEdit} aria-label="Edit task">
        ✎
      </button>
      <button className="icon-btn delete" onClick={() => onDelete(task.id)} aria-label="Delete task">
        ✕
      </button>
    </li>
  )
}
