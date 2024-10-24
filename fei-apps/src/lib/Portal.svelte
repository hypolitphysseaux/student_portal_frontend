<script lang="ts">
    import { onMount } from "svelte";
    import { isDarkModeEnabled } from "../stores";

    onMount(() => {
        console.log("Portal loaded.");
    });

</script>

<div
        class="portal-wrapper"
        class:dark-mode={$isDarkModeEnabled}
>
    <div class="info-section">

    </div>
</div>

<style lang="scss">
    .portal-wrapper{
      background: var(--welcome-section-background);

      width: 100%;
      height: 100vh;
    }

    .portal-wrapper .info-section{
      background: rgba(100, 191, 227, 0.1);

      width: 100%;
      height: 100px;


    }
</style>