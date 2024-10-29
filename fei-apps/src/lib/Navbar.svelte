<script lang="ts">
    import { db , auth } from "../firebase";

    import { navigate } from "svelte-routing";

    import { signOut } from "firebase/auth";
    import { doc, increment, updateDoc } from "firebase/firestore";

    import '@material/web/iconbutton/icon-button.js';
    import '@material/web/fab/fab.js';

    import { isDarkModeEnabled , loggedIn, loggedUser , currentApp , isChatModalOpen } from "../stores";

    export let isProfileInfoCardOpen = false;

    let isNavbarOpen = false;


    //General functions
    async function setUserDetails(uid){
        const docRef = doc(db, "userDetails", uid);

        await updateDoc(docRef, {
            status: "offline",
            prefersDarkTheme: $isDarkModeEnabled
        });
    } //po odhlaseni (teda status offline)

    async function decrementActiveUsers(){
        const docRef = doc(db, "userDetails", "activeUsers");

        await updateDoc(docRef, {
            number: increment(-1)
        });
    } // Znizi pocet online userov o 1
    // ! limitacia, iba raz za sekundu

    async function logOut(){

        //Ak je spustená aplikácia, neodhlasujeme - iba presmerujeme na dashboard
        if ($currentApp){
            currentApp.set("");
            isChatModalOpen.set(false);
            navigate("/dashboard" , { replace: true });
            return;
        }

        //Inak odhlasujeme usera z hlavnej aplikacie
        const user = auth.currentUser;

        //Nastavenie user details pred odhlasenim
        setUserDetails(user?.uid);

        signOut(auth)
            .then(() =>{
                decrementActiveUsers();
                isProfileInfoCardOpen = false;
                loggedUser.set("");
                currentApp.set("");
                loggedIn.set(false);
                navigate("/login" , { replace : true });
            })
            .catch((error) => {
                console.log("Error when signing out.", error);
            });
    } // Odhlasenie

    const toggleNavbarOpen = () => {
        isNavbarOpen = !isNavbarOpen;
    } // Otvorenie / Zatvorenie navbaru

    const toggleDarkMode = () => {
        isDarkModeEnabled.set(!$isDarkModeEnabled);
        //isDarkModeEnabled = !isDarkModeEnabled;
    } // Prepinanie modu

    const showProfileInfoCard = () => {
        isProfileInfoCardOpen = true;
    } // Otvorenie


    //Portal functions
    async function sendQuery() {
        const query_input = document.getElementById('query') || new HTMLElement();

        if (!query_input.value){
            query_input.focus();
            return;
        }

        //TODO zistit, ci to nie je prikaz


        //Otvorenie chatu a pridanie query do chatu
        isChatModalOpen.set(true);

        const response = await fetch('http://localhost:8000/generateResponse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query_input.value })
        });

        const data = await response.json();

        console.log(data);

        /* //TODO streamovanie odpovedi z backendu
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let resultText = '';

        // Čítanie streamovaných dát
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            resultText += decoder.decode(value, { stream: true });
            document.getElementById('response').innerText = resultText;
        }
         */
    }
</script>

<div
        class="my-button burger"
        class:dark-mode={$isDarkModeEnabled}
