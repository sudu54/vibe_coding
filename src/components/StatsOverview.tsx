import React from 'react';
import { TodoStats } from '../types';
import { CheckCircle2, Clock, AlertTriangle, BarChart2 } from 'lucide-react';

interface StatsOverviewProps {
  stats: TodoStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-100 rounded-lg text-slate-700">
            <BarChart2 className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold text-slate-900">Task Overview</h2>
        </div>

        <div className="text-xs font-medium text-slate-500">
          <span className="text-slate-900 font-semibold">{stats.completed}</span> of{' '}
          <span className="text-slate-900 font-semibold">{stats.total}</span> completed ({stats.completionRate}%)
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${stats.completionRate}%` }}
        />
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Total Tasks</span>
            <span className="p-1 bg-white rounded-md text-slate-400">#</span>
          </div>
          <div className="text-xl font-bold text-slate-900">{stats.total}</div>
        </div>

        <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100/60">
          <div className="flex items-center justify-between text-amber-700 text-xs mb-1">
            <span>Active</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-amber-950">{stats.active}</div>
        </div>

        <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/60">
          <div className="flex items-center justify-between text-emerald-700 text-xs mb-1">
            <span>Completed</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-emerald-950">{stats.completed}</div>
        </div>

        <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100/60">
          <div className="flex items-center justify-between text-rose-700 text-xs mb-1">
            <span>High Priority</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-bold text-rose-950">{stats.highPriority}</div>
        </div>
      </div>
    </div>
  );
};
