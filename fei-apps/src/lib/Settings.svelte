<script lang="ts">
    import '@material/web/iconbutton/icon-button.js';
    import '@material/web/fab/fab.js';

    import {isDarkModeEnabled} from "../stores";

    import { fade } from 'svelte/transition';
    import {onMount} from "svelte";

    onMount(() => {
        const allLinks = document.querySelectorAll(".tabs a");
        const allTabs = document.querySelectorAll(".tab-content");

        allLinks.forEach(link => {
            link.addEventListener('click', () => {
                const linkId = link.id;

                allLinks.forEach(l => l.classList.toggle("active", l === link));
                allTabs.forEach(tab => tab.classList.toggle("active-tab-content", tab.id === linkId));
            });
        });
    });

    //Functions
    async function saveChanges(){
        console.log("Saving settings.");
    }

    export let loggedUser;
    export let isSettingsOpen;

    let isProfileInfoCardOpen = true;
</script>

<div
        class="settings-container"
        class:dark-mode={$isDarkModeEnabled}
        in:fade={{ delay: 100 , duration: 250 }}
>

    <div
            class="heading"
    >
        <i class='bx bx-cog'></i>
        <h2>Nastavenia</h2>
    </div>

    <div class="settings">
        <div class="setting">
            <div class="setting-title">
                <label>Tmavý režim</label>
            </div>
            <div class="setting-option"></div>
        </div>

        <div class="setting">
            <div class="setting-title">
                <label>Jazyk</label>
            </div>
            <div class="setting-option"></div>
        </div>

        <div class="setting">
            <div class="setting-title">
                <label>Profil</label>
                <!-- Profile info card / editable TODO-->
                <div
                        class="profile-card-container"
                        class:dark-mode={$isDarkModeEnabled}
                        in:fade={{ delay: 100 , duration: 250 }}
                        out:fade={{ duration: 100 }}
                >
                    <div class="container">
                        <header>
                            <div class="info">
                                <div class="count">
                                    <p>{loggedUser.aisId}</p>
                                </div>
                                <p>AIS ID</p>
                            </div>

                            <div class="profile">
                                <img src="{loggedUser.photoURL}">
                                <button class="status-circle" disabled></button>
                                <!-- TODO bindnutie statusu -->
                            </div>

                            <div class="info">
                                <div class="count">
                                    <p>2. bc</p> <!-- TODO integracia AIS -->
                                </div>
                                <p>Ročník</p>
                            </div>
                        </header>

                        <div class="about">
                            <h2>{loggedUser.displayName}<i class='bx bxs-badge-check'></i></h2>
                            <p>Informačné a komunikačné technológie</p> <!-- TODO integracia AIS -->
                        </div>

                        <div class="tabs-container">
                            <ul class="tabs">
                                <li>
                                    <a id="tab-1">O mne</a>
                                </li>
                                <li>
                                    <a id="tab-2">Kontakt</a>
                                </li>
                                <li>
                                    <a id="tab-3">Siete</a>
                                </li>
                                <li id="active-tab"></li>
                            </ul>
                        </div>

                        <div class="tab-content active-tab-content" id="tab-1">
                            <p>
                                TODO vlastny text
                                <!-- TODO pridanie -->
                            </p>
                        </div>

                        <div class="tab-content" id="tab-2">
                            <div class="contact">
                                <div class="contact-type">Email:</div>
                                <div class="contact-value">{loggedUser.email}</div>
                            </div>

                            <div class="contact">
                                <div class="contact-type">Tel.č:</div>
                                <div class="contact-value">TODO</div>
                                <!-- TODO pridanie t.c-->
                            </div>
                        </div>

                        <div class="tab-content" id="tab-3">
                            <div class="social-links">
                                <a href="#"><i class='bx bxl-youtube'></i></a>
                                <!-- TODO pridanie -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="setting-option" style="background: rgba(0, 0, 0, 0.2);"></div>
        </div>


        <div class="close-settings"> <!-- TODO lepsie buttony, na ulozenie a vratenie sa
            TODO doriesit pozadie, ktore prekryva Nastavenia label
            TODO porobit options, ukladanie do databazy pre jednotlivych userov
        -->
            <md-icon-button
                    on:click={() => {
                isSettingsOpen = false;
            }}
            >
                <i class='bx bx-x'></i>
            </md-icon-button>
        </div>

        <!-- Save button
        <a on:click={saveChanges} href="#" class="save-btn">ULOŽIŤ</a>-->
    </div>
</div>

