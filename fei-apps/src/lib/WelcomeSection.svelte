<script lang="ts">
    import { onMount , onDestroy } from "svelte";
    import { fade } from 'svelte/transition';

    import { db , auth } from "../firebase";

    import { doc, onSnapshot, updateDoc } from "firebase/firestore";
    import { updateProfile } from "firebase/auth";

    import {
        isDarkModeEnabled ,
        loggedUser ,
        userStatus,
        statusColor ,
        isNotificationVisible ,
        notificationText
    } from "../stores";

    import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
    const storage = getStorage();

    var activeUsers;
    var lastLogin;

    let isChangingStatus = false;
    let isChangingPhoto = false;

    let progress;

    onMount(() => {
        const degree = 6;

        const hr = document.getElementById('hr');
        const min = document.getElementById('min');
        const sec = document.getElementById('sec');

        setInterval(() => {
            const date = new Date();

            const hh = date.getHours() * 30;
            const mm = date.getMinutes() * degree;
            const ss = date.getSeconds() * degree;

            hr.style.transform = `rotateZ(${hh + (mm / 12)}deg)`;
            min.style.transform = `rotateZ(${mm}deg)`;
            sec.style.transform = `rotateZ(${ss}deg)`;
        });

        //Listener pre pocet aktivnych userov
        const activeUsersListener = onSnapshot(doc(db, "userDetails", "activeUsers"), (doc) => {
            if (doc.exists()){
                activeUsers = doc.data().number;
            }
        });

        //Listener pre status
        const statusListener = onSnapshot(doc(db, "userDetails", auth.currentUser.uid), (doc) => {
            if (doc.exists()){
                if (doc.data().status == "online"){
                    userStatus.set("online");
                    statusColor.set("#23b223");

                    //$loggedUser.status = "online";
                }
                if (doc.data().status == "away"){
                    userStatus.set("away");
                    statusColor.set("#ffea00");

                    //$loggedUser.status = "away";
                }
                if (doc.data().status == "busy"){
                    userStatus.set("busy");
                    statusColor.set("#f35353");

                    //$loggedUser.status = "busy";
                }
                if (doc.data().status == "hidden"){
                    userStatus.set("hidden");
                    statusColor.set("gray");

                    //$loggedUser.status = "hidden";
                }
            }
        });


        //Lastlogin sa lisi pri Google Provider, treba osetrit
        if ($loggedUser.metadata !== undefined){
            lastLogin = $loggedUser.metadata.lastLoginAt;
        }else {
            lastLogin = $loggedUser.lastLoginAt;
        }
    });

    onDestroy(() => {
        //TODO dispose
    });

    async function changingStatus(){
        isChangingStatus = !isChangingStatus;
    }

    function updateProfilePicture(){

        const fileInput = document.getElementById("profile-picture-input");
        const file = fileInput.files[0];
        const label = document.getElementById("custom-file-upload");

        if (!file){
            label.focus();
            return;
        }

        // 1. Vytvorte referenciu na umiestnenie obrázka v Storage
        const storageRef = ref(storage, `users/${auth.currentUser.uid}/profile.jpg`);

        // 2. Vytvorte úlohu na nahratie súboru
        const uploadTask = uploadBytesResumable(storageRef, file);

        // 3. Sledujte priebeh nahrávania
        uploadTask.on('state_changed',
            (snapshot) => {
                progress = Math.trunc((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            },
            (error) => {
                console.error('Chyba pri nahrávaní:', error); //TODO label
            },
            () => {
                progress = "";
                // 4. Získajte URL nahratého obrázka
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    updateProfile(auth.currentUser, {
                        photoURL: downloadURL
                    }).then(() => {
                        //Refresh loggedUser
                        loggedUser.set(auth.currentUser);

                        //Notification
                        notificationText.set("Profilová fotka bola úspešne zmenená.");
                        isNotificationVisible.set(true);
                        setTimeout(() => {
                            notificationText.set("");
                            isNotificationVisible.set(false);
                        }, 3000);


                        isChangingPhoto = false;
                    }).catch((error) => {
                        // Nastala chyba
                        // ...
                    });
                });
            }
        );
    }


    async function  updateStatus(stat){
        const docRef = doc(db, "userDetails", auth.currentUser.uid);

        await updateDoc(docRef, {
            status: stat
        });

        isChangingStatus = false;
    }
</script>

<div
        class="welcome-section-container"
        class:dark-mode={$isDarkModeEnabled}
        in:fade={{ delay: 100 , duration: 250 }}