>
    <md-icon-button on:click={toggleNavbarOpen}>
        {#if !isNavbarOpen}
            <i class='bx bx-menu'></i>
        {:else}
            <i class='bx bx-x'></i>
        {/if}

    </md-icon-button>
</div>


    <nav id="my-navbar" class="navbar"
         class:open={isNavbarOpen}
         class:dark-mode={$isDarkModeEnabled}
    >
        <div class="logo">
            {#if !$isDarkModeEnabled}
                <img src="logo.svg">
            {:else}
                <img src="logo-dark-mode.svg">
            {/if}

            {#if (!$currentApp)}
                <span>APPS</span>
            {:else}
                <!-- Ak je spustena ina appka, zobrazim jej nazov -->
                <span>{$currentApp.toUpperCase()}</span>
            {/if}

        </div>

        {#if (!$currentApp)}
            <div class="search">
                <i class='bx bx-search'></i>
                <input type="text" spellcheck="false" class="search" id="search" placeholder="Zadajte hľadaný výraz">
            </div>
        {/if}

        {#if ($currentApp === "portal")}
            <!-- Portal search -->

            <div class="search">
                <!-- Chat history button -->
                <div class="my-button history">
                    <md-icon-button on:click={() => { isChatModalOpen.set(true) }}>
                        <i class='bx bx-history'></i>
                    </md-icon-button>
                </div>

                <i class='bx bx-search'></i>
                <input
                        type="text"
                        spellcheck="false"
                        class="search"
                        id="query"
                        placeholder="Opýtajte sa ma na čokoľvek."
                        on:keydown={(e) => {
                            if (e.key === 'Enter') sendQuery();
                        }}
                />

                <!-- Send Query Button -->
                <div class="my-button">
                    <md-icon-button on:click={sendQuery}>
                        <i class='bx bxs-up-arrow-circle'></i>
                    </md-icon-button>
                </div>

            </div>
        {/if}


        <nav>
            <!-- Tlacidlo na prepinanie darkmode -->
            {#if !$isDarkModeEnabled}
                <div
                        class="my-button"
                        data-tooltip="Tmavý režim"
                >
                    <md-icon-button on:click={toggleDarkMode}>
                        <i class='bx bx-moon'></i>
                    </md-icon-button>
                </div>

            {:else}
                <div
                        class="my-button"
                        data-tooltip="Svetlý režim"
                >
                    <md-icon-button on:click={toggleDarkMode}>
                        <i class='bx bxs-sun'></i>
                    </md-icon-button>
                </div>
            {/if}

            <!-- Tlacidlo na otvorenie nastaveni -->
            {#if !$currentApp}  <!-- Nastavenia chcem iba v hlavnej aplikacii -->
                <div
                        class="my-button"
                        data-tooltip="Nastavenia"
                >
                    <md-icon-button
                            on:click={() => {
                            navigate("/settings" , { replace : true });
                        }}
                    >
                        <i class='bx bx-cog'></i>
                    </md-icon-button>
                </div>
            {/if}



            <!-- Odhlasenie  -->
            {#if (!$currentApp)}
                <div
                        class="my-button"
                        data-tooltip="Odhlásiť sa"
                >
                    <md-icon-button on:click={logOut}>
                        <i class='bx bx-log-out'></i>
                    </md-icon-button>
                </div>

            {:else} <!-- Iba presmerovanie do hlavnej aplikacie namiesto odhlasenia -->
                <div
                        class="my-button"
                        data-tooltip="Odísť z aplikácie"
                >
                    <md-icon-button on:click={logOut}>
                        <i class='bx bx-x-circle'></i>
                    </md-icon-button>
                </div>
            {/if}



            <!-- Profilovka  -->
            <img on:click={showProfileInfoCard} src="{$loggedUser.photoURL}">
        </nav>
    </nav>


<style lang="scss">
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
        top: 15px;
        left: 15px;

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

    .search .my-button{
        position: absolute;
        top: 50%;
        right: 0px;
        translate: 45px -50%;
        display: none;
    }

    .search .my-button i{
        z-index: 1;
        font-size: 25px;
        left: 8px;
    }

    .search .history{
      left: 0px;
      translate: -45px -50%;
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

    .navbar nav .my-button{
        position: relative;
    }

    .navbar nav .my-button::before {
        --scale: 0;

        --translate-y: 120%;

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

    .navbar nav .my-button:hover::before {
        --scale: 1;
    }

    .navbar nav img {
        flex: 0 32px;
        width: 32px;
        height: 32px;
        margin-left: 8px;
        border-radius: 50%;
    }

    .navbar nav img:hover{
        transform: scale(1.1);
        cursor: pointer;
        transition: ease-in .1s;
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
        .search .my-button{
            display: flex;
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