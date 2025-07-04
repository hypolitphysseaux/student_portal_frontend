<script lang="ts">
    import { onMount } from 'svelte';

    import { generateGrid } from "../grid";
    import type { Grid, Tile } from "../types";

    // Stores
    import { isDarkModeEnabled } from "../stores";

    let grid: Grid = [];
    let highlighted: Set<string> = new Set();

    let score = 0;
    let best_score = 1500;
    let best_time = 0;

    onMount(() => {
        grid = generateGrid();
    });

    function shiftColumnsLeft(grid: Grid){
        const numRows = grid.length;
        const numCols = grid[0].length;

        const newCols: string[][] = [];

        // Pre každý stĺpec zľava doprava
        for (let col = 0; col < numCols; col++) {
            const column = grid.map(row => row[col].color);

            const isEmpty = column.every(color => color === null);
            if (!isEmpty) {
                newCols.push(column);
            }
        }

        const missingCols = numCols - newCols.length;

        // Pridaj prázdne stĺpce na koniec
        for (let i = 0; i < missingCols; i++) {
            newCols.push(Array(numRows).fill(null));
        }

        // Prepíš grid podľa newCols
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                grid[row][col].color = newCols[col][row];
            }
        }
    }

    function applyGravity(grid: Grid){
        const numRows = grid.length;
        const numCols = grid[0].length;

        for (let col = 0; col < numCols; col++) {
            const stack: (string | null)[] = [];

            for (let row = numRows - 1; row >= 0; row--) {
                const color = grid[row][col].color;
                if (color !== null) {
                    stack.push(color);
                }
            }

            for (let row = numRows - 1; row >= 0; row--) {
                grid[row][col].color = stack.length > 0 ? stack.shift()! : null;
            }
        }
    }

    function newGame(){
        score = 0;
        grid = generateGrid();
        highlighted = new Set();
    }

    function handleClick(row: number, col: number) {
        const group = findGroup(grid, row, col);
        if (group.length < 2) return;

        score += (group.length) ** 2;

        for (const [r, c] of group) {
            grid[r][c].color = null;
        }

        applyGravity(grid);
        shiftColumnsLeft(grid);

        highlighted = new Set();
    }

    function findGroup(grid: Grid, row: number, col: number): [number, number][] {
        const targetColor = grid[row][col]?.color;
        if (!targetColor) return [];

        const visited = new Set<string>();
        const result: [number, number][] = [];

        function dfs(r: number, c: number) {
            const key = `${r},${c}`;
            if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) return;
            if (visited.has(key)) return;
            if (grid[r][c]?.color !== targetColor) return;

            visited.add(key);
            result.push([r, c]);

            dfs(r - 1, c);
            dfs(r + 1, c);
            dfs(r, c - 1);
            dfs(r, c + 1);
        }

        dfs(row, col);
        return result;
    }

    function clearHighlight(){
        highlighted = new Set();
    }

    function handleHover(row: number, col: number) {
        let group = findGroup(grid, row, col);

        if (group.length < 2) {
            highlighted = new Set();
            return;
        }
        highlighted = new Set(group.map(([r, c]) => `${r},${c}`));
    }
</script>

<div
        class="game-wrapper"
        class:dark-mode={$isDarkModeEnabled}
        on:mouseleave={clearHighlight}
>
    <button
            on:click={newGame}
            class="new-game-button"
    >
        Nová hra
    </button>

    <div class="grid">
        {#each grid as row, rowIndex}
            {#each row as tile, colIndex}
                <div
                        class="tile"
                        class:highlighted={highlighted.has(`${rowIndex},${colIndex}`)}
                        on:mouseenter={() => handleHover(rowIndex, colIndex)}
                        on:click={() => handleClick(rowIndex, colIndex)}
                        style="background-color: {tile.color || 'white'};"
                ></div>
            {/each}
        {/each}
    </div>

    <div class="stats-panel">
        <div class="score-counter">🏆 Skóre: {score}</div>
        <div class="best-score">🏆 Najlepšie skóre: {best_score}</div>
        <div class="best-time">🕛 Najlepší čas: {best_time}</div>
    </div>



    <!-- TODO  time (asi do Navbaru), successful games, leaderboard // aj prepojit s firebase -->
    <!-- TODO logika koncu hry (neuspesneho)-->
</div>



<style lang="scss">
    .game-wrapper{
      background: var(--welcome-section-background);

      position: relative;
      width: 100%;
      height: 60vh;
      margin-top: 100px;
    }

    .game-wrapper .new-game-button{
      position: absolute;
      top: 50px;
      left: 350px;

      display: inline-block;
      background: #2b6209;
      color: #fff;
      font-size: 28px;
      border-radius: 8px;
      padding: 8px 15px;
      border: none;
    }

    .game-wrapper .new-game-button:hover{
      background: rgba(43, 98, 9, 0.95);
      transform: scale(1.02);
      cursor: pointer;
    }

    .game-wrapper .stats-panel{
      position: absolute;
      top: 50px;
      right: 200px;

      display: flex;
      flex-direction: column;
      gap: 20px;
      //background: #009edb;
    }

    .game-wrapper .score-counter{
      color: var(--navbar-icon-color);
      font-size: 28px;
    }

    .game-wrapper .best-score{
      color: var(--navbar-icon-color);
      font-size: 28px;
    }

    .game-wrapper .best-time{
      color: var(--navbar-icon-color);
      font-size: 28px;
    }

    .game-wrapper .grid{
      position: absolute;
      top: 50px;
      left: 50%;
      transform: translate(-50%);

      display: grid;
      grid-template-columns: repeat(20, 32px);
      gap: 2px;
    }

    .game-wrapper .grid .tile{
      width: 32px;
      height: 32px;
      border: 1px solid var(--navbar-icon-color);
    }

    .game-wrapper .grid .tile.highlighted {
      box-shadow: 0 0 4px 2px rgba(255, 255, 255, 0.8);
      transform: scale(1.08);
      transition: all 0.1s ease;
      z-index: 2;
    }
</style>