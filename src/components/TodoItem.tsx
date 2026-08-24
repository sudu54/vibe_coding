import React, { useState } from 'react';
import { Todo, Priority, Category, UpdateTodoInput } from '../types';
import { motion } from 'motion/react';
import { Check, Trash2, Edit2, Calendar, Tag, AlertCircle, Save, X } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, updates: UpdateTodoInput) => Promise<void>;
}

const PRIORITY_BADGES: Record<Priority, { label: string; className: string }> = {
  high: { label: 'High', className: 'bg-rose-50 text-rose-700 border-rose-200/80' },
  medium: { label: 'Medium', className: 'bg-amber-50 text-amber-700 border-amber-200/80' },
  low: { label: 'Low', className: 'bg-slate-100 text-slate-600 border-slate-200/80' },
};

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
  const [editCategory, setEditCategory] = useState<Category>(todo.category);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;
    try {
      await onUpdate(todo.id, {
        title: editTitle,
        description: editDescription,
        priority: editPriority,
        category: editCategory,
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date(new Date().setHours(0,0,0,0));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group relative bg-white rounded-2xl border p-4 transition-all shadow-xs hover:shadow-md ${
        todo.completed
          ? 'border-slate-200/60 bg-slate-50/50 opacity-80'
          : isOverdue
          ? 'border-rose-200 bg-rose-50/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {isEditing ? (
        /* Edit Mode Form */
        <div className="space-y-3">
          <div>
            <label className="block text-2xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Title
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 font-medium"
            />
          </div>

          <div>
            <label className="block text-2xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={2}
              className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as Priority)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 font-medium"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value as Category)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 font-medium"
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
                <option value="Projects">Projects</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-3 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-2xs flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Normal Task Display */
        <div className="flex items-start gap-3.5">
          {/* Completion Checkbox */}
          <button
            type="button"
            onClick={() => onToggle(todo.id)}
            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border transition-all flex items-center justify-center ${
              todo.completed
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                : 'border-slate-300 hover:border-slate-900 bg-white'
            }`}
          >
            {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                onClick={() => onToggle(todo.id)}
                className={`text-sm font-semibold tracking-tight leading-snug cursor-pointer select-none transition-colors ${
                  todo.completed
                    ? 'line-through text-slate-400'
                    : 'text-slate-900 hover:text-slate-700'
                }`}
              >
                {todo.title}
              </h3>

              {/* Priority & Category Badges */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-md border ${PRIORITY_BADGES[todo.priority].className}`}>
                  {PRIORITY_BADGES[todo.priority].label}
                </span>

                <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200/60 flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5 text-slate-400" />
                  {todo.category}
                </span>
              </div>
            </div>

            {/* Optional Description */}
            {todo.description && (
              <p className={`text-xs mt-1.5 leading-relaxed ${todo.completed ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
                {todo.description}
              </p>
            )}

            {/* Footer info: Date & Actions */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100/80 pt-2.5">
              <div className="flex items-center gap-3">
                {todo.dueDate && (
                  <span className={`flex items-center gap-1 font-medium ${isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-500'}`}>
                    {isOverdue ? <AlertCircle className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
                    Due: {todo.dueDate}
                  </span>
                )}
                <span className="text-slate-400">
                  Added {new Date(todo.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
                  title="Edit task"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={async () => {
                    setIsDeleting(true);
                    await onDelete(todo.id);
                  }}
                  disabled={isDeleting}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
