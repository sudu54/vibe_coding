import fs from 'fs';
import path from 'path';
import { Todo, CreateTodoInput, UpdateTodoInput, TodoFilter, TodoStats } from '../src/types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'todos.json');

// Ensure data directory and db file exist
function initDb(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialSeed: Todo[] = [
      {
        id: 'todo-1',
        title: 'Review project architecture & design system',
        description: 'Verify component structure, spacing, typography, and responsive layout',
        completed: false,
        priority: 'high',
        category: 'Work',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'todo-2',
        title: 'Set up REST API endpoints & route handlers',
        description: 'Implement CRUD operations for GET, POST, PUT, PATCH, and DELETE',
        completed: true,
        priority: 'high',
        category: 'Projects',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'todo-3',
        title: 'Buy groceries for weekly meal prep',
        description: 'Fresh vegetables, fruits, almond milk, and whole grains',
        completed: false,
        priority: 'medium',
        category: 'Shopping',
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: 'todo-4',
        title: 'Morning 30-minute cardio & stretching',
        description: 'Stay active and energized throughout the day',
        completed: true,
        priority: 'low',
        category: 'Health',
        createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
      }
    ];

    fs.writeFileSync(DB_FILE, JSON.stringify(initialSeed, null, 2), 'utf-8');
  }
}

function readTodos(): Todo[] {
  initDb();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading todos database file:', err);
    return [];
  }
}

function writeTodos(todos: Todo[]): void {
  initDb();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(todos, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to todos database file:', err);
  }
}

export const Database = {
  getTodos(filter?: TodoFilter): Todo[] {
    let todos = readTodos();

    if (!filter) return todos;

    // Filter by search string
    if (filter.search && filter.search.trim() !== '') {
      const q = filter.search.toLowerCase().trim();
      todos = todos.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Filter by completion status
    if (filter.status && filter.status !== 'all') {
      const isCompleted = filter.status === 'completed';
      todos = todos.filter(t => t.completed === isCompleted);
    }

    // Filter by category
    if (filter.category && filter.category !== 'all') {
      todos = todos.filter(t => t.category === filter.category);
    }

    // Filter by priority
    if (filter.priority && filter.priority !== 'all') {
      todos = todos.filter(t => t.priority === filter.priority);
    }

    // Sorting
    const sortBy = filter.sortBy || 'createdAt';
    const sortOrder = filter.sortOrder || 'desc';

    todos.sort((a, b) => {
      let valA: string | number = a[sortBy] || '';
      let valB: string | number = b[sortBy] || '';

      if (sortBy === 'priority') {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        valA = priorityWeight[a.priority];
        valB = priorityWeight[b.priority];
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return todos;
  },

  getTodoById(id: string): Todo | null {
    const todos = readTodos();
    return todos.find(t => t.id === id) || null;
  },

  createTodo(input: CreateTodoInput): Todo {
    const todos = readTodos();
    const now = new Date().toISOString();

    const newTodo: Todo = {
      id: `todo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: input.title.trim(),
      description: input.description?.trim() || '',
      completed: false,
      priority: input.priority || 'medium',
      category: input.category || 'General',
      dueDate: input.dueDate || undefined,
      createdAt: now,
      updatedAt: now,
    };

    todos.unshift(newTodo);
    writeTodos(todos);
    return newTodo;
  },

  updateTodo(id: string, updates: UpdateTodoInput): Todo | null {
    const todos = readTodos();
    const index = todos.findIndex(t => t.id === id);

    if (index === -1) return null;

    const existing = todos[index];
    const updated: Todo = {
      ...existing,
      ...updates,
      title: updates.title !== undefined ? updates.title.trim() : existing.title,
      description: updates.description !== undefined ? updates.description.trim() : existing.description,
      updatedAt: new Date().toISOString(),
    };

    todos[index] = updated;
    writeTodos(todos);
    return updated;
  },

  toggleTodo(id: string): Todo | null {
    const todos = readTodos();
    const index = todos.findIndex(t => t.id === id);

    if (index === -1) return null;

    todos[index].completed = !todos[index].completed;
    todos[index].updatedAt = new Date().toISOString();

    writeTodos(todos);
    return todos[index];
  },

  deleteTodo(id: string): boolean {
    const todos = readTodos();
    const filtered = todos.filter(t => t.id !== id);

    if (filtered.length === todos.length) {
      return false;
    }

    writeTodos(filtered);
    return true;
  },

  clearCompleted(): number {
    const todos = readTodos();
    const activeTodos = todos.filter(t => !t.completed);
    const removedCount = todos.length - activeTodos.length;

    writeTodos(activeTodos);
    return removedCount;
  },

  getStats(): TodoStats {
    const todos = readTodos();
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;
    const highPriority = todos.filter(t => !t.completed && t.priority === 'high').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      active,
      highPriority,
      completionRate,
    };
  }
};
