<script lang="ts">
    import { isDarkModeEnabled } from "../../stores";
    export let user;
    export let show;
    function connectToUser() {
        // TODO
    }
</script>



<div
        class="tooltip-wrapper"
        class:dark-mode={$isDarkModeEnabled}
>
    {#if show}
        <div
                class="tooltip-box"
        >
            Spojiť sa v
            <button class="tooltip-button" on:click={connectToUser}>
                <strong>CONNECTIONS</strong>
                <i class='bx bxs-network-chart'></i>
            </button>
        </div>
    {/if}
</div>


<style lang="scss">
    .tooltip-wrapper {
        position: relative;
        display: inline-block;
    }

    .tooltip-box {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 8px;
        background: #333;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        white-space: nowrap;
        z-index: 10;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;

      background: var(--color-card-background);
      color: var(--color-info);
    }

    .tooltip-box button {
      background: var(--color-background);
      color: var(--primary-color-heading);
        border: none;
        border-radius: 4px;
        padding: 4px 8px;
        cursor: pointer;
    }

    .tooltip-box button:hover {
      transform: scale(1.05);
    }
</style>