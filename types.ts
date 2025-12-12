export interface BeadColor {
  id: string;
  name: string;
  hex: string;
  brand: 'MARD';
}

export interface GridState {
  width: number;
  height: number;
  cells: (string | null)[][]; // Hex codes or null (empty)
}

export type ToolType = 'pen' | 'eraser' | 'fill' | 'dropper';

export interface ShoppingItem {
  color: BeadColor;
  count: number;
}