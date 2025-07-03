<script lang="ts">
    import { onMount } from 'svelte';

    import { generateGrid } from "../grid";
    import type { Grid, Tile } from "../types";

    // Stores
    import { isDarkModeEnabled } from "../stores";

    let grid: Grid = [];

    onMount(() => {
        grid = generateGrid();
    });

    function handleClick(row: number, col: number) {
        // Tu zavoláme logiku na odstránenie skupiny a pád kociek
    }
</script>

<div
        class="game-wrapper"
        class:dark-mode={$isDarkModeEnabled}
>
    <div class="grid">
        {#each grid as row, rowIndex}
            {#each row as tile, colIndex}
                <div
                        class="tile"
                        on:click={() => handleClick(rowIndex, colIndex)}
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
</style>