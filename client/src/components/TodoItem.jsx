import React, { useState } from 'react';

export function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleSave = () => {
    if (editTitle.trim() && editTitle !== todo.title) {
      onUpdate(todo.id, { title: editTitle.trim() });
    } else {
      setEditTitle(todo.title);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
      todo.completed
        ? 'bg-gray-50 border-gray-200'
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-5 h-5 text-blue-600 rounded cursor-pointer accent-blue-600"
      />

      {/* Title or Edit Input */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
        ) : (
          <span
            className={`text-sm block break-words ${
              todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}
          >
            {todo.title}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1 flex-shrink-0">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="btn-icon text-green-600 hover:bg-green-50 hover:text-green-700"
              title="Save"
            >
              ✓
            </button>
            <button
              onClick={handleCancel}
              className="btn-icon text-gray-600 hover:bg-gray-100"
              title="Cancel"
            >
              ✕
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="btn-icon text-gray-600"
              title="Edit"
            >
              ✎
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="btn-danger"
              title="Delete"
            >
              🗑
            </button>
          </>
        )}
      </div>
    </div>
  );
}
