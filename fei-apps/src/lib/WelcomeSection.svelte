<script lang="ts">

    export let isDarkModeEnabled;
    export let loggedUser;
</script>

<div
        class="welcome-section-container"
        class:dark-mode={isDarkModeEnabled}
>
    <div class="user-left">
        <div class="welcome-heading">
            <h1>Vitajte, <strong>{loggedUser.displayName}</strong> !</h1>
        </div>

        <div class="user-section">
            <img class="profile-photo" src="{loggedUser.photoURL}">
            <div class="status-circle"></div>
        </div>

        <div class="ais-id-label">
            <label>[ais id]</label>
        </div>
    </div>

    <div class="time-center">
        <h3 class="time-heading">Čas</h3>

    </div>

    <div class="stats-right">
        <div class="stats-heading">
            <h3>[stats]</h3>
        </div>
    </div>
</div>

<style>
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
        display: none;
        opacity: 0;
        visibility: hidden;
    }

    .user-section{
        position: relative;
        display: flex;
        flex-direction: row;
    }

    .profile-photo{
        width: 64px;
        height: 64px;
        border-radius: 50%;
    }

    .status-circle{
        position: absolute;
        bottom: 0;
        left: 45px;
        background: green; /*Online*/
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 1px solid black;
    }

    .status-circle:hover{
        cursor: pointer;
        transform: scale(1.15);
        transition: .2s ease;
    }

    .ais-id-label{
        color: var(--navbar-icon-color);
    }

    .stats-right{
        display: none;
    }

    .stats-heading{
        color: var(--navbar-icon-color);
    }

    .time-heading{
        color: var(--navbar-icon-color);
    }

    @media (width >=600px){
        .welcome-heading{
            display: inline-block;
            opacity: 1;
            visibility: visible;
        }
    }

    @media (width >=1000px){
        .stats-right{
            display: inline-block;
        }
    }
</style>