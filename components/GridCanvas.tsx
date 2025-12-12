import React, { useRef, useEffect, useState, useCallback } from 'react';
import { BeadColor, ToolType } from '../types';
import { BEAD_PALETTE } from '../constants';

interface GridCanvasProps {
  grid: (string | null)[][];
  setGrid: React.Dispatch<React.SetStateAction<(string | null)[][]>>;
  selectedColor: BeadColor;
  tool: ToolType;
  width: number;
  height: number;
}

const GridCanvas: React.FC<GridCanvasProps> = ({
  grid,
  setGrid,
  selectedColor,
  tool,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [cellSize, setCellSize] = useState(20);

  // Auto-resize cell size based on container, but enforce a minimum for readability
  useEffect(() => {
    if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        // Leave some padding
        const maxCellW = Math.floor((clientWidth - 40) / width);
        const maxCellH = Math.floor((clientHeight - 40) / height);
        
        // Priority: Fit on screen if possible, but NEVER go below 16px to ensure text is readable.
        // If 16px makes it larger than screen, the parent div (overflow-auto) handles scrolling.
        const fitSize = Math.min(maxCellW, maxCellH);
        const newSize = Math.max(16, Math.min(fitSize, 45)); 
        
        setCellSize(newSize);
    }
  }, [width, height]);

  const getContrastColor = (hex: string) => {
    // Simple luminance calculation to decide text color (black or white)
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
  };

  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Grid Background
    ctx.fillStyle = '#f1f5f9'; // Light slate background for better contrast of empty grid
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Beads
    grid.forEach((row, y) => {
      row.forEach((color, x) => {
        const cx = x * cellSize;
        const cy = y * cellSize;

        if (color) {
          // Find bead info for ID
          const bead = BEAD_PALETTE.find(b => b.hex.toLowerCase() === color.toLowerCase());

          ctx.fillStyle = color;
          
          // Draw square shape 
          // UsingfillRect to ensure no gaps between cells, typical for patterns
          ctx.fillRect(cx, cy, cellSize, cellSize);
          
          // Draw Bead ID Text
          if (bead) {
              ctx.fillStyle = getContrastColor(color);
              // Font size ~50% of cell size
              const fontSize = Math.max(8, Math.floor(cellSize * 0.45)); 
              ctx.font = `bold ${fontSize}px "Inter", sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              
              const text = bead.id;
              ctx.fillText(text, cx + cellSize / 2, cy + cellSize / 2);
          }
          
          // Subtle border for colored cells to distinguish same-colored neighbors
          ctx.strokeStyle = 'rgba(0,0,0,0.1)';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(cx, cy, cellSize, cellSize);

        } else {
             // Empty cell grid lines
             ctx.strokeStyle = '#cbd5e1'; // Slate 300
             ctx.lineWidth = 1;
             ctx.strokeRect(cx, cy, cellSize, cellSize);
        }
      });
    });
    
    // Outer Border
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width * cellSize, height * cellSize);

  }, [grid, cellSize, width, height]);

  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  const handleInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);

    if (x >= 0 && x < width && y >= 0 && y < height) {
      if (tool === 'dropper') {
         // Logic for dropper would go here
         return; 
      }

      setGrid((prev) => {
        const newGrid = prev.map((row) => [...row]);
        
        if (tool === 'pen') {
          newGrid[y][x] = selectedColor.hex;
        } else if (tool === 'eraser') {
          newGrid[y][x] = null;
        } else if (tool === 'fill') {
             newGrid[y][x] = selectedColor.hex;
        }
        return newGrid;
      });
    }
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    handleInteraction(e);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing && (tool === 'pen' || tool === 'eraser')) {
      handleInteraction(e);
    }
  };

  const onMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <div 
        ref={containerRef} 
        className="flex-1 h-full w-full flex items-center justify-center bg-slate-200 overflow-auto p-8 border-inner shadow-inner"
    >
      <div className="relative shadow-xl bg-white">
        <canvas
            ref={canvasRef}
            width={width * cellSize}
            height={height * cellSize}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            className="cursor-crosshair block"
        />
      </div>
    </div>
  );
};

export default GridCanvas;