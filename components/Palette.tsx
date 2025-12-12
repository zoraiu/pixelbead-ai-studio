import React, { useState, useMemo } from 'react';
import { BEAD_PALETTE } from '../constants';
import { BeadColor } from '../types';

interface PaletteProps {
  selectedColor: BeadColor;
  onSelect: (color: BeadColor) => void;
}

const Palette: React.FC<PaletteProps> = ({ selectedColor, onSelect }) => {
  const [search, setSearch] = useState('');

  const filteredPalette = useMemo(() => {
    if (!search.trim()) return BEAD_PALETTE;
    const lower = search.toLowerCase();
    return BEAD_PALETTE.filter(
      (b) => 
        b.name.toLowerCase().includes(lower) || 
        b.id.toLowerCase().includes(lower) ||
        b.hex.toLowerCase().includes(lower)
    );
  }, [search]);

  return (
    <div className="w-64 bg-slate-800 border-l border-slate-700 flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 bg-slate-900">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Bead Palette ({BEAD_PALETTE.length})</h3>
        
        {/* Active Color */}
        <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-md mb-3 border border-slate-700">
            <div 
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: selectedColor.hex }}
            ></div>
            <div className="overflow-hidden">
                <div className="text-sm font-bold truncate text-white">{selectedColor.name}</div>
                <div className="text-xs text-indigo-400 truncate font-mono">{selectedColor.id}</div>
            </div>
        </div>

        {/* Search */}
        <div className="relative">
            <input 
                type="text" 
                placeholder="Search M-ID or Name..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md py-1.5 px-3 pl-8 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
            <svg className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {filteredPalette.length === 0 ? (
             <div className="text-center text-slate-500 text-xs py-4">No colors found.</div>
        ) : (
            <div className="grid grid-cols-4 gap-2">
                {filteredPalette.map((bead) => (
                    <button
                        key={bead.id}
                        onClick={() => onSelect(bead)}
                        className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 focus:outline-none relative group ${
                            selectedColor.id === bead.id 
                            ? 'border-white ring-2 ring-indigo-500 scale-110 z-10' 
                            : 'border-transparent hover:border-slate-500'
                        }`}
                        style={{ backgroundColor: bead.hex }}
                        title={`${bead.name} (${bead.id})`}
                    >
                         {/* Tooltip on hover for easier ID reading */}
                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-20">
                             {bead.id}
                         </div>
                    </button>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Palette;