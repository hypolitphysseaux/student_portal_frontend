<script lang="ts">
    import { onMount } from "svelte";
    import { isDarkModeEnabled } from "../stores";

    onMount(() => {
        console.log("Portal tutorial loaded.");
    });
</script>

<div
        class="tutorial-wrapper"
        class:dark-mode={$isDarkModeEnabled}
>
    <!-- Character -->
    <div class="ai-character"></div>

    <div class="tutorial-buttons">
        <!-- Close Tutorial -->
        <button class="close-tutorial">
            Rozumiem
        </button>

        <!-- Checkbox - Do not show again -->
        <input type="checkbox" />
    </div>
</div>


<style lang="scss">
    .tutorial-wrapper{
      position: relative;
      background: var(--dotted-background);
      background-size: 10px 10px;

      width: 100%;
      height: 200px;

      margin-top: 100px;
      box-shadow: var(--box-shadow);
    }

    .tutorial-wrapper .tutorial-buttons{
      position: absolute;
      right: 0;
      bottom: 50%;
      background: rgba(100, 191, 227, 0.3);

      width: 300px;
      height: 100px;

      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .tutorial-wrapper .tutorial-buttons .close-tutorial{
      width: 50%;
      margin-top: 30px;
      background: #2b6209;
      color: #fff;
      border: none;
      line-height: 50px;
      font-size: 18px;
      letter-spacing: 0.025rem;
      font-weight: bold;
      cursor: pointer;
      border-radius: 8px;
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
    }

    .tutorial-wrapper .tutorial-buttons .close-tutorial:hover{
      background: rgba(43, 98, 9, 0.63);
      transform: scale(1.05);
    }
</style>