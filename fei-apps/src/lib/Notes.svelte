<script lang="ts">
    import {onMount} from "svelte";
    import '@material/web/button/filled-tonal-button.js'
    import '@material/web/button/filled-button.js'

    import '@material/web/iconbutton/icon-button.js'
    import '@material/web/fab/fab.js'


    onMount(() => {
        //Nacitat moje poznamky z databazy
        let notes = [];

        //Zobrazit dolezite ako prve
    });

    async function addNote(){}
    async function deleteNote(){}
    async function deleteAllNotes(){}
    async function toggleStar(){}

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
        <!-- {each} ? -->

        <div class="note">
            <div class="star-mark">
                <md-icon-button on:click={toggleStar}>
                    <i class='bx bx-star'></i>
                </md-icon-button>
            </div>

            <div class="delete-button">
                <md-icon-button on:click={deleteNote}>
                    <i class='bx bxs-trash-alt'></i>
                </md-icon-button>
            </div>

            <div class="note-title">
                Title
            </div>

        </div>


        <div class="note">
            <div class="star-mark">
                <md-icon-button on:click={toggleStar}>
                    <i class='bx bx-star'></i>
                </md-icon-button>
            </div>

            <div class="delete-button">
                <md-icon-button on:click={deleteNote}>
                    <i class='bx bxs-trash-alt'></i>
                </md-icon-button>
            </div>

            <div class="note-title">
                Title
            </div>

        </div>

    </div>

    <md-filled-tonal-button
        on:click={addNote}
    >
        Pridať poznámku
    </md-filled-tonal-button>

    <md-filled-button
        on:click={deleteAllNotes}
    >
        Odstrániť všetky poznámky
    </md-filled-button>
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
        margin-top: 150px;
        margin-bottom: 20px;

        display: flex;
        flex-direction: row;
        gap: 15px;
    }

    .notes-container .notes .note{
        height: 250px;
        width: 400px;

        background: var(--search-background);
        border: 2px solid var(--navbar-icon-color);
        border-radius: 8px;

        position: relative;

    }

    .notes-container .notes .note .delete-button{
        position: absolute;
        top: 5px;
        right: 5px;
        --md-icon-button-hover-state-layer-color: red;
    }

    .notes-container .notes .note .delete-button i{
        color: #f35353;
    }

    .notes-container .notes .note .star-mark{
        position: absolute;
        top: 5px;
        left: 5px;
        --md-icon-button-hover-state-layer-color: goldenrod;
    }

    .notes-container .notes .note .star-mark i{
        color: goldenrod;
    }

    .notes-container .notes .note .note-title{
        position: absolute;
        top: 5px;
        left: 50%;
        transform: translateX(-50%);
        overflow: hidden;

        font-size: 30px;
        color: #1d1d1d;
    }
</style>