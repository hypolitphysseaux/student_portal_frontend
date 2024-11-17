<script lang="ts">
    import { onMount , onDestroy } from "svelte";
    import { isDarkModeEnabled, isChatModalOpen, loggedUser, currentChat } from "../stores";

    //FIRESTORE
    import { doc, getDoc, onSnapshot, updateDoc, arrayUnion, increment, setDoc } from "firebase/firestore";
    import { db } from "../firebase";

    import { v4 as uuidv4 } from 'uuid';

    let listOfChats :any;
    let chatHistory :any;
    let messageListener :any;

    onMount(async () => {
        console.log("Portal loaded.");

        //Get my chats
        const myChats = await getDoc(doc(db, "chats", $loggedUser.uid));
        if (myChats.exists()){
            listOfChats = myChats.data();
        }

        if (!myChats.exists()){
            await setDoc(doc(db, "chats", $loggedUser.uid), {
                [uuidv4()]:
                    {
                        history: [
                            {
                                sender: "bot",
                                message: "Ahoj "+ $loggedUser.displayName.split(" ")[0] +"! Ako Ti môžem pomôcť?",
                                timestamp: new Date()
                            }
                        ]
                    }
            });

            const newChat = await getDoc(doc(db, "chats", $loggedUser.uid));
            listOfChats = newChat.data();
        }


        //Set currentChat
        currentChat.set(Object.keys(listOfChats)[0]);


        //Set up message listener
        messageListener = onSnapshot(doc(db, "chats", $loggedUser.uid), (d) => {
            if (d.exists()){
                chatHistory = d.data()[$currentChat].history;
                console.log(chatHistory);
            }
        });



    });

    onDestroy(async () => {
        listOfChats = {};
        chatHistory = [];
        messageListener();
    });

    function scrollChatToBottom() {
        const chatHistory = document.getElementById("chatHistory");

        if (chatHistory){
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }
    }

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Automatically scroll chat to bottom after opening
    $: if ($isChatModalOpen) {
        setTimeout(() => {
            scrollChatToBottom();
        }, 50);
    }
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
                        {#each chatHistory as message}
                            <!-- Bot messages -->
                            {#if (message.sender == "bot")}
                                <div class="message bot">
                                    <div class="profile-pic">
                                        <img src="avatar.png"/>
                                    </div>
                                    <div class="message-content">
                                        <div class="timestamp others">{formatTimestamp(message.timestamp)}</div>
                                        {message.message}
                                    </div>
                                </div>
                            {/if}

                            <!-- User messages -->
                            {#if (message.sender == "user")}
                                <div class="message user">

                                    <div class="profile-pic">
                                        <img src="{$loggedUser.photoURL}"/>
                                    </div>
                                    <div class="message-content">
                                        <div class="timestamp me">{formatTimestamp(message.timestamp)}</div>
                                        {message.message}
                                    </div>
                                </div>
                            {/if}
                        {/each}

                    </div>
                </div>

            </div>
        </div>
    {/if}


    <div class="info-section">
        <!-- TODO predmety, rozvrh a podobne -->
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
      top: 110px;
      left: 50%;
      transform: translate(-50%, 0);
      width: 1200px;
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
      //flex-direction: column;
      gap: 10px;
      padding: 10px 15px;
      border-radius: 8px;
      max-width: 70%;
      word-wrap: break-word;
      word-break: break-word;
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
      background-color: var(--bot-message-background);
      color: var(--bot-message-text-color);
    }

    /* Štýl pre správu od používateľa */
    .message.user {
      align-self: flex-end;
    }

    .message.user .message-content {
      background-color: var(--user-message-background);
      color: var(--user-message-text-color);
    }

    // Timestamp styles
    .timestamp.me {
      font-size: 11px;
      color: var(--timestamp-color-user);
      align-self: flex-end;

    }

    .timestamp.others {
      font-size: 11px;
      color: var(--timestamp-color-bot);
      align-self: flex-end;
    }
</style>