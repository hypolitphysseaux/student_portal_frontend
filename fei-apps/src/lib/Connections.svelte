<script lang="ts">
    import { onMount , onDestroy } from "svelte";
    import {
        isDarkModeEnabled,
        loggedUser,
        notificationText,
        isNotificationVisible,
        notificationType, currentChat
    } from "../stores";

    //FIRESTORE
    import { doc, getDoc, onSnapshot, updateDoc, arrayUnion, setDoc, deleteField } from "firebase/firestore";
    import { auth, db } from "../firebase";
    import {listAll, ref} from "firebase/storage";
    import {v4 as uuidv4} from "uuid";


    // Variables


    // Functions
    onMount(async () => {
        console.log("Connections loaded.");
    });

    onDestroy(async () => {
        console.log("Connections closed.");
    });

</script>


<div
        class="connections-wrapper"
        class:dark-mode={$isDarkModeEnabled}
>
    <h1 style="color: white;">CONNECTIONS APP</h1>
</div>



<style lang="scss">

  .connections-wrapper{
    background: var(--welcome-section-background);

    position: relative;
    width: 100%;
    height: 150vh;
  }
</style>