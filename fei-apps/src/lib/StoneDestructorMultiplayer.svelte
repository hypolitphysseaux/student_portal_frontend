<script lang="ts">
    import { onMount } from 'svelte';

    import { isDarkModeEnabled } from "../stores";

    onMount(async () => {
        console.log("Stone Multiplayer started.");
    });
</script>

<div
        class="game-wrapper"
        class:dark-mode={$isDarkModeEnabled}
>
    <div class="leaderboard">

    </div>

    <div class="stats-panel">

    </div>

</div>

<style lang="scss">
  .game-wrapper{
    background: var(--welcome-section-background);

    position: relative;
    width: 100%;
    height: fit-content;
    margin-top: 100px;
  }
</style>