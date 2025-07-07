
import type { Grid, Tile, Color } from './types';

const colors: Color[] = ['red', 'green', 'blue', 'yellow', 'purple'];

export function generateWinningGrid(): Grid {
    const numRows = 10;
    const numCols = 10;

    // Vytvor prázdnu mriežku
    const grid: Grid = Array.from({ length: numRows }, () =>
        Array.from({ length: numCols }, () => ({ color: null }))
    );

    // Vlož jednu poslednú skupinu – napr. 3 modré kocky spolu
    grid[9][0].color = 'blue';
    grid[9][1].color = 'blue';
    grid[8][0].color = 'blue';
    grid[8][2].color = 'red';
    grid[8][3].color = 'red';

    return grid;
}

export function generateGrid(rows = 12, cols = 20): Grid {
    let id = 0;
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
            id: id++,
            color: colors[Math.floor(Math.random() * colors.length)]
        }))
    );
}