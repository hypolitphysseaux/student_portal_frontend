<script lang="ts">
    import { onMount , onDestroy } from "svelte";
    import {
        isDarkModeEnabled,
        isChatModalOpen,
        loggedUser,
        currentChat,
        isChatListOpen,
    } from "../stores";

    //FIRESTORE
    import { doc, getDoc, onSnapshot, updateDoc, arrayUnion, setDoc, deleteField } from "firebase/firestore";
    import { auth, db } from "../firebase";

    import { v4 as uuidv4 } from 'uuid';
    import { getStorage, ref, listAll } from "firebase/storage";

    //STORAGE
    const storage = getStorage();

    //LISTS
    let listOfChats = {};
    let listOfMyDocs = {};
    let listOfGeneralDocs = {};

    let chatHistory :any;
    let messageListener :any;

    let isMyDocsShown = false;
    let isGeneralDocsShown = false;
    let isSharingNewDoc = false;

    onMount(async () => {
        console.log("Portal loaded.");

        //Get general documents TODO listener
        const storageRefGeneral = ref(storage, `documents/general`);
        const resultGeneral = await listAll(storageRefGeneral);  // Mozno nie vsetky??

        listOfGeneralDocs = resultGeneral.items.map((itemRef) => itemRef.name);

        //Get my documents TODO listener
        const storageRefPersonal = ref(storage, `users/${auth.currentUser.uid}`);
        const resultPersonal = await listAll(storageRefPersonal);

        listOfMyDocs = resultPersonal.items.map((itemRef) => itemRef.name);


        //Get my chats
        const myChats = await getDoc(doc(db, "chats", $loggedUser.uid));
        if (myChats.exists()){
            listOfChats = myChats.data() || {};
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
                        ],
                        name: "Nový chat"
                    }
            });

            const newChat = await getDoc(doc(db, "chats", $loggedUser.uid));
            listOfChats = newChat.data();
        }


        //Set currentChat //TODO najmladsi chat?
        currentChat.set(Object.keys(listOfChats)[0]);


        //Set up message listener
        messageListener = onSnapshot(doc(db, "chats", $loggedUser.uid), (d) => {
            if (d.exists()){
                listOfChats = d.data();
                chatHistory = d.data()[$currentChat].history;
            }
        });



    });

    onDestroy(async () => {
        listOfChats = {};
        chatHistory = [];
        messageListener();
    });

    async function addNewChat(){
        //TODO max 3 chaty

        await updateDoc(doc(db, "chats", $loggedUser.uid), {
            [uuidv4()]:
                {
                    history: [
                        {
                            sender: "bot",
                            message: "Ahoj "+ $loggedUser.displayName.split(" ")[0] +"! Ako Ti môžem pomôcť?",
                            timestamp: new Date()
                        }
                    ],
                    name: "Nový chat"
                }
        });
    }

    async function deleteChat(key){
        //Odstranujem aktualny chat
        if (key == $currentChat){
            //TODO ak odstranim aktualny, tak treba zmenit currentChat store
            // Pri zmene chatu je potreba aj zmena historie chatu
            return;
        }

        try {
            await updateDoc(doc(db, "chats", $loggedUser.uid), {
                [key]: deleteField()
            });
        } catch (e){
            console.error("Error deleting chat: ", e);
        }
    }

    async function renameChat(){
        //TODO , tak ako addNewChat , iba zmenit uuid a neupdateovat history
    }

    async function setActiveChat(key){
        currentChat.set(key);

        //TODO potreba aktualizovat aj historiu, tj prepisat aktualnu historiu - historiou aktualneho chatu (nie je to to iste)
    }

    async function confirmShare(){
        return;
    }

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

    function showOrHideMyDocs(){
        isMyDocsShown = !isMyDocsShown;
    }

    function showOrHideGeneralDocs(){
        isGeneralDocsShown = !isGeneralDocsShown;
    }

    function showOrHideShareDocumentModal(){
        isSharingNewDoc = !isSharingNewDoc;
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

    <!-- Chat List -->
    {#if $isChatListOpen}
        <div class="modal-list">
            <div class="modal-content">
                <!-- Close List button -->
                <div class="my-button">
                    <md-icon-button on:click={() => { isChatListOpen.set(false) }}>
                        <i class='bx bx-x'></i>
                    </md-icon-button>
                </div>

                <!-- Add new chat button -->
                <button
                        class="add-btn"
                        on:click={addNewChat}
                >
                    <i class='bx bx-plus'></i>
                    Nový chat
                </button>

                <div class="chat-list">
                    {#each Object.keys(listOfChats) as key}
                        {#if (key == $currentChat)}
                            <div class="chat-item active-chat">
                                <div class="chat-timestamp">
                                    {
                                        formatTimestamp(
                                            listOfChats[key].history[listOfChats[key].history.length - 1].timestamp
                                        )
                                    }
                                </div>
                                <label>{listOfChats[key].name}</label>

                                <!-- Rename chat button -->
                                <div class="rename-button">
                                    <md-icon-button on:click={() => { renameChat() }}>
                                        <i class='bx bxs-pencil'></i>
                                    </md-icon-button>
                                </div>

                                <!-- Delete chat button -->
                                <div class="delete-chat-button">
                                    <md-icon-button on:click={() => { deleteChat(key) }}>
                                        <i class='bx bxs-trash' ></i>
                                    </md-icon-button>
                                </div>

                            </div>
                        {:else}
                            <div
                                    class="chat-item"
                                    on:click={ () => { setActiveChat(key) }}
                            >
                                <div class="chat-timestamp">
                                    {
                                        formatTimestamp(
                                            listOfChats[key].history[listOfChats[key].history.length - 1].timestamp
                                        )
                                    }
                                </div>
                                <label>{listOfChats[key].name}</label>

                                <!-- Rename chat button -->
                                <div class="rename-button">
                                    <md-icon-button on:click={() => { renameChat() }}>
                                        <i class='bx bxs-pencil'></i>
                                    </md-icon-button>
                                </div>

                                <!-- Delete chat button -->
                                <div class="delete-chat-button">
                                    <md-icon-button on:click={() => { deleteChat(key) }}>
                                        <i class='bx bxs-trash' ></i>
                                    </md-icon-button>
                                </div>

                            </div>
                        {/if}
                    {/each}
                </div>

            </div>
        </div>
    {/if}

    <!-- Chat Modal-->
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

    <!-- Share New Document Modal -->
    {#if (isSharingNewDoc)}
        <div class="share-modal">
            <div class="modal-content">

                <!-- Close List button -->
                <div class="my-button">
                    <md-icon-button on:click={showOrHideShareDocumentModal}>
                        <i class='bx bx-x'></i>
                    </md-icon-button>
                </div>

                <!-- Heading -->
                <div class="heading">
                    <i class='bx bx-share-alt'></i>
                    <strong>Vyberte dokument na zdieľanie</strong>
                </div>

                <!-- Documents to share list -->
                {#each Object.keys(listOfMyDocs) as key}
                    <div class="share-doc-option">
                        <!-- Checkbox -->
                        <input id="share-doc-option-{key}" type="checkbox" />

                        <i class='bx bx-file'></i>
                        {listOfMyDocs[key]}
                    </div>
                {/each}

                <!-- User search -->
                <div class="user-search-wrapper">
                    <div class="user-search">
                        <i class='bx bx-search'></i>
                        <input type="text" spellcheck="false" class="search" id="user-search" placeholder="Vyhľadať osobu">
                    </div>
                </div>

                <!-- Share button -->
                <button
                        class="share-confirm"
                        on:click={confirmShare}
                >
                    <i class='bx bxs-share'></i>
                    Zdieľať
                </button>

            </div>
        </div>
    {/if}

    <!-- Info Section -->
    <div class="info-section">
        <!-- List of global documents -->
        <div class="personal-documents">
            <div class="heading">
                <i class='bx bx-globe'></i>
                Zoznam všeobecných dokumentov
            </div>
            <div class="number">Počet nahratých dokumentov: <strong>{listOfGeneralDocs.length}</strong></div>

            <!-- Show / Hide general docs button -->
            {#if listOfGeneralDocs.length > 0}
                <button
                        class="show-docs-button"
                        class:is-shown={isGeneralDocsShown}
                        on:click={showOrHideGeneralDocs}
                >
                    {#if (isGeneralDocsShown)}
                        <i class='bx bxs-show'></i>
                    {:else}
                        <i class='bx bxs-hide'></i>
                    {/if}
                </button>
            {/if}

            <!-- Table of general documents  //TODO dizajn-->
            {#if (isGeneralDocsShown)}
                {#each Object.keys(listOfGeneralDocs) as key}
                    <div style="margin-top: 10px; margin-left: 70px">
                        {listOfGeneralDocs[key]}
                    </div>
                {/each}
            {/if}
        </div>

        <!-- List of personal documents -->
        <div class="personal-documents">
            <div class="heading">
                <i class='bx bx-fingerprint'></i>
                Zoznam osobných dokumentov
            </div>
            <div class="number">Počet nahratých dokumentov: <strong>{listOfMyDocs.length}</strong></div>

            <!-- Show / Hide my docs button -->
            {#if listOfMyDocs.length > 0}
                <button
                        class="show-docs-button"
                        class:is-shown={isMyDocsShown}
                        on:click={showOrHideMyDocs}
                >
                    {#if (isMyDocsShown)}
                        <i class='bx bxs-show'></i>
                    {:else}
                        <i class='bx bxs-hide'></i>
                    {/if}
                </button>
            {/if}


            <!-- Table of my documents  //TODO dizajn-->
            {#if (isMyDocsShown)}
                {#each Object.keys(listOfMyDocs) as key}
                    <div style="margin-top: 10px; margin-left: 70px">
                        {listOfMyDocs[key]}
                    </div>
                {/each}
            {/if}
        </div>

        <!-- Shared section  // TODO-->
        <div class="personal-documents">
            <!-- My shared documents -->

            <div class="heading">
                <i class='bx bx-share-alt'></i>
                Vami zdieľané dokumenty
            </div>
            <div class="number">Počet zdieľaných dokumentov: <strong>0</strong></div>

            <!-- Share your document button -->
            {#if listOfMyDocs.length > 0}
                <button
                        class="share-doc-btn"
                        on:click={() => {isSharingNewDoc = true;}}
                >
                    <i class='bx bxs-share'></i>
                    Zdieľať dokument
                </button>
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
    .portal-wrapper{
      background: var(--welcome-section-background);

      position: relative;
      width: 100%;
      height: 150vh;
    }

    //Info Section
    .portal-wrapper .info-section{
      background: rgba(100, 191, 227, 0.1);

      width: 100%;
      height: 500px;
      padding: 15px 9%;

      position: absolute;
      top: 100px;
    }

    .portal-wrapper .info-section .personal-documents{
      //background: rgba(227, 100, 134, 0.1);
      position: relative;

      width: 100%;
      height: 100px;
    }

    .portal-wrapper .info-section .personal-documents .heading{
      //position: absolute;
      text-align: left;
      color: var(--navbar-icon-color);
      font-size: 25px;
      margin-top: 30px;
      margin-left: 50px;
    }

    .portal-wrapper .info-section .personal-documents .number{
      font-size: 15px;
      margin-top: 5px;
      margin-left: 80px;

      color: var(--color-info);
    }

    .show-docs-button{
      position: absolute;
      top: 0px;
      left: 10px;

      display: inline-block;
      background: rgba(193, 9, 49, 0.5);
      color: #fff;
      //font-size: 14px;
      border-radius: 50%;
      padding: 8px;
      border: none;
    }

    .show-docs-button.is-shown{
      background: rgba(43, 98, 9, 0.5);
    }

    .show-docs-button i{
      transform: translateY(1px);
      font-size: 15px;
    }

    .show-docs-button:hover{
      transform: scale(1.02);
      cursor: pointer;
    }

    //Share new doc modal
    .portal-wrapper .share-modal{
      display: flex;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      height: 300px;
      max-width: 90%;
      background-color: rgba(0, 0, 0, 0.00001);
      z-index: 999;
      pointer-events: none;
      box-shadow: var(--box-shadow);
    }

    .portal-wrapper .share-modal .modal-content{
      width: 100%;
      height: 100%;
      background-color: var(--note-text-area-background);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--box-shadow);
      position: relative;
      pointer-events: all;
    }

    .portal-wrapper .share-modal .modal-content .heading{
      //position: absolute;
      text-align: center;
      color: var(--navbar-icon-color);
      font-size: 18px;
      margin-top: 30px;
      //margin-left: 20px;
    }

    .portal-wrapper .share-modal .modal-content .share-doc-option{
      margin-top: 15px;
      margin-left: 20px;
      text-align: left;
      color: var(--navbar-icon-color);
    }

    .portal-wrapper .share-modal .modal-content .share-confirm{
      position: absolute;
      bottom: 20px;
      left: 50%;
      translate: -50%;


      display: inline-block;
      background: #2b6209;
      color: #fff;
      font-size: 14px;
      border-radius: 8px;
      padding: 8px 15px;
      border: none;
    }

    .portal-wrapper .share-modal .modal-content .share-confirm i{
      transform: translateY(1px);
    }

    .portal-wrapper .share-modal .modal-content .share-confirm:hover{
      background: rgba(43, 98, 9, 0.95);
      transform: scale(1.02);
      cursor: pointer;
    }

    .portal-wrapper .share-modal .modal-content .user-search-wrapper{
      position: absolute;
      width: 90%;

      bottom: 20%;
      left: 20px;
    }

    .portal-wrapper .share-modal .modal-content .user-search{
      margin: 0 auto;
      position: relative;
      color: var(--search-text-color);
      border: 1px solid var(--search-text-color);
      border-radius: 8px;
    }

    .portal-wrapper .share-modal .modal-content .user-search i{
      position: absolute;
      top: 50%;
      left: 16px;
      translate: 0 -50%;
      z-index: 1;
      font-size: 20px;
      color: var(--navbar-icon-color);
    }

    .portal-wrapper .share-modal .modal-content .user-search input{
      width: 100%;
      height: 34px;
      padding-left: 46px;
      font-size: 16px;
      border: 0;
      border-radius: 8px;
      background: var(--search-background);
      color: inherit;
      font-family: inherit;
      outline: none;
    }

    //List of chats
    .portal-wrapper .modal-list{
      display: flex;
      position: fixed;
      top: 110px;
      left: 50%;
      transform: translate(-50%, 0);
      width: 400px;
      max-width: 90%;
      height: 300px;
      background-color: rgba(0, 0, 0, 0.00001);
      z-index: 999;
      pointer-events: none;
      box-shadow: var(--box-shadow);
    }

    .portal-wrapper .modal-list .modal-content {
      width: 100%;
      height: 100%;
      background-color: var(--note-text-area-background);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--box-shadow);
      position: relative;
      pointer-events: all;
    }

    .portal-wrapper .modal-list .modal-content .add-btn{
      position: absolute;
      top: 10px;
      left: 10px;

      display: inline-block;
      background: #2b6209;
      color: #fff;
      font-size: 14px;
      border-radius: 8px;
      padding: 8px 15px;
      border: none;
    }

    .portal-wrapper .modal-list .modal-content .add-btn i{
      transform: translateY(1px);
    }

    .portal-wrapper .modal-list .modal-content .add-btn:hover{
      background: rgba(43, 98, 9, 0.95);
      transform: scale(1.02);
      cursor: pointer;
    }

    //Share doc button
    .share-doc-btn{
      position: absolute;
      top: 90px;
      left: 50px;

      display: inline-block;
      background: #2b6209;
      color: #fff;
      font-size: 14px;
      border-radius: 8px;
      padding: 8px 15px;
      border: none;
    }

    .share-doc-btn i{
      transform: translateY(1px);
    }

    .share-doc-btn:hover{
      background: rgba(43, 98, 9, 0.95);
      transform: scale(1.02);
      cursor: pointer;
    }


    .portal-wrapper .modal-list .modal-content .chat-list{
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;

      margin-top: 70px;
    }

    .portal-wrapper .modal-list .modal-content .chat-list .chat-item{
      display: flex;
      align-items: center;
      gap: 20px;

      padding: 2px 45px;
    }

    .portal-wrapper .modal-list .modal-content .chat-list .chat-item.active-chat{
      background-color: rgba(88, 92, 98, 0.15);
      border: 1px solid green;
    }

    .portal-wrapper .modal-list .modal-content .chat-list .chat-item:hover{
      border: 1px solid var(--timestamp-color-bot);
    }

    .portal-wrapper .modal-list .modal-content .chat-list .chat-item .chat-timestamp{
      font-size: 11px;
      color: var(--navbar-icon-color);
    }

    .portal-wrapper .modal-list .modal-content .chat-list .chat-item label{
      color: var(--navbar-icon-color);
    }

    .portal-wrapper .modal-list .modal-content .chat-list .chat-item .rename-button i{
      color: var(--navbar-icon-color);
    }

    .portal-wrapper .modal-list .modal-content .chat-list .chat-item .delete-chat-button{
      --md-icon-button-hover-state-layer-color: red;
    }
    .portal-wrapper .modal-list .modal-content .chat-list .chat-item .delete-chat-button i{
      color: indianred;
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