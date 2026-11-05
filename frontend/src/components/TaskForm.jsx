import { useState } from 'react'

// Form to add a new task. Calls onAdd({ title, description }) on submit.
export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  async function handleSubmit(e) {
    e.preventDefault() // stop the browser from reloading the page
    if (!title.trim()) return
    await onAdd({ title: title.trim(), description: description.trim() || null })
    setTitle('')
    setDescription('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        maxLength={200}
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        maxLength={1000}
      />
      <button type="submit" disabled={!title.trim()}>Add</button>
    </form>
  )
}
