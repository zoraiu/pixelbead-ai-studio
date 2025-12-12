import React from 'react';
import { ToolType } from '../types';

interface ToolbarProps {
  currentTool: ToolType;
  setTool: (t: ToolType) => void;
  onClear: () => void;
  onDownload: () => void;
  undo: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ currentTool, setTool, onClear, onDownload, undo }) => {
  
  const tools: { id: ToolType; icon: React.ReactNode; label: string }[] = [
    { 
        id: 'pen', 
        label: 'Pen',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
    },
    { 
        id: 'eraser', 
        label: 'Eraser',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
    },
    {
        id: 'fill',
        label: 'Fill (Single)',
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
    }
  ];

  return (
    <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center px-4 justify-between">
      <div className="flex items-center gap-2">
        {tools.map((t) => (
            <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${
                    currentTool === t.id 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
                title={t.label}
            >
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
            </button>
        ))}
        <div className="h-6 w-px bg-slate-600 mx-2"></div>
         <button
            onClick={undo}
            className="p-2 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            title="Undo (Ctrl+Z)"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
            onClick={onClear}
            className="px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md transition-colors"
        >
            Clear Grid
        </button>
        <button
            onClick={onDownload}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-md shadow-lg shadow-emerald-900/20 transition-all hover:translate-y-px"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export Pattern
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
