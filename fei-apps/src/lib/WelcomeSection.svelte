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

        <img class="profile-photo" src="{loggedUser.photoURL}">
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
        padding-top: 200px;
        padding-bottom: 50px;

        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .welcome-heading{
        color: var(--navbar-icon-color);
    }

    .profile-photo{
        width: 64px;
        height: 64px;
        border-radius: 50%;
    }

    .ais-id-label{
        color: var(--navbar-icon-color);
    }

    .stats-heading{
        color: var(--navbar-icon-color);
    }

    .time-heading{
        color: var(--navbar-icon-color);
    }
</style>