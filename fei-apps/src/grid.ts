
import type { Grid, Tile, Color } from './types';

const colors: Color[] = ['red', 'green', 'blue', 'yellow', 'purple'];

export function generateGrid(rows = 12, cols = 20): Grid {
    let id = 0;
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
            id: id++,
            color: colors[Math.floor(Math.random() * colors.length)]
        }))
    );
}