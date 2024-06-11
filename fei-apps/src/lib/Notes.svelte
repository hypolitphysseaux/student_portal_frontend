<script lang="ts">
    import {onMount} from "svelte";
    import { fade } from 'svelte/transition';
    import {doc, getFirestore, onSnapshot, updateDoc} from "firebase/firestore";
    import firebaseApp from "../firebase";
    import '@material/web/button/filled-tonal-button.js'
    import '@material/web/button/filled-button.js'

    import '@material/web/iconbutton/icon-button.js'
    import '@material/web/fab/fab.js'

    const db = getFirestore(firebaseApp);

    //Nacitat moje poznamky z databazy
    var notes = [];

    onMount(async () => {
        //Listener pre notes
        const myNotes = onSnapshot(doc(db, "notes", loggedUser.uid), (doc) => {
            if (doc.exists()){
                //Vymazat ?
                notes = [];

                // Nacitanie poznamok
                for (let i = 0; i < doc.data().notes.length; i++){
                    notes.push(doc.data().notes[i]);
                }

                //Zobrazit dolezite ako prve
                notes.sort((a, b) => b.isImportant - a.isImportant);
                notes = [...notes];
            }
        });

    });

    async function addNote(){}

    async function deleteNote(noteId){
        //Odstranit z databazy

        notes = notes.filter(note => note.noteId !== noteId);
    }
    async function deleteAllNotes(){
        //Odstranit z databazy, listener a each statement?
    }

    async function toggleStar(noteId){
        let note = document.getElementById(noteId);

        if (note){
            //Updatnut v databaze
            //Styl bude v svelte if statement, treba listener?
        }
    }

    export let isDarkModeEnabled;
    export let loggedUser;
</script>

<div
        class="notes-container"
        class:dark-mode={isDarkModeEnabled}
>
    <div class="heading">
        <h2>Poznámky</h2>
    </div>

    <div class="notes">
        {#each notes as note}
            <div
                    class="note"
                    id={note.noteId}
                    in:fade={{ delay: 100 , duration: 250 }}
                    out:fade={{ duration: 100 }}
            >
                <div class="star-mark">
                    <md-icon-button on:click={toggleStar}>
                        {#if note.isImportant}
                            <i class='bx bxs-star'></i>
                        {:else}
                            <i class='bx bx-star'></i>
                        {/if}
                    </md-icon-button>
                </div>

                <div class="delete-button">
                    <md-icon-button on:click|preventDefault={() => deleteNote(note.noteId)}>
                        <i class='bx bxs-trash-alt'></i>
                    </md-icon-button>
                </div>

                <div class="note-title">
                    {note.title}
                </div>

                <div class="note-content">
                    {note.content}
                </div>
            </div>
        {/each}
    </div>


    <!-- Buttons //TODO nastylovat -->
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

        /*
        display: flex;
        flex-direction: row;*/
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
        gap: 15px;
    }

    .notes-container .notes .note{
        /*height: 250px;
        width: 400px;
        */

        position: relative;
        box-shadow: var(--box-shadow);
        border-radius: 8px;
        background: var(--search-background);
        text-align: center;
        padding: 120px 100px;

        &:hover{
            transform: scale(1.02);
            box-shadow: var(--note-hover);
        }
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
        color: var(--navbar-icon-color);
    }

    .notes-container .notes .note .note-content{
        position: absolute;
        top: 25%;
        left: 10%;
        margin-right: 10%;

        color: var(--color-info);
        height: 150px;
        overflow: auto;
    }

    /* SCROLLBAR */
    /* width */
    ::-webkit-scrollbar {
        width: 5px;
    }
    /* Track */
    ::-webkit-scrollbar-track {
        background: var(--search-background);
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: var(--primary-button);
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: var(--primary-button--hover);
    }
</style>