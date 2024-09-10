<script lang="ts">
    import { fade } from 'svelte/transition';
    import {isDarkModeEnabled} from "../stores";
    async function startFeiConnections(){
        console.log("Starting FEI Connections...");
    }

    async function startFeiResources(){
        console.log("Starting FEI Resources...");
    }

    async function startFeiQuizzes(){
        console.log("Starting FEI Quizzes...");
    }

    async function startFeiChess(){
        console.log("Starting FEI Chess...");
    }
</script>

<div
        class="widgets-container"
        class:dark-mode={$isDarkModeEnabled}
>
    <div class="heading">
        <h2>Zoznam aplikácií</h2>
    </div>

    <div class="box-container">
        <div class="box" in:fade={{ delay: 50 , duration: 250 }}>
            <i class='bx bxs-school'></i>
            <h3>STUDENT PORTAL</h3>
            <p>Prehľad známok, účasť na cvičeniach, miesta odovzdania, termíny skúšok. Všetko dôležité na jednom mieste.</p>
            <a href="#" class="btn">SPUSTIŤ</a>
        </div>

        <div class="box" in:fade={{ delay: 100 , duration: 250 }}>
            <i class='bx bxs-network-chart'></i>
            <h3>CONNECTIONS</h3>
            <p>Vyhľadajte kohokoľvek na FEIke. Súkromné správy, hromadné informácie v skupinových chatoch.</p>
            <a on:click={startFeiConnections} href="http://localhost:5175/" target="_blank" class="btn">SPUSTIŤ</a>
        </div>

        <div class="box" in:fade={{ delay: 150 , duration: 250 }}>
            <i class='bx bxs-building-house' ></i>
            <h3>ACCOMMODATION</h3>
            <p>Odkaz na nový ubytovací systém STU. Platby za internát, poradovníky, rezervácie a prenechanie izieb.</p>
            <a href="https://ubytovanie.stuba.sk/new/sk/informacie/" target="_blank" class="btn">SPUSTIŤ</a>
        </div>

        <div class="box" in:fade={{ delay: 200 , duration: 250 }}>
            <i class='bx bxs-chess'></i>
            <h3>CHESS</h3>
            <p>Chceš si zahrať šach so spolužiakmi alebo prednášajúcimi? Na tomto mieste, iba proti FEIkárom. </p>
            <a on:click={startFeiChess} href="http://localhost:5177/" class="btn">SPUSTIŤ</a>
        </div>

        <div class="box" in:fade={{ delay: 250 , duration: 250 }}>
            <i class='bx bx-chalkboard'></i>
            <h3>QUIZZES</h3>
            <p>Blíži sa zápočet alebo skúška? Otestujte svoje vedomosti z daného predmetu v kvízoch</p>
            <a on:click={startFeiQuizzes} href="http://localhost:5176/" target="_blank" class="btn">SPUSTIŤ</a>
        </div>

        <div class="box" in:fade={{ delay: 300 , duration: 250 }}>
            <i class='bx bx-file'></i>
            <h3>RESOURCES</h3>
            <p>Portál študijných materiálov...</p>
            <a on:click={startFeiResources} href="http://localhost:5174/" target="_blank" class="btn">SPUSTIŤ</a>
        </div>
    </div>
</div>


<style>
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
</style>
