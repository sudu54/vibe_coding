import React, { useState } from 'react';
import { Priority, Category, CreateTodoInput } from '../types';
import { Plus, Tag, Calendar, AlignLeft, AlertCircle } from 'lucide-react';

interface TodoFormProps {
  onSubmit: (input: CreateTodoInput) => Promise<void>;
}

const CATEGORIES: Category[] = ['Work', 'Personal', 'Shopping', 'Health', 'Projects', 'General'];
const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200' },
  { value: 'high', label: 'High', color: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200' },
];

export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Work');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit({
        title,
        description: description.trim() || undefined,
        category,
        priority,
        dueDate: dueDate || undefined,
      });

      // Reset form on success
      setTitle('');
      setDescription('');
      setDueDate('');
      setShowDetails(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Input Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="What needs to be done? (e.g. Design API endpoints)"
              className="w-full pl-4 pr-10 py-3 text-sm bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className={`px-3 py-3 text-xs font-medium rounded-xl border transition-colors flex items-center gap-1.5 ${
                showDetails || description || dueDate
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span>{showDetails ? 'Fewer options' : 'More options'}</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-5 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 min-w-[110px]"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Adding...' : 'Add Task'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200/60 p-2.5 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Priority & Category Quick Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
          {/* Category Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mr-1">
              <Tag className="w-3 h-3" /> Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  category === cat
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Priority Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium mr-1">Priority:</span>
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                  priority === p.value
                    ? 'ring-2 ring-slate-900/20 font-semibold shadow-2xs ' + p.color
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Expanded Details Section */}
        {showDetails && (
          <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Add details, notes, or subtasks..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-slate-900"
              />
            </div>

            <div className="w-full sm:w-48">
              <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-slate-900"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