>
    <div class="user-left">
        {#if $userStatus == "busy"}
            <i class='bx bx-bell-off' style="font-size: 20px; color: var(--navbar-icon-color);"></i>
        {/if}
        <div class="welcome-heading">
            <h1>Vitajte, <strong>{$loggedUser.displayName}</strong> !</h1>
        </div>

        <div class="user-section">
            <img on:click={() => {isChangingPhoto = true}} class="profile-photo" src="{$loggedUser.photoURL}">

            <!-- Profile picture input -->
            {#if isChangingPhoto}
                <div class="file-upload-wrapper">
                    <label
                            id="custom-file-upload"
                            for="profile-picture-input"
                            class="custom-file-upload"
                            tabindex="0"
                    >
                        <i class='bx bx-upload'></i>
                        Nahrajte fotku
                    </label>
                    <input id="profile-picture-input" class="profile-picture-input" type="file">
                </div>

                <!-- Proceed button -->
                <div
                        class="my-button proceed"
                        data-tooltip="Zmeniť profilovú fotku"
                >
                    <md-icon-button on:click={updateProfilePicture}>
                        <i class='bx bxs-right-arrow-circle'></i>
                    </md-icon-button>
                </div>

                <!-- Close button -->
                <div
                        class="my-button close"
                        data-tooltip="Zavrieť"
                >
                    <md-icon-button on:click={() => {isChangingPhoto = false}}>
                        <i class='bx bxs-x-circle'></i>
                    </md-icon-button>
                </div>

                <!-- Progress -->
                {#if progress}
                    <div class="progress">
                        {progress}%
                    </div>
                {/if}
            {/if}

            <button on:click={changingStatus} class="status-circle" style="background: {$statusColor}"></button>

            {#if isChangingStatus}
                <div class="mdc-list">
                    <div class="mdc-list-item" on:click|preventDefault={() => updateStatus("online")}>
                        <div class="status-circle-list-icon" style="background: #23b223"></div>
                        <span class="mdc-list-item__ripple"></span>
                        <span class="mdc-list-item__text">K dispozícií</span>
                    </div>
                    <div class="mdc-list-item" on:click|preventDefault={() => updateStatus("away")}>
                        <div class="status-circle-list-icon" style="background: #ffea00"></div>
                        <span class="mdc-list-item__ripple"></span>
                        <span class="mdc-list-item__text">Preč</span>
                    </div>
                    <div class="mdc-list-item" on:click|preventDefault={() => updateStatus("busy")}>
                        <div class="status-circle-list-icon" style="background: #f35353"></div>
                        <span class="mdc-list-item__ripple"></span>
                        <span class="mdc-list-item__text">Nemám čas</span>
                    </div>
                    <div class="mdc-list-item" on:click|preventDefault={() => updateStatus("hidden")}>
                        <div class="status-circle-list-icon" style="background: gray"></div>
                        <span class="mdc-list-item__ripple"></span>
                        <span class="mdc-list-item__text">Neviditeľný</span>
                    </div>
                </div>
            {/if}
        </div>

        <div class="ais-id-label">
            <label><strong>AIS:</strong>{" " + $loggedUser.aisId}</label>
        </div>
    </div>

    <div class="time-center">
        <div class="container">
            <div class="clock">
                <div class="clock-bg">
                    <img src="/clock.png">
                </div>

                <div class="hour">
                    <span class="hr" id="hr"></span>
                </div>

                <div class="minute">
                    <span class="min" id="min"></span>
                </div>

                <div class="second">
                    <span class="sec" id="sec"></span>
                </div>
            </div>
        </div>
    </div>

    <div class="stats-right">
        <div class="stats-container">
            <div class="stat">Počet aktívnych uživateľov: <strong style="font-size: 20px">{activeUsers}</strong></div>
            <div class="stat">
                Naposledy ste boli prihlásený/á: <strong>{lastLogin}</strong>
            </div>
            <div class="stat">Počet nových správ: <strong style="font-size: 20px">0</strong></div>
        </div>
    </div>
</div>

<style lang="scss">

    @use "@material/list";
    @include list.deprecated-core-styles;


    .mdc-list{
      position: absolute;
      left: 80px;
      background: var(--status-list-background);
      color: var(--navbar-icon-color);
      border-radius: 8px;
      box-shadow: var(--box-shadow);
    }

    .welcome-section-container{
        background: var(--welcome-section-background);
        padding: 15px 9%;
        padding-top: 150px;
        padding-bottom: 50px;

        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .user-left{
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .welcome-heading{
        color: var(--navbar-icon-color);
    }

    .user-section{
        position: relative;
        display: flex;
        flex-direction: row;

        gap: 10px;
    }

    .profile-photo{
        width: 64px;
        height: 64px;
        border-radius: 50%;
    }

    .profile-photo:hover{
      cursor: pointer;
      transform: scale(1.02);
    }

    .status-circle{
        position: absolute;
        bottom: 0;
        left: 45px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 1px solid var(--status-border);
    }

    .status-circle:hover{
        cursor: pointer;
        transform: scale(1.15);
        transition: .2s ease;
    }

    .status-circle-list-icon{
      top: 10px;
      margin-right: 20px;
      margin-top: 3px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1px solid black;
    }

    .ais-id-label{
        color: var(--navbar-icon-color);
    }

    .time-center{
        display: none;
        align-items: center;
        justify-content: center;
        height: 250px;
    }

    .container {
        position: relative;
        transform: scale(.8);
    }

    .clock {
        width: 270px;
        height: 270px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid rgba(255, 255, 255, .1);
        border-radius: 50%;
        backdrop-filter: blur(15px);
        background: var(--clock-background);
        box-shadow: 0 0 30px rgba(0, 0, 0, .2);
    }

    .clock .clock-bg img {
        width: 100%;
        height: 100%;
    }

    .clock::before {
        content: '';
        position: absolute;
        width: 15px;
        height: 15px;
        background: #fff;
        border-radius: 50%;
        z-index: 15;
    }

    .clock .hour,
    .clock .minute,
    .clock .second {
        position: absolute;
    }

    .clock .hour,
    .clock .hour .hr {
        width: 160px;
        height: 160px;
    }

    .clock .minute,
    .clock .minute .min {
        width: 190px;
        height: 190px;
    }

    .clock .second,
    .clock .second .sec {
        width: 230px;
        height: 230px;
    }

    .clock .hour .hr,
    .clock .minute .min,
    .clock .second .sec {
        display: flex;
        justify-content: center;
        position: absolute;
        border-radius: 50%;
    }

    .clock .hour .hr::before {
        content: '';
        position: absolute;
        width: 8px;
        height: 80px;
        background: #c10931;
        border-radius: 10px;
    }

    .clock .minute .min::before {
        content: '';
        position: absolute;
        width: 6px;
        height: 110px;
        background: #3b7dd5;
        border-radius: 8px;
        z-index: 11;
    }

    .clock .second .sec::before {
        content: '';
        position: absolute;
        width: 3px;
        height: 140px;
        background: #fff;
        z-index: 12;
        border-radius: 8px;
    }

    .stats-right{
        display: none;
        position: relative;
        width: 300px;
        height: 220px;
        left: 50px;
        backdrop-filter: blur(15px);
        background: var(--clock-background);
        box-shadow: 0 0 30px rgba(0, 0, 0, .2);
        border: 2px solid rgba(255, 255, 255, .1);
    }

    .stats-container{
        position: absolute;
        top: 10px;
        left: 10px;

        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
        gap: 40px;
    }

    .stat{
        color: white;
    }

    //Profile picture input
    .user-section .file-upload-wrapper{
        position: relative;
        display: inline-block;

        margin-left: 20px;
    }

    .user-section .file-upload-wrapper .custom-file-upload{
        display: inline-block;
        padding: 10px 20px;
        background-color: var(--primary-button);
        color: white;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        border: 1px solid var(--primary-button);
        border-radius: 5px;
        text-align: center;
        transition: transform 0.3s ease-in-out;
    }

    .user-section .file-upload-wrapper .custom-file-upload:hover{
        background-color: var(--primary-button--hover);
        border-color: var(--primary-button--hover);
    }

    .user-section .file-upload-wrapper .custom-file-upload:focus{
        background-color: var(--primary-button--hover);
        border-color: white;
    }

    .user-section .file-upload-wrapper .profile-picture-input{
        display: none;
    }

    .proceed i{
      color: rgba(43, 98, 9);
    }

    .close i{
      color: indianred;
    }

    .proceed::before{
      left: 80%;
    }

    .close::before{
      left: 94.5%;
    }

    .my-button::before {
      --scale: 0;

      --translate-y: 160%;

      position: absolute;

      transform: translateX(-50%) translateY(var(--translate-y, 0)) scale(var(--scale));
      transition: 300ms transform;
      transform-origin: top center;
      //left: 20%;
      content: attr(data-tooltip);
      color: white;
      padding: .5rem;
      border-radius: 8px;
      text-align: center;
      width: max-content;
      background: var(--tooltip-color);
    }

    .my-button:hover::before {
      --scale: 1;
    }

    .progress{
      color: var(--navbar-icon-color);
    }

    @media (width >=600px){
        .time-center{
            display: flex;
        }
    }


    @media (width >=1000px){
        .stats-right{
            display: inline-block;
        }
    }
</style>