<script lang="ts">
    import { onMount } from 'svelte';

    import { generateGrid , generateWinningGrid } from "../grid";
    import type { Grid, Tile } from "../types";

    // Stores
    import { isDarkModeEnabled } from "../stores";

    let grid: Grid = [];
    let highlighted: Set<string> = new Set();
    let gameState: 'ongoing' | 'win' | 'lose' = 'ongoing';

    let score = 0;
    let best_score = 1500; // TODO nacitat z Firebase
    let best_time = 0;

    onMount(() => {
        grid = generateGrid();
    });

    function checkGameOver(grid: Grid): 'win' | 'lose' | 'ongoing' {
        const numRows = grid.length;
        const numCols = grid[0].length;

        let hasAnyGroup = false;
        let hasAnyTile = false;

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const color = grid[row][col].color;
                if (color !== null) {
                    hasAnyTile = true;

                    // Susedia
                    const neighbors = [
                        [row - 1, col],
                        [row + 1, col],
                        [row, col - 1],
                        [row, col + 1],
                    ];

                    for (const [nr, nc] of neighbors) {
                        if (
                            nr >= 0 && nr < numRows &&
                            nc >= 0 && nc < numCols &&
                            grid[nr][nc].color === color
                        ) {
                            hasAnyGroup = true;
                            break;
                        }
                    }
                }
            }
        }

        if (!hasAnyTile) return 'win';
        if (!hasAnyGroup) return 'lose';
        return 'ongoing';
    }

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
        gameState = 'ongoing';
    }

    function handleClick(row: number, col: number) {
        if (gameState !== 'ongoing') return;

        const group = findGroup(grid, row, col);
        if (group.length < 2) return;

        score += (group.length) ** 2;

        for (const [r, c] of group) {
            grid[r][c].color = null;
        }

        applyGravity(grid);
        shiftColumnsLeft(grid);
        highlighted = new Set();
        gameState = checkGameOver(grid);
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

    <!-- Game State -->
    {#if gameState === 'win'}
        <div class="game-state-label" style="color: green;"><strong>🎉 Vyhral si!</strong></div>
    {:else if gameState === 'lose'}
        <div class="game-state-label" style="color: red;"><strong>😞 Hra skončila – žiadne možné ťahy</strong></div>
    {/if}

    <!-- TODO  time (asi do Navbaru), successful games, leaderboard // aj prepojit s firebase -->
    <!-- TODO  game label -->
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

    .game-wrapper .game-state-label{
      position: absolute;
      left: 50%;
      transform: translate(-50%);

      margin-top: 10px;
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


    @media (width <=1500px){
      .game-wrapper{
        height: 80vh;
      }

      .game-wrapper .new-game-button{
        position: absolute;
        top: 50px;
        left: 150px;

        font-size: 24px;
      }

      .game-wrapper .stats-panel{
        position: absolute;
        top: 50px;
        right: 100px;
      }

      .game-wrapper .score-counter{
        font-size: 20px;
      }

      .game-wrapper .best-score{
        font-size: 20px;
      }

      .game-wrapper .best-time{
        font-size: 20px;
      }

      .game-wrapper .grid{
        grid-template-columns: repeat(20, 24px);
        gap: 2px;
      }

      .game-wrapper .grid .tile{
        width: 24px;
        height: 24px;
        border: 1px solid var(--navbar-icon-color);
      }
    }

    @media (width <= 1200px){
      .game-wrapper{
        height: 110vh;
      }

      .game-wrapper .new-game-button{
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translate(-50%);
      }

      .game-wrapper .stats-panel{
        position: absolute;
        top: 500px;
        right: 50%;
        transform: translate(50%);

        //background: #009edb;
      }

      .game-wrapper .grid{
        top: 150px;
      }
    }

    @media (width <= 600px){
      .game-wrapper .new-game-button{
        font-size: 20px;
      }

      .game-wrapper .grid{
        grid-template-columns: repeat(20, 20px);
        gap: 2px;
      }

      .game-wrapper .grid .tile{
        width: 20px;
        height: 20px;
        border: 1px solid var(--navbar-icon-color);
      }

      .game-wrapper .stats-panel{
        right: 50%;
        transform: translate(50%);
        width: max-content;
        //background: #009edb;
      }
    }
</style>