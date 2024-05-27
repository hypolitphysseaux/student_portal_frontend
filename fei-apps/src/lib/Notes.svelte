<script lang="ts">
    import {onMount} from "svelte";
    import Swiper from 'swiper/bundle';
    import 'swiper/css/bundle';
    import '@material/web/button/filled-tonal-button.js'
    import '@material/web/button/filled-button.js'

    onMount(() => {
        const swiper = new Swiper('.swiper', {
            slidesPerView: 1,

            pagination: {
                el: '.swiper-pagination',
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
        });
    });

    export let isDarkModeEnabled;
</script>

<div
        class="notes-container"
        class:dark-mode={isDarkModeEnabled}
>
    <div class="heading">
        <h2>Poznámky</h2>
    </div>

    <div class="notes">

        <div class="swiper">
            <!-- Additional required wrapper -->
            <div class="swiper-wrapper">
                <!-- Slides -->
                <div class="swiper-slide">Slide 1</div>
                <div class="swiper-slide">Slide 2</div>
                <div class="swiper-slide">Slide 3</div>
            </div>

            <!-- If we need navigation buttons -->
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
        </div>
        
        <md-filled-tonal-button>
            Pridať poznámku
        </md-filled-tonal-button>

        <md-filled-button>
            Odstrániť všetky poznámky
        </md-filled-button>
    </div>
</div>




<style>
    .notes-container {
        background: var(--color-card-background);
        padding: 15px 9%;
        padding-bottom: 50px;
        box-shadow: var(--box-shadow) ; /* 0 5px 10px rgba(0, 0, 0, .1) */
    }

    .notes-container .heading {
        position: absolute;
        text-align: left;
        color: var(--navbar-icon-color);
        font-size: 20px;
        margin-top: 50px;
    }

    .notes-container .notes {
        /*
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
        gap: 15px;
         */
        margin-top: 150px;
    }

</style>