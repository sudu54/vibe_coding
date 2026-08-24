import React, { useState, useEffect, useCallback } from 'react';
import { Todo, TodoStats, TodoFilter as FilterType, CreateTodoInput, UpdateTodoInput, Category } from './types';
import { ApiClient } from './api';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { TodoForm } from './components/TodoForm';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList';
import { ApiViewerModal } from './components/ApiViewerModal';
import { AlertCircle, RefreshCw } from 'lucide-react';

const CATEGORIES: Category[] = ['Work', 'Personal', 'Shopping', 'Health', 'Projects', 'General'];

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [stats, setStats] = useState<TodoStats>({
    total: 0,
    completed: 0,
    active: 0,
    highPriority: 0,
    completionRate: 0,
  });
  const [filter, setFilter] = useState<FilterType>({
    search: '',
    status: 'all',
    category: 'all',
    priority: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApiViewerOpen, setIsApiViewerOpen] = useState(false);

  // Load data from API
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [todosData, statsData] = await Promise.all([
        ApiClient.getTodos(filter),
        ApiClient.getStats(),
      ]);
      setTodos(todosData);
      setStats(statsData);
    } catch (err: any) {
      console.error('Error loading data from API:', err);
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handler: Create Task
  const handleCreateTodo = async (input: CreateTodoInput) => {
    try {
      const newTodo = await ApiClient.createTodo(input);
      setTodos((prev) => [newTodo, ...prev]);
      // Refresh stats
      const updatedStats = await ApiClient.getStats();
      setStats(updatedStats);
    } catch (err: any) {
      console.error('Error creating todo:', err);
      throw err;
    }
  };

  // Handler: Toggle Completion Status (Optimistic Update)
  const handleToggleTodo = async (id: string) => {
    // Optimistic state change
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

    try {
      await ApiClient.toggleTodo(id);
      const updatedStats = await ApiClient.getStats();
      setStats(updatedStats);
    } catch (err) {
      console.error('Error toggling todo:', err);
      // Revert on error
      loadData();
    }
  };

  // Handler: Update Task Details
  const handleUpdateTodo = async (id: string, updates: UpdateTodoInput) => {
    try {
      const updated = await ApiClient.updateTodo(id, updates);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      const updatedStats = await ApiClient.getStats();
      setStats(updatedStats);
    } catch (err) {
      console.error('Error updating todo:', err);
      throw err;
    }
  };

  // Handler: Delete Task
  const handleDeleteTodo = async (id: string) => {
    // Optimistic deletion
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      await ApiClient.deleteTodo(id);
      const updatedStats = await ApiClient.getStats();
      setStats(updatedStats);
    } catch (err) {
      console.error('Error deleting todo:', err);
      loadData();
    }
  };

  // Handler: Clear Completed Tasks
  const handleClearCompleted = async () => {
    try {
      await ApiClient.clearCompleted();
      await loadData();
    } catch (err) {
      console.error('Error clearing completed todos:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
      {/* Header */}
      <Header onOpenApiViewer={() => setIsApiViewerOpen(true)} />

      {/* Main Single-Page Workspace */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Error Banner if API connection fails */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-rose-800 text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadData()}
              className="px-3 py-1 bg-white border border-rose-200 hover:bg-rose-100 rounded-lg font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}

        {/* Task Statistics Bar */}
        <StatsOverview stats={stats} />

        {/* Task Creator Form */}
        <TodoForm onSubmit={handleCreateTodo} />

        {/* Filter and Search Controls */}
        <TodoFilter filter={filter} onChange={setFilter} categories={CATEGORIES} />

        {/* Task List */}
        {isLoading && todos.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Fetching tasks from API database...</span>
          </div>
        ) : (
          <TodoList
            todos={todos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
            onClearCompleted={handleClearCompleted}
            completedCount={stats.completed}
          />
        )}
      </main>

      {/* API & Schema Inspector Modal */}
      <ApiViewerModal
        isOpen={isApiViewerOpen}
        onClose={() => setIsApiViewerOpen(false)}
      />

      {/* Single-Page Footer */}
      <footer className="border-t border-slate-200 py-6 bg-white mt-12 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Todo Application &bull; Single-Page Architecture</span>
          <span className="text-slate-400">REST API Backend &bull; JSON Storage Engine</span>
        </div>
      </footer>
    </div>
  );
}
