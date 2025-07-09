<script lang="ts">
    import { onMount , onDestroy } from "svelte";
    import { fade } from 'svelte/transition';
    import {
        isDarkModeEnabled,
        isPlayingGame,
        playedGame,
        notificationText,
        notificationType,
        isNotificationVisible
    } from "../stores";

    //FIRESTORE
    import { doc, getDoc, onSnapshot, updateDoc, arrayUnion, setDoc, deleteField } from "firebase/firestore";
    import { auth, db } from "../firebase";
    import {listAll, ref} from "firebase/storage";
    import {v4 as uuidv4} from "uuid";

    // Functions
    onMount(async () => {
        console.log("Funzone loaded.");
    });

    onDestroy(async () => {
        console.log("Funzone closed.");
    });

    async function playSinglePlayerStone(){
        isPlayingGame.set(true);
        playedGame.set("stone");
    }

    async function playMultiPlayerStone(){
        isPlayingGame.set(true);
        playedGame.set("stone-multiplayer");
    }

    async function playChess(){
        //Notification
        requestAnimationFrame(() => {
            notificationText.set(`Momentálne nie je k dispozícii.`);
            notificationType.set("error");
            isNotificationVisible.set(true);

            setTimeout(() => {
                notificationText.set("");
                isNotificationVisible.set(false);
            }, 3000);
        });

        return;
    }

    async function playSnake(){
        //Notification
        requestAnimationFrame(() => {
            notificationText.set(`Momentálne nie je k dispozícii.`);
            notificationType.set("error");
            isNotificationVisible.set(true);

            setTimeout(() => {
                notificationText.set("");
                isNotificationVisible.set(false);
            }, 3000);
        });

        return;
    }

</script>


<div
        class="funzone-wrapper"
        class:dark-mode={$isDarkModeEnabled}
>

    <div
            class="widgets-container"
            class:dark-mode={$isDarkModeEnabled}
    >
        <div class="heading">
            <h2>Zoznam hier</h2>
        </div>

        <div class="box-container">
            <!-- TODO zmenit ikony -->

            <div class="box" in:fade={{ delay: 50 , duration: 250 }}>
                <i class='bx bxs-school'></i>
                <h3>CHESS</h3>
                <p>Pridat popis.</p>
                <a on:click={ playChess } class="btn">SPUSTIŤ</a>
            </div>

            <div class="box" in:fade={{ delay: 100 , duration: 250 }}>
                <i class='bx bxs-network-chart'></i>
                <h3>STONE DESTRUCTOR</h3>
                <p>Pridat popis.</p>
                <a on:click={ playSinglePlayerStone } class="btn">SINGLEPLAYER</a>
                <a on:click={ playMultiPlayerStone } class="btn-multiplayer">MULTIPLAYER</a>
            </div>

            <div class="box" in:fade={{ delay: 50 , duration: 250 }}>
                <i class='bx bxs-school'></i>
                <h3>SNAKE</h3>
                <p>Pridat popis.</p>
                <a on:click={ playSnake }  class="btn">SPUSTIŤ</a>
            </div>

        </div>
    </div>
</div>



<style lang="scss">

  .funzone-wrapper{
    background: var(--welcome-section-background);

    position: relative;
    width: 100%;
    height: 55vh;
  }

  // From AppWidgets
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap');

  *{
    outline: none;
    text-decoration: none;
    transition: .2s linear;
  }

  .widgets-container {
    background: var(--dotted-background);
    background-size: 10px 10px;
    padding: 15px 9%;
    padding-bottom: 50px;
    box-shadow: var(--box-shadow) ; /* 0 5px 10px rgba(0, 0, 0, .1) */

    margin-top: 100px;
  }

  /* Zoznam aplikacii */
  .widgets-container .heading {
    position: absolute;
    text-align: left;
    color: var(--primary-color-heading);
    font-size: 20px;
    margin-top: 50px;
  }

  .widgets-container .box-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
    gap: 15px;
    margin-top: 150px;
  }

  .widgets-container .box-container .box {
    position: relative;
    /*box-shadow: 0 5px 10px rgba(0, 0, 0, .2);*/
    box-shadow: var(--box-shadow);
    border-radius: 8px;
    background: var(--color-card-background);
    text-align: center;
    padding: 30px 20px;
  }

  .widgets-container .box-container .box i{
    font-size: 50px;
    color: var(--navbar-icon-color);;
  }

  .widgets-container .box-container .box h3 {
    color: var(--primary-color-heading);
    font-size: 22px;
    padding: 10px 0;
  }

  .widgets-container .box-container .box p {
    color: var(--color-info);
    font-size: 15px;
    font-weight: 600;
    line-height: 2;
  }

  .widgets-container .box-container .box .btn {
    margin-top: 10px;
    display: inline-block;
    position: absolute;
    right: 15px;
    top: 25px;
    background: var(--primary-button);
    color: #fff;
    font-size: 17px;
    border-radius: 8px;
    padding: 8px 15px;
    cursor: pointer;
  }

  .widgets-container .box-container .box .btn-multiplayer {
    margin-top: 10px;
    display: inline-block;
    position: absolute;
    left: 15px;
    top: 25px;
    background: red;
    color: #fff;
    font-size: 17px;
    border-radius: 8px;
    padding: 8px 15px;
    cursor: pointer;
  }




  .widgets-container .box-container .box:hover {
    box-shadow: var(--box-shadow--hover);
    transform: scale(1.03);
    background: var(--color-card-background--hover);
    /*background: radial-gradient(circle, rgba(237, 237, 237, 0.7) 2px, #fafafa 0px);
    background-size: 10px 10px;*/
  }

  .widgets-container .box-container .box .btn:hover {
    background: var(--primary-button--hover);
  }

  .widgets-container .box-container .box .btn-multiplayer:hover {
    background: darkred;
  }

</style>