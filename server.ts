import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { Database } from './server/database.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

// --- API ENDPOINTS (FastAPI-style REST semantics) ---

// 1. GET /api/todos - List todos with filtering & sorting
app.get('/api/todos', (req, res) => {
  try {
    const filter = {
      search: req.query.search as string,
      status: req.query.status as any,
      category: req.query.category as string,
      priority: req.query.priority as string,
      sortBy: req.query.sortBy as any,
      sortOrder: req.query.sortOrder as any,
    };
    const todos = Database.getTodos(filter);
    res.json({ success: true, count: todos.length, data: todos });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. GET /api/stats - Get summary metrics
app.get('/api/stats', (req, res) => {
  try {
    const stats = Database.getStats();
    res.json({ success: true, data: stats });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. POST /api/todos - Create new todo
app.post('/api/todos', (req, res) => {
  try {
    const { title, description, priority, category, dueDate } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const todo = Database.createTodo({
      title,
      description,
      priority,
      category,
      dueDate,
    });

    res.status(201).json({ success: true, message: 'Todo created successfully', data: todo });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. GET /api/todos/:id - Get single todo by ID
app.get('/api/todos/:id', (req, res) => {
  try {
    const todo = Database.getTodoById(req.params.id);
    if (!todo) {
      return res.status(404).json({ success: false, error: 'Todo item not found' });
    }
    res.json({ success: true, data: todo });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. PUT /api/todos/:id - Update todo details
app.put('/api/todos/:id', (req, res) => {
  try {
    const { title, description, completed, priority, category, dueDate } = req.body;
    const updated = Database.updateTodo(req.params.id, {
      title,
      description,
      completed,
      priority,
      category,
      dueDate,
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Todo item not found' });
    }

    res.json({ success: true, message: 'Todo updated successfully', data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. PATCH /api/todos/:id/toggle - Toggle completed state
app.patch('/api/todos/:id/toggle', (req, res) => {
  try {
    const toggled = Database.toggleTodo(req.params.id);
    if (!toggled) {
      return res.status(404).json({ success: false, error: 'Todo item not found' });
    }
    res.json({ success: true, message: 'Todo status toggled', data: toggled });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. DELETE /api/todos/:id - Delete todo item
app.delete('/api/todos/:id', (req, res) => {
  try {
    const success = Database.deleteTodo(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Todo item not found' });
    }
    res.json({ success: true, message: 'Todo deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. DELETE /api/todos/completed/clear - Bulk clear completed items
app.delete('/api/todos/completed/clear', (req, res) => {
  try {
    const count = Database.clearCompleted();
    res.json({ success: true, message: `Cleared ${count} completed todos`, count });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. GET /api/openapi.json - OpenAPI 3.0 specification for FastAPI style API docs
app.get('/api/openapi.json', (req, res) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'Todo App REST API',
      version: '1.0.0',
      description: 'RESTful API with FastAPI semantics for full CRUD operations on Todos',
    },
    paths: {
      '/api/todos': {
        get: {
          summary: 'List todos',
          parameters: [
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['all', 'active', 'completed'] } },
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'priority', in: 'query', schema: { type: 'string', enum: ['low', 'medium', 'high'] } },
          ],
          responses: { '200': { description: 'List of todo items' } },
        },
        post: {
          summary: 'Create todo',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { title: { type: 'string' }, priority: { type: 'string' }, category: { type: 'string' } } } } },
          },
          responses: { '201': { description: 'Todo created' } },
        },
      },
      '/api/todos/{id}': {
        put: { summary: 'Update todo details' },
        delete: { summary: 'Delete todo item' },
      },
      '/api/todos/{id}/toggle': {
        patch: { summary: 'Toggle completion state' },
      },
    },
  });
});

// --- VITE / STATIC SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
