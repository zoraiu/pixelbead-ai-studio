import { BEAD_PALETTE } from '../constants';
import { BeadColor } from '../types';

// Convert Hex to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// Euclidean distance color matching
const getClosestBead = (r: number, g: number, b: number): BeadColor => {
  let minDistance = Infinity;
  let closest = BEAD_PALETTE[0];

  for (const bead of BEAD_PALETTE) {
    const beadRgb = hexToRgb(bead.hex);
    if (!beadRgb) continue;

    // Simple Euclidean distance (Fast)
    // For better accuracy, could use Delta E (CIELAB), but this is sufficient for MVP speed
    const distance = Math.sqrt(
      Math.pow(r - beadRgb.r, 2) +
      Math.pow(g - beadRgb.g, 2) +
      Math.pow(b - beadRgb.b, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closest = bead;
    }
  }
  return closest;
};

export const processImageToGrid = (
  imageSrc: string,
  width: number,
  height: number
): Promise<(string | null)[][]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Draw and resize image to grid dimensions (Pixelating it)
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const newGrid: (string | null)[][] = [];

      for (let y = 0; y < height; y++) {
        const row: (string | null)[] = [];
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];

          // If transparent, leave empty
          if (a < 50) {
            row.push(null);
          } else {
            const closestBead = getClosestBead(r, g, b);
            row.push(closestBead.hex);
          }
        }
        newGrid.push(row);
      }
      resolve(newGrid);
    };

    img.onerror = (err) => reject(err);
  });
};
