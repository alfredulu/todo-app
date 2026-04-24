import React, { useState, useEffect } from "react";
import { apiClient } from "./api";
import { Toast } from "./components/Toast";
import { TodoItem } from "./components/TodoItem";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'completed'
  const [toast, setToast] = useState(null);

  // Load todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const filterQuery =
        filter === "all" ? {} : { completed: filter === "completed" };
      const response = await apiClient.getTodos(filterQuery);
      if (response.success) {
        setTodos(response.data.todos);
      } else {
        throw new Error(response.error?.message || "Failed to fetch todos");
      }
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      const response = await apiClient.createTodo(newTodoTitle);
      if (response.success) {
        setTodos([response.data, ...todos]);
        setNewTodoTitle("");
        showToast("Task added", "success");
      } else {
        throw new Error(response.error?.message || "Failed to create todo");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const response = await apiClient.toggleTodo(id);
      if (response.success) {
        setTodos(todos.map((t) => (t.id === id ? response.data : t)));
      } else {
        throw new Error(response.error?.message || "Failed to toggle todo");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleUpdateTodo = async (id, updates) => {
    try {
      const response = await apiClient.updateTodo(id, updates);
      if (response.success) {
        setTodos(todos.map((t) => (t.id === id ? response.data : t)));
        showToast("Task updated", "success");
      } else {
        throw new Error(response.error?.message || "Failed to update todo");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await apiClient.deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
      showToast("Task deleted", "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;
  const displayedTodos =
    filter === "all"
      ? todos
      : filter === "active"
      ? todos.filter((t) => !t.completed)
      : todos.filter((t) => t.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo</h1>
          <p className="text-gray-600">Stay organized and track your tasks</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Add Todo Form */}
          <form
            onSubmit={handleAddTodo}
            className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!newTodoTitle.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </form>

          {/* Filter Tabs */}
          <div className="px-6 pt-4 flex gap-2 border-b border-gray-200">
            {[
              { key: "all", label: "All", count: todos.length },
              { key: "active", label: "Active", count: activeCount },
              { key: "completed", label: "Completed", count: completedCount },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors border-b-2 ${
                  filter === tab.key
                    ? "text-blue-600 border-blue-600 bg-blue-50"
                    : "text-gray-600 border-transparent hover:text-gray-900"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Todo List */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin">⏳</div>
                <p className="text-gray-600 mt-2">Loading tasks...</p>
              </div>
            ) : displayedTodos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-gray-600">
                  {filter === "all"
                    ? "No tasks yet. Add one to get started!"
                    : filter === "active"
                    ? "All done! No active tasks."
                    : "No completed tasks yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {displayedTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                    onUpdate={handleUpdateTodo}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>© 2026 Alfred Ulu. All rights reserved.</p>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
