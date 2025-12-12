import React, { useMemo } from 'react';
import { BEAD_PALETTE } from '../constants';
import { ShoppingItem } from '../types';

interface ShoppingListProps {
  grid: (string | null)[][];
}

const ShoppingList: React.FC<ShoppingListProps> = ({ grid }) => {
  const items = useMemo(() => {
    const counts: Record<string, number> = {};
    let total = 0;

    grid.forEach(row => {
        row.forEach(colorHex => {
            if (colorHex) {
                counts[colorHex] = (counts[colorHex] || 0) + 1;
                total++;
            }
        });
    });

    const list: ShoppingItem[] = Object.entries(counts)
        .map(([hex, count]) => {
            const bead = BEAD_PALETTE.find(b => b.hex === hex);
            if (!bead) return null;
            return { color: bead, count };
        })
        .filter((item): item is ShoppingItem => item !== null)
        .sort((a, b) => b.count - a.count);

    return { list, total };
  }, [grid]);

  if (items.total === 0) {
      return (
          <div className="p-8 text-center text-slate-500">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>
              <p>Start drawing to see required beads.</p>
          </div>
      );
  }

  return (
    <div className="bg-slate-800 border-t border-slate-700 flex flex-col h-64">
        <div className="p-3 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-slate-300">Shopping List</h3>
            <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">{items.total} beads total</span>
        </div>
        <div className="overflow-y-auto p-2">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-800 sticky top-0">
                    <tr>
                        <th className="px-3 py-2">Color</th>
                        <th className="px-3 py-2">ID</th>
                        <th className="px-3 py-2 text-right">Count</th>
                    </tr>
                </thead>
                <tbody>
                    {items.list.map((item) => (
                        <tr key={item.color.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                            <td className="px-3 py-2 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full inline-block ring-1 ring-slate-600" style={{backgroundColor: item.color.hex}}></span>
                                <span className="text-slate-300 truncate max-w-[100px]">{item.color.name}</span>
                            </td>
                            <td className="px-3 py-2 text-slate-400 font-mono text-xs">{item.color.id}</td>
                            <td className="px-3 py-2 text-right font-bold text-slate-200">{item.count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default ShoppingList;
