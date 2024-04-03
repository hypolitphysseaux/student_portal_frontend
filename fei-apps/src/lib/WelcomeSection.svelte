<script lang="ts">

    import {onMount} from "svelte";

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
    });

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
        <div class="container">
            <div class="circle"></div>
            <div class="circle"></div>

            <div class="clock">
                <div class="clock-bg">
                    <img src="../../public/clock.png">
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
        justify-content: space-around;
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
        border: 1px solid rgba(255,255,255,0.1);
    }

    .status-circle:hover{
        cursor: pointer;
        transform: scale(1.15);
        transition: .2s ease;
    }

    .ais-id-label{
        color: var(--navbar-icon-color);
    }

    .time-center{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 250px;
    }

    .container {
        position: relative;
        transform: scale(.8);
    }

    .container .circle {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        animation: 3s ease-in infinite alternate;
    }

    .container .circle:nth-child(1) {
        width: 140px;
        height: 140px;
        top: -30px;
        left: -30px;
        background: linear-gradient(#decc2f, #d26923);
        animation-name: move-up;
    }

    @keyframes move-up {
        to {
            transform: translateY(-10px);
        }
    }

    .container .circle:nth-child(2) {
        width: 120px;
        height: 120px;
        bottom: -20px;
        right: -20px;
        background: linear-gradient(#314cd2, #4aacd3);
        animation-name: move-down;
    }

    @keyframes move-down {
        to {
            transform: translateY(10px);
        }
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
        background: #0b3b7a;
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
    }

    .stats-heading{
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