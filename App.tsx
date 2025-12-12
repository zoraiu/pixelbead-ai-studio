import React, { useState, useEffect, useRef } from 'react';
import { BEAD_PALETTE, GRID_SIZES } from './constants';
import { BeadColor, ToolType } from './types';
import GridCanvas from './components/GridCanvas';
import Palette from './components/Palette';
import Toolbar from './components/Toolbar';
import ShoppingList from './components/ShoppingList';
import { generatePixelArtImage } from './services/geminiService';
import { processImageToGrid } from './utils/beadUtils';

const App: React.FC = () => {
  const [size, setSize] = useState<number>(32);
  const [grid, setGrid] = useState<(string | null)[][]>([]);
  const [selectedColor, setSelectedColor] = useState<BeadColor>(BEAD_PALETTE[0]);
  const [tool, setTool] = useState<ToolType>('pen');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [showAIModal, setShowAIModal] = useState(false);
  
  // History for Undo
  const historyRef = useRef<(string | null)[][][]>([]);

  // Initialize grid
  useEffect(() => {
    const newGrid = Array(size).fill(null).map(() => Array(size).fill(null));
    setGrid(newGrid);
    historyRef.current = [newGrid];
  }, [size]);

  // Save state to history on change (debounced slightly in a real app, strict here)
  const updateGrid = (newGridOrUpdater: React.SetStateAction<(string | null)[][]>) => {
    setGrid(prev => {
        const next = typeof newGridOrUpdater === 'function' ? newGridOrUpdater(prev) : newGridOrUpdater;
        // Simple history stack management
        if (historyRef.current[historyRef.current.length - 1] !== next) {
             historyRef.current.push(next);
             if (historyRef.current.length > 20) historyRef.current.shift();
        }
        return next;
    });
  };

  const handleUndo = () => {
      if (historyRef.current.length > 1) {
          historyRef.current.pop(); // Remove current
          const prev = historyRef.current[historyRef.current.length - 1];
          setGrid(prev);
      }
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the design?')) {
        const empty = Array(size).fill(null).map(() => Array(size).fill(null));
        updateGrid(empty);
    }
  };

  const handleDownload = () => {
    // Generate text report
    const textData = JSON.stringify(grid); // Simplified export
    const blob = new Blob([textData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pixelbead-mard-pattern-${Date.now()}.json`;
    link.click();
    
    // In a real production app, we would render the Canvas to a high-res PNG image here
    alert("Pattern data exported! (Image export would happen here in full version)");
  };

  const handleAIGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
        const imageBase64 = await generatePixelArtImage(prompt);
        const newGrid = await processImageToGrid(imageBase64, size, size);
        updateGrid(newGrid);
        setShowAIModal(false);
    } catch (e) {
        console.error(e);
        alert("Failed to generate pattern. Please check your API key or try a different prompt.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
          if (event.target?.result) {
              try {
                  const newGrid = await processImageToGrid(event.target.result as string, size, size);
                  updateGrid(newGrid);
              } catch (err) {
                  alert("Error processing image.");
              }
          }
      };
      reader.readAsDataURL(file);
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* Sidebar: Palette & Shopping List */}
      <div className="flex flex-col w-72 border-r border-slate-700 bg-slate-800 z-10 shadow-xl">
        <div className="p-4 border-b border-slate-700 bg-slate-900">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                PixelBead AI
            </h1>
            <p className="text-xs text-slate-500 mt-1">MARD Edition</p>
        </div>
        
        {/* Controls */}
        <div className="p-4 border-b border-slate-700 space-y-4">
             <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">Grid Size</label>
                <select 
                    value={size} 
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                    {GRID_SIZES.map(s => <option key={s} value={s}>{s}x{s}</option>)}
                </select>
            </div>
            
            <button 
                onClick={() => setShowAIModal(true)}
                className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-md shadow-lg transition-all flex items-center justify-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                AI Magic Generate
            </button>

            <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                    <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-md text-xs transition-colors flex flex-col items-center justify-center gap-1">
                        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span>Take Photo</span>
                    </button>
                </div>
                <div className="relative">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-md text-xs transition-colors flex flex-col items-center justify-center gap-1">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span>Upload File</span>
                    </button>
                </div>
            </div>
            <div className="text-[10px] text-center text-slate-500">
                Entity to Pixel (Use "Take Photo")
            </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
            <Palette selectedColor={selectedColor} onSelect={setSelectedColor} />
        </div>
        
        <ShoppingList grid={grid} />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full relative">
        <Toolbar 
            currentTool={tool} 
            setTool={setTool} 
            onClear={handleClear}
            onDownload={handleDownload}
            undo={handleUndo}
        />
        
        <GridCanvas 
            grid={grid} 
            setGrid={updateGrid} 
            selectedColor={selectedColor} 
            tool={tool}
            width={size}
            height={size}
        />
      </div>

      {/* AI Modal */}
      {showAIModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-800 rounded-lg shadow-2xl max-w-md w-full border border-slate-700 overflow-hidden">
                  <div className="p-6">
                      <h2 className="text-xl font-bold mb-2 text-white">Generate Pattern</h2>
                      <p className="text-slate-400 text-sm mb-4">
                          Describe what you want (e.g., "A cute pixel art Shiba Inu", "A red mushroom power-up").
                          AI will create a bead-ready pattern for you.
                      </p>
                      
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter your prompt here..."
                        className="w-full h-24 bg-slate-900 border border-slate-600 rounded-md p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                      />

                      <div className="mt-4 flex justify-end gap-3">
                          <button 
                            onClick={() => setShowAIModal(false)}
                            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                          >
                              Cancel
                          </button>
                          <button
                            onClick={handleAIGenerate}
                            disabled={isGenerating || !prompt}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md font-medium transition-all flex items-center gap-2"
                          >
                              {isGenerating ? (
                                  <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                  </>
                              ) : (
                                  "Generate"
                              )}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default App;