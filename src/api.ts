import { Todo, CreateTodoInput, UpdateTodoInput, TodoFilter, TodoStats } from './types';

export const ApiClient = {
  async getTodos(filter?: TodoFilter): Promise<Todo[]> {
    const params = new URLSearchParams();
    if (filter) {
      if (filter.search) params.append('search', filter.search);
      if (filter.status) params.append('status', filter.status);
      if (filter.category) params.append('category', filter.category);
      if (filter.priority) params.append('priority', filter.priority);
      if (filter.sortBy) params.append('sortBy', filter.sortBy);
      if (filter.sortOrder) params.append('sortOrder', filter.sortOrder);
    }

    const url = `/api/todos?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch todos: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data;
  },

  async getStats(): Promise<TodoStats> {
    const res = await fetch('/api/stats');
    if (!res.ok) {
      throw new Error(`Failed to fetch stats: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data;
  },

  async createTodo(input: CreateTodoInput): Promise<Todo> {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || 'Failed to create todo');
    }
    const json = await res.json();
    return json.data;
  },

  async updateTodo(id: string, updates: UpdateTodoInput): Promise<Todo> {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || 'Failed to update todo');
    }
    const json = await res.json();
    return json.data;
  },

  async toggleTodo(id: string): Promise<Todo> {
    const res = await fetch(`/api/todos/${id}/toggle`, {
      method: 'PATCH',
    });
    if (!res.ok) {
      throw new Error('Failed to toggle todo');
    }
    const json = await res.json();
    return json.data;
  },

  async deleteTodo(id: string): Promise<void> {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Failed to delete todo');
    }
  },

  async clearCompleted(): Promise<number> {
    const res = await fetch('/api/todos/completed/clear', {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Failed to clear completed todos');
    }
    const json = await res.json();
    return json.count;
  },

  async getOpenApiSpec(): Promise<any> {
    const res = await fetch('/api/openapi.json');
    if (!res.ok) {
      throw new Error('Failed to fetch OpenAPI spec');
    }
    return res.json();
  }
};
