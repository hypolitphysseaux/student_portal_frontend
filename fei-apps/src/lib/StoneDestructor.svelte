<script lang="ts">
    import { onMount } from 'svelte';

    import { generateGrid } from "../grid";
    import type { Grid, Tile } from "../types";

    // Stores
    import { isDarkModeEnabled } from "../stores";

    let grid: Grid = [];
    let highlighted: Set<string> = new Set();

    onMount(() => {
        grid = generateGrid();
    });

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
</div>



<style lang="scss">
    .game-wrapper{
      background: var(--welcome-section-background);

      position: relative;
      width: 100%;
      height: 60vh;

      margin-top: 100px;
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