<style lang="scss">

    .settings-container{
      background: var(--welcome-section-background);
      padding: 55px 9%;
      //height: 100vh;
      position: relative;
    }

    .settings-container .heading {
      display: flex;
      gap: 20px;
      position: absolute;
      text-align: left;
      color: var(--navbar-icon-color);
      font-size: 20px;
      margin-top: 100px;
      margin-left: 6.5rem;
    }

    .settings-container .heading i{
      position: absolute;
      font-size: 25px;
      top: 7px;
      left: -30px;
    }

    .close-settings{
      position: absolute;
      top: 55px;
      right: 30px;
    }

    .settings-container .settings{
      background: var(--dotted-background-with-opacity);
      background-size: 10px 10px;
      height: 100%;
      border-radius: 50px;
      border: 3px solid rgba(0, 0, 0, 0.2);
      margin-top: 40px;

      position: relative;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .settings-container .settings .setting{
      display: flex;
      flex-direction: row;
      align-items: center;

      width: 100%;
      height: 35px;
      border: var(--setting-border);
      border-left: none;
      border-right: none;

      &:nth-child(1){
        margin-top: 100px;
      }

      &:nth-child(3){
        height: 100vh;
        align-items: start;
        border-bottom: none;
      }
    }

    .settings-container .settings .setting .setting-title{
      width: 50%;
      height: 30px;

      text-align: center;

      background: rgba(0, 0, 0, 0.2);
    }

    .settings-container .settings .setting .setting-title label{
      color: var(--navbar-icon-color);
      font-size: 18px;
    }

    .settings-container .settings .setting .setting-option{
      width: 50%;
      height: 30px;

      background: rgba(255, 255, 255, 0.2);
    }

    /*
    .settings-container .settings .save-btn {
      position: absolute;
      right: 100px;
      bottom: 55px;

      display: inline-block;
      text-decoration: none;

      background: var(--primary-button);
      color: #fff;
      font-size: 17px;
      border-radius: 8px;
      padding: 8px 15px;
    }

    .settings-container .settings .save-btn:hover {
      background: var(--primary-button--hover);
      transform: scale(1.03);
    }
     */


    // Profile info card styles ------------------------------------------------------------------
    a {
      text-decoration: none;
      cursor: pointer;
    }

    .profile-card-container {
      position: relative;  //TODO styles
      top: 60px;
      color: var(--navbar-icon-color);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .container {
      background: var(--profile-card-background);
      width: 448px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      border-radius: 16px;
      box-shadow: var(--box-shadow);
    }

    .container header {
      display: flex;
      justify-content: space-between;
      width: 100%;
      gap: 12px;
    }

    .container header .info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      font-size: 15px;
      width: 100%;
      flex-grow: 1;
    }

    .container header .info .count {
      padding: 6px;
      font-weight: 600;
      width: 100%;
      background: var(--color-card-background);
      border: 1px solid #eee;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      border-radius: 8px;
    }

    .container header .profile {
      position: relative;
      width: 400px;
    }

    .container header .profile img {
      position: relative;
      width: 100%;
      aspect-ratio: 1/1;
      object-fit: cover;
      border-radius: 50%;
      margin-top: -50%;
      border: 6px solid var(--color-background);
    }


    .status-circle{
      position: absolute;
      background: green; /* TODO */
      bottom: 15px;
      right: 10px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 2px solid var(--card-status-border);
    }

    .container .about {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .container .about h2 {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .container .about h2 i {
      color: #3d5afe;
    }

    .container .about p {
      font-size: 16px;
      color: var(--color-info);
    }

    .container .social-links {
      display: flex;
      gap: 16px;
    }

    .container .social-links a {
      background: transparent;
      padding: 8px;
      display: flex;
      width: 48px;
      height: 48px;
      align-items: center;
      justify-content: center;
      border: 1px solid #eee;
      color: var(--navbar-icon-color);
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .container .social-links a i {
      font-size: 26px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .container .social-links a:hover {
      border: 1px solid var(--primary-button--hover);
    }

    .container .social-links a:hover i {
      color: var(--primary-button--hover);
    }

    .container .tabs-container {
      overflow-x: auto;
      margin-bottom: 4px;
      width: 100%;
    }

    .container .tabs-container .tabs {
      position: relative;
      display: flex;
      border: 1px solid #ccc;
      border-radius: 8px;
      list-style: none;
    }

    .container .tabs-container .tabs li {
      /*z-index: 2;*/
    }

    .container .tabs-container .tabs li a {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--navbar-icon-color);
      min-width: 112px;
      outline: none;
      padding: 12px 16px;
      white-space: nowrap;
      transition: all 0.3s ease;
    }

    .container .tabs-container .tabs li a:hover,
    .container .tabs-container .tabs li a.active {
      color: var(--tab-link-hover);
    }

    .container .tabs-container #active-tab {
      position: absolute;
      width: 100%;
      width: 112px;
      height: 100%;
      background: var(--tab-active-color);
      /*z-index: 1;*/
      border-radius: 8px;
      transition: all 0.5s ease;
    }

    .container .tab-content {
      display: none;
      overflow-y: auto;
    }

    .container .active-tab-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      height: 100px;
      padding: 0 4px;
      font-size: 15px;
      margin-bottom: 5px;
      color: var(--color-info);
    }

    .container .tab-content .contact{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 250px;
    }


    .container .tabs-container .tabs li:nth-child(1):has(.active)~#active-tab {
      transform: translateX(0);
    }

    .container .tabs-container .tabs li:nth-child(2):has(.active)~#active-tab {
      transform: translateX(112px);
    }

    .container .tabs-container .tabs li:nth-child(3):has(.active)~#active-tab {
      transform: translateX(224px);
    }

    //===========================================================================
</style>