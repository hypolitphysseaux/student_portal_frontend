<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from 'svelte/transition';

    import { isDarkModeEnabled, statusColor, loggedUser } from "../stores";

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

    const closeProfileInfoCard = () => {
        isProfileInfoCardOpen = false;
    };

    export let isProfileInfoCardOpen = false;
</script>

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
                    <p>{$loggedUser.aisId}</p>
                </div>
                <p>AIS ID</p>
            </div>

            <div class="profile">
                <img src="{$loggedUser.photoURL}">
                <button class="status-circle" style="background: {$statusColor}"></button>
            </div>

            <div class="info">
                <div class="count">
                    <p>2. bc</p>
                </div>
                <p>Ročník</p>
            </div>
        </header>

        <div class="about">
            <h2>
                {$loggedUser.displayName}

                <!-- Admin badge -->
                {#if $loggedUser.role == "ADMIN"}
                    <i class='bx bxs-badge-check'></i>
                {/if}
            </h2>
            <p>Informačné a komunikačné technológie</p>
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
                <!--
                <li>
                    <a href="#comments" id="tab-4">Comments</a>
                </li>
                -->
                <li id="active-tab"></li>
            </ul>
        </div>

        <div
                class="tab-content active-tab-content"
                id="tab-1"
        >
            <p
                    class="about-me-paragraph"
            >
                {$loggedUser.aboutMe}
            </p>

        </div>

        <div class="tab-content" id="tab-2">
            <div class="contact">
                <div class="contact-type">Email:</div>
                <div class="contact-value">{$loggedUser.email}</div>
            </div>

            <div class="contact">
                <div class="contact-type">Tel.č:</div>
                <div class="contact-value">TODO</div>
            </div>
        </div>

        <div class="tab-content" id="tab-3">
            <div class="social-links">
                <a href="#"><i class='bx bxl-youtube'></i></a>
                <a href="#"><i class='bx bxl-linkedin-square' ></i></a>
                <a href="#"><i class='bx bxl-github'></i></a>
                <a href="#"><i class='bx bxl-twitter' ></i></a>
                <a href="#"><i class='bx bxl-instagram-alt'></i></a>
                <a href="#"><i class='bx bxl-facebook-circle'></i></a>
            </div>
        </div>

        <div
                class="my-button"
                data-tooltip="Zavrieť"
        >
            <md-icon-button on:click={closeProfileInfoCard}>
                <i class='bx bx-x'></i>
            </md-icon-button>
        </div>
    </div>
</div>



<style>
    a {
        text-decoration: none;
        cursor: pointer;
    }

    .profile-card-container {
        position: fixed;
        top: 150px;
        right: 0px;
        color: var(--navbar-icon-color);
        display: flex;
        align-items: end;
        justify-content: center;
        flex-direction: column;
        /*height: 100vh;*/
        /*width: fit-content;*/
        z-index: 3;
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


    .my-button{
        /*align-self: end;*/
    }

    .my-button i{
        font-size: 25px;
        color: var(--navbar-icon-color);
    }

    .my-button::before {
        --scale: 0;

        --translate-y: 100%;

        position: absolute;
        bottom: 5px;
        left: 50%;
        transform: translateX(-50%) translateY(var(--translate-y, 0)) scale(var(--scale));
        transition: 300ms transform;
        transform-origin: top center;

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

    .about-me-paragraph{
        padding: 20px;
    }

    /*
    .container button {
        background-color: #3d5afe;
        color: #fff;
        padding: 10px 16px;
        border-radius: 8px;
        width: 100%;
        border: none;
        cursor: pointer;
        font-size: 15px;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .container button:hover {
        background-color: #304ffe;
    }*/
</style>