
// Funzone
export type Color = 'red' | 'green' | 'blue' | 'yellow' | 'purple';  // TODO hex pallete
export type Tile = { id: number; color: Color | null };
export type Grid = Tile[][];