import React from 'react';
import { TodoFilter as FilterType, Category } from '../types';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface TodoFilterProps {
  filter: FilterType;
  onChange: (updated: FilterType) => void;
  categories: Category[];
}

export const TodoFilter: React.FC<TodoFilterProps> = ({ filter, onChange, categories }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs mb-5">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filter.search || ''}
            onChange={(e) => onChange({ ...filter, search: e.target.value })}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-slate-900 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          {(['all', 'active', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => onChange({ ...filter, status })}
              className={`px-3 py-1.5 text-xs font-semibold capitalize rounded-lg transition-all ${
                (filter.status || 'all') === status
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Category & Priority Dropdowns */}
        <div className="flex items-center gap-2">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={filter.category || 'all'}
              onChange={(e) => onChange({ ...filter, category: e.target.value })}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 pr-7 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Priority Dropdown */}
          <div className="relative">
            <select
              value={filter.priority || 'all'}
              onChange={(e) => onChange({ ...filter, priority: e.target.value })}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 pr-7 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
