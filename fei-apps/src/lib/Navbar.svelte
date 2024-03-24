<script lang="ts">
    import firebaseApp from "../firebase";
    import {getAuth, signOut} from "firebase/auth";
    const auth = getAuth(firebaseApp);

    export let loggedIn = true;
    export let isDarkModeEnabled = false;
    export let loggedUser;

    let isNavbarOpen = false;
    async function logOut(){
        //TODO firebase logic
        signOut(auth)
            .then(() =>{
                console.log("Successfully signed out.");
            })
            .catch((error) => {
                console.log("Error when signing out.", error);
            });

        loggedUser = "";
        loggedIn = false;
    }

    const toggleNavbarOpen = () => {
        isNavbarOpen = !isNavbarOpen;
    }

    const toggleDarkMode = () => {
        isDarkModeEnabled = !isDarkModeEnabled;
    }
</script>

<button on:click={toggleNavbarOpen}
        class="burger"
        class:dark-mode={isDarkModeEnabled}
>
    <i class='bx bx-menu'></i>
</button>


    <nav id="my-navbar" class="navbar"
         class:open={isNavbarOpen}
         class:dark-mode={isDarkModeEnabled}
    >
        <div class="logo">
            {#if !isDarkModeEnabled}
                <img src="logo.svg">
            {:else}
                <img src="logo-dark-mode.svg">
            {/if}

            <span>APPS</span>
        </div>

        <div class="search">
            <i class='bx bx-search'></i>
            <input type="text" spellcheck="false" class="search" id="search" placeholder="Zadajte hľadaný výraz">
        </div>

        <nav>
            <!-- Tlacidlo na prepinanie darkmode -->
            {#if !isDarkModeEnabled}
                <button
                        on:click={toggleDarkMode}
                        data-tooltip="Tmavý režim"
                ><i class='bx bx-moon'></i></button>
            {:else}
                <button
                        on:click={toggleDarkMode}
                        data-tooltip="Svetlý režim"
                ><i class='bx bxs-sun'></i></button>
            {/if}


            <button data-tooltip="Nastavenia"><i class='bx bx-cog'></i></button>

            <!-- Odhlasenie  -->
            <button
                    on:click={logOut}
                    data-tooltip="Odhlásiť sa"
            ><i class='bx bx-log-out'></i></button>

            <!-- Profilovka  -->
            <img src="{loggedUser.photoURL}" alt="">
        </nav>
    </nav>


<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap');

    * {
        box-sizing: border-box;
    }

    button {
        display: grid;
        place-items: center;
        width: 40px;
        height: 72px;
        border: 0;
        padding: 0;
        background: transparent;
        color: #585c62;
        cursor: pointer;
        font-family: inherit;
    }

    .burger {
        position: fixed;
        z-index: 2;
        top: 5px;
        left: 5px;
        width: 72px;
    }

    .burger i{
        font-size: 25px;
        color: var(--navbar-icon-color);
    }

    .navbar {
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        height: 100%;
        padding: 20px 24px 0;
        display: flex;
        gap: 10px;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        background: var(--color-background);
        box-shadow: var(--box-shadow) ; /*0 10px 50px rgba(0, 0, 0, 0.1)*/
        transition-property: translate, opacity, visibility;
        transition-duration: 0.5s;
        translate: -100% 0;
        visibility: hidden;
        opacity: 0;
    }

    #my-navbar.open{ /* Pre navbar nefunguje */
        opacity: 1;
        visibility: visible;
        translate: 0 0;
    }

    .logo {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 108px;
        padding-right: 10px;
        margin-bottom: 10px;
    }

    .logo img {
        width: 70px;
    }

    .logo span {
        font-size: 24px;
        font-weight: bold;
        text-decoration: none;
        color: var(--primary-color-heading);
    }

    .search {
        margin: 0 auto;
        position: relative;
        color: var(--search-text-color);
        border: 1px solid var(--search-text-color);
        border-radius: 8px;
    }

    .search i {
        position: absolute;
        top: 50%;
        left: 16px;
        translate: 0 -50%;
        z-index: 1;
        font-size: 20px;
        color: var(--navbar-icon-color);
    }

    .search input {
        width: 100%;
        height: 44px;
        padding-left: 46px;
        font-size: 16px;
        border: 0;
        border-radius: 8px;
        background: var(--search-background);
        color: inherit;
        font-family: inherit;
        outline: none;
    }

    .navbar nav {
        display: flex;
        align-items: center;
        padding-right: 20px;
    }

    .navbar nav i{
        font-size: 25px;
        color: var(--navbar-icon-color);
    }

    .navbar nav button{
        position: relative;
    }

    .navbar nav button::before {
        --scale: 0;

        --translate-y: 60%;

        position: absolute;
        bottom: -.25rem;
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

    .navbar nav button:hover::before {
        --scale: 1;
    }

    .navbar nav img {
        flex: 0 32px;
        width: 32px;
        height: 32px;
        margin-left: 8px;
        border-radius: 50%;
    }

    @media (width >=500px) {
        .navbar {
            translate: 0 0;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
            gap: 0;
            width: 100%;
            height: 100px;
            padding: 0 0 0 72px;
        }

        .logo {
            margin-bottom: 0;
        }

        .search {
            flex: 1 1 auto;
        }

        .burger {
            visibility: hidden;
        }
    }

    @media (width >=550px) {
        .search {
            flex: 0 0 auto;
        }
    }

    @media (width >=600px) {
        .navbar {
            opacity: 1;
            visibility: visible;
        }


    }

    @media (width >=750px) {
        .search input {
            width: 280px;
        }
    }

    @media (width >=1000px) {
        .search input {
            width: 580px;
        }
    }
</style>