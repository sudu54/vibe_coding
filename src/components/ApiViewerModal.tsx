import React, { useState, useEffect } from 'react';
import { ApiClient } from '../api';
import { X, Terminal, Copy, Check, Code, Server, Layers, Database } from 'lucide-react';

interface ApiViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiViewerModal: React.FC<ApiViewerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'endpoints' | 'openapi' | 'database'>('endpoints');
  const [openApiSpec, setOpenApiSpec] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      ApiClient.getOpenApiSpec()
        .then(setOpenApiSpec)
        .catch((err) => console.error('Failed to load OpenAPI spec:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestEndpoint = async (endpoint: string) => {
    try {
      setIsTesting(true);
      const res = await fetch(endpoint);
      const data = await res.json();
      setTestResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setTestResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsTesting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ENDPOINTS = [
    { method: 'GET', path: '/api/todos', desc: 'Fetch all todo items with search, status, and category filtering' },
    { method: 'POST', path: '/api/todos', desc: 'Create a new todo item with title, priority, and category' },
    { method: 'GET', path: '/api/todos/:id', desc: 'Fetch a single todo item by unique ID' },
    { method: 'PUT', path: '/api/todos/:id', desc: 'Update details of an existing todo item' },
    { method: 'PATCH', path: '/api/todos/:id/toggle', desc: 'Toggle completion state of a todo item' },
    { method: 'DELETE', path: '/api/todos/:id', desc: 'Delete a todo item by ID' },
    { method: 'DELETE', path: '/api/todos/completed/clear', desc: 'Bulk remove all completed todo items' },
    { method: 'GET', path: '/api/stats', desc: 'Retrieve summary metrics (total, active, completed, rate)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[85vh] rounded-2xl border border-slate-200 shadow-xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-900 text-white rounded-xl">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">REST API & Schema Inspector</h2>
              <p className="text-xs text-slate-500">FastAPI-style endpoint specs and persistent JSON database engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'endpoints'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>API Endpoints</span>
          </button>

          <button
            onClick={() => setActiveTab('openapi')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'openapi'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>OpenAPI Specification</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'database'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database Architecture</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'endpoints' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                The Express backend provides clean RESTful routes following FastAPI semantic standards:
              </p>

              <div className="space-y-2.5">
                {ENDPOINTS.map((ep) => (
                  <div
                    key={ep.method + ep.path}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 font-mono text-xs">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                          ep.method === 'GET'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : ep.method === 'POST'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : ep.method === 'PUT'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : ep.method === 'PATCH'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-bold text-slate-900">{ep.path}</span>
                    </div>

                    <div className="flex items-center gap-3 justify-between sm:justify-end">
                      <span className="text-xs text-slate-500">{ep.desc}</span>
                      {ep.method === 'GET' && (
                        <button
                          onClick={() => handleTestEndpoint(ep.path)}
                          className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-slate-700 flex-shrink-0"
                        >
                          Test Endpoint
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Test Output Panel */}
              {testResponse && (
                <div className="mt-4 p-4 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto relative">
                  <div className="flex items-center justify-between text-slate-400 pb-2 mb-2 border-b border-slate-800">
                    <span>Response Output</span>
                    <button
                      onClick={() => copyToClipboard(testResponse)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  </div>
                  <pre className="max-h-48 overflow-y-auto">{testResponse}</pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'openapi' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-600 font-medium">OpenAPI 3.0 Schema (/api/openapi.json):</span>
                {openApiSpec && (
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(openApiSpec, null, 2))}
                    className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Schema'}</span>
                  </button>
                )}
              </div>
              <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs max-h-96 overflow-y-auto">
                <pre>{openApiSpec ? JSON.stringify(openApiSpec, null, 2) : 'Loading OpenAPI Spec...'}</pre>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-slate-700" /> Embedded Data Store (`/data/todos.json`)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The application uses an embedded file-backed database layer located at <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">data/todos.json</code> with safe read/write operations and automatic initial schema seed.
                </p>
              </div>

              <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs">
                <div className="text-slate-400 mb-2">// Todo Record Data Structure</div>
                <pre>{`{
  "id": "todo-1723456789-x82a1",
  "title": "Review REST API specs",
  "description": "Verify component structure and database persistence",
  "completed": false,
  "priority": "high",
  "category": "Work",
  "dueDate": "2026-08-15",
  "createdAt": "2026-08-12T02:30:00.000Z",
  "updatedAt": "2026-08-12T02:30:00.000Z"
}`}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-2xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
