// One row in the task list: checkbox to complete, button to delete.
export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={task.completed ? 'task done' : 'task'}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
      />
      <div className="task-text">
        <span className="task-title">{task.title}</span>
        {task.description && <span className="task-desc">{task.description}</span>}
      </div>
      <button className="delete" onClick={() => onDelete(task.id)} aria-label="Delete task">
        ✕
      </button>
    </li>
  )
}
