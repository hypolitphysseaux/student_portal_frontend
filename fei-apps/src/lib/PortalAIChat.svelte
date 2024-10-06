<script lang="ts">
    import { isDarkModeEnabled } from "../stores";
</script>

<div
        class="chat-wrapper"
        class:dark-mode={$isDarkModeEnabled}
>

</div>

<style lang="scss">
    .chat-wrapper{
      background: var(--welcome-section-background);

      width: 100%;
      height: 100vh;
    }
</style>