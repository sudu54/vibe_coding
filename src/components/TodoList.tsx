import React from 'react';
import { Todo, UpdateTodoInput } from '../types';
import { TodoItem } from './TodoItem';
import { AnimatePresence } from 'motion/react';
import { CheckCircle2, Trash2, Inbox } from 'lucide-react';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, updates: UpdateTodoInput) => Promise<void>;
  onClearCompleted: () => Promise<void>;
  completedCount: number;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  onUpdate,
  onClearCompleted,
  completedCount,
}) => {
  if (todos.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 mb-1">No tasks found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Add a new task using the form above or adjust your search and filters to view existing tasks.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header bar above task list */}
      <div className="flex items-center justify-between px-1 mb-1">
        <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
          Tasks ({todos.length})
        </span>

        {completedCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Completed ({completedCount})</span>
          </button>
        )}
      </div>

      {/* Animated Task List */}
      <AnimatePresence mode="popLayout">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
