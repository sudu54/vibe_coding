import React from 'react';
import { CheckSquare, Code, Terminal, Layers } from 'lucide-react';

interface HeaderProps {
  onOpenApiViewer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenApiViewer }) => {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
            <CheckSquare className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight text-slate-900">
                Todo App
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                SPA
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Single-page task manager powered by REST API & Database
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenApiViewer}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            title="Inspect REST API & Schema"
          >
            <Code className="w-3.5 h-3.5 text-slate-600" />
            <span>API Docs</span>
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-lg text-emerald-700 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>API Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};
