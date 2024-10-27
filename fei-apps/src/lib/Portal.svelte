<script lang="ts">
    import { onMount } from "svelte";
    import { isDarkModeEnabled, isChatModalOpen, loggedUser } from "../stores";

    onMount(() => {
        console.log("Portal loaded.");
    });

</script>

<div
        class="portal-wrapper"
        class:dark-mode={$isDarkModeEnabled}
>

    <!-- Chat -->
    {#if $isChatModalOpen}
        <div class="modal" id="chatModal">
            <div class="modal-content">

                <!-- Close Chat button -->
                <div class="my-button">
                    <md-icon-button on:click={() => { isChatModalOpen.set(false) }}>
                        <i class='bx bx-x'></i>
                    </md-icon-button>
                </div>

                <div class="chat-container">
                    <div class="chat-history" id="chatHistory">

                        <div class="message bot">
                            <div class="profile-pic">
                                <img src="avatar.png"/>  <!-- TODO dorobit -->
                            </div>
                            <div class="message-content">Ahoj {$loggedUser.displayName.split(" ")[0]}! Ako Ti môžem pomôcť?</div>
                        </div>

                        <div class="message user">
                            <div class="profile-pic">
                                <img src="{$loggedUser.photoURL}"/>
                            </div>
                            <div class="message-content">Potrebujem vytvoriť modálne chatovacie okno.</div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    {/if}


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
      ///background: rgba(100, 191, 227, 0.1);

      width: 100%;
      height: 100px;
    }

    //Modal CHAT
    .portal-wrapper .modal {
      display: flex;
      position: fixed;
      top: 150px;
      left: 50%;
      transform: translate(-50%, 0);
      width: 700px;
      max-width: 90%;
      height: 400px;
      background-color: rgba(0, 0, 0, 0.00001);
      z-index: 1000;
      pointer-events: none;
      box-shadow: var(--box-shadow);
    }

    .portal-wrapper .modal .modal-content {
      width: 100%;
      height: 100%;
      //background-color: var(--color-background); //??
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--box-shadow);
      position: relative;
      pointer-events: all;
    }

    /* Tlačidlo na zatvorenie modálneho okna */
    .my-button {
      position: absolute;
      top: 10px;
      right: 10px;
      --md-icon-button-hover-state-layer-color: red;
    }

    .my-button i{
      color: var(--navbar-icon-color);
    }

    /* Chat kontajner */
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .chat-history {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 15px;
      background-color: var(--search-background);;
      max-height: 100%;
    }

    /* Základné nastavenie správ */
    .message {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 10px 15px;
      border-radius: 8px;
      max-width: 70%;
      word-wrap: break-word;
      font-size: 16px;
    }

    /* Profilová fotka */
    .profile-pic {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
    }

    .profile-pic img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Obsah správy */
    .message-content {
      padding: 10px;
      border-radius: 16px;
    }

    /* Štýl pre správu od bota */
    .message.bot .message-content {
      background-color: #e1f5fe;
      color: #007acc;
    }

    /* Štýl pre správu od používateľa */
    .message.user {
      align-self: flex-end;
    }

    .message.user .message-content {
      background-color: #dcf8c6;
      color: #333;
    }
</style>