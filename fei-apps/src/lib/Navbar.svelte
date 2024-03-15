<script lang="ts">
    export let loggedIn = true;

    let isNavbarOpen;
    const logOut = () => {
        loggedIn = false;
    }

    const toggleMenu = () => {
        isNavbarOpen = !isNavbarOpen;
    }
</script>

<button on:click={toggleMenu} class="burger">
    <i class='bx bx-menu'></i>
</button>


    <nav id="my-navbar" class="navbar" class:open={isNavbarOpen}>
        <div class="logo">
            <img src="logo.svg" alt="">
            <span>APPS</span>
        </div>

        <div class="search">
            <i class='bx bx-search'></i>
            <input type="text" spellcheck="false" class="search" id="search" placeholder="Zadajte hľadaný výraz">
        </div>

        <nav>
            <button><i class='bx bx-help-circle' ></i></button>
            <button><i class='bx bx-cog' ></i></button>

            <!-- Odhlasenie  -->
            <button on:click={logOut}><i class='bx bx-log-out'></i></button>

            <!-- Profilovka  -->
            <img src="logo.png" alt="">
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
        background: #fff;
        box-shadow: 0 10px 50px rgba(0, 0, 0, 0.1);
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
        color: #0039A6;
    }

    .search {
        margin: 0 auto;
        position: relative;
        color: #555;
        border: 1px solid #555;
        border-radius: 8px;
    }

    .search i {
        position: absolute;
        top: 50%;
        left: 16px;
        translate: 0 -50%;
        z-index: 1;
        font-size: 20px;
        color: inherit;
    }

    .search input {
        width: 100%;
        height: 44px;
        padding-left: 46px;
        font-size: 16px;
        border: 0;
        border-radius: 8px;
        background: #eff1f2;
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
    }

    .navbar nav img {
        flex: 0 32px;
        width: 32px;
        height: 32px;
        margin-left: 8px;
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