<script lang="ts">

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