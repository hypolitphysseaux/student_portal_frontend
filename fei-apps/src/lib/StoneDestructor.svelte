<script lang="ts">
    import { onMount } from 'svelte';

    import { generateGrid } from "../grid";
    import type { Grid, Tile } from "../types";

    // Stores
    import { isDarkModeEnabled } from "../stores";

    let grid: Grid = [];
    let highlighted: Set<string> = new Set();

    let score = 0;

    onMount(() => {
        grid = generateGrid();
    });

    function newGame(){
        score = 0;
        grid = generateGrid();
        highlighted = new Set();
    }

    //TODO tak, aby sme nemuseli znova hladat, lebo uz musi byt hovernuta skupina
    function handleClick(row: number, col: number) {
        const group = findGroup(grid, row, col);
        if (group.length < 2) return;

        // Získaj skóre: napr. (n - 2)^2
        score += (group.length - 2) ** 2;

        // Zničiť kocky
        for (const [r, c] of group) {
            grid[r][c].color = null;
        }

        // Tu ešte neskôr doplníme pád kociek

        highlighted = new Set(); // Vymaž zvýraznenie
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
                        style="background-color: {tile.color || 'white'};"
                ></div>
            {/each}
        {/each}
    </div>

    <div class="score-counter">🏆 Skóre: {score}</div>

    <!-- TODO best score, time, best time, successful games, leaderboard // aj prepojit s firebase -->

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

    .game-wrapper .score-counter{
      position: absolute;
      top: 50px;
      right: 350px;

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