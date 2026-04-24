const API_BASE = "/api";

export const apiClient = {
  async getTodos(filter = {}) {
    const params = new URLSearchParams();
    if (filter.completed !== undefined) {
      params.append("completed", filter.completed);
    }
    if (filter.page) params.append("page", filter.page);
    if (filter.limit) params.append("limit", filter.limit);

    const response = await fetch(`${API_BASE}/todos?${params}`);
    if (!response.ok) throw new Error("Failed to fetch todos");
    return response.json();
  },

  async createTodo(title) {
    const response = await fetch(`${API_BASE}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to create todo");
    }
    return response.json();
  },

  async updateTodo(id, updates) {
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to update todo");
    }
    return response.json();
  },

  async toggleTodo(id) {
    const response = await fetch(`${API_BASE}/todos/${id}/toggle`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to toggle todo");
    }
    return response.json();
  },

  async deleteTodo(id) {
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to delete todo");
    }
    return response.status === 204 ? null : response.json();
  },
};
