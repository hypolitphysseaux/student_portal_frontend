<script lang="ts">
    import {onMount} from "svelte";
    import { fade } from 'svelte/transition';

    import { v4 as uuidv4 } from 'uuid';
    import {doc, getFirestore, onSnapshot, updateDoc, getDoc, arrayUnion, setDoc, arrayRemove} from "firebase/firestore";
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

    async function addNote(){
        try {
            const userNotesRef = doc(db, "notes", loggedUser.uid);
            const userNotesDoc = await getDoc(userNotesRef);

            if (!userNotesDoc.exists()) {
                await setDoc(userNotesRef, { // Use setDoc to create the document
                    notes: [{
                        noteId: uuidv4(),
                        title: "Nadpis",
                        isImporatant: false,
                        content: "Sem zadajte text.",
                        created: new Date()
                    }]
                });

                return;
            }

            await updateDoc(userNotesRef, {
                notes: arrayUnion({
                    noteId: uuidv4(),
                    title: "Nadpis",
                    isImporatant: false,
                    content: "Sem zadajte text.",
                    created: new Date()
                })
            });

            console.log("Note added successfully!");
        } catch (error) {
            console.error("Error adding note:", error);
        }
    }

    async function deleteNote(noteId){
        try {
            const userNotesRef = doc(db, "notes", loggedUser.uid);

            const userNotesDoc = await getDoc(userNotesRef);

            if (!userNotesDoc.exists()) {
                console.error("User's note document not found.");
                return;
            }

            let notes = userNotesDoc.data().notes;

            const noteIndex = notes.findIndex(note => note.noteId === noteId);

            if (noteIndex === -1) {
                console.error("Note not found in user's document.");
                return;
            }

            notes.splice(noteIndex, 1);

            await updateDoc(userNotesRef, {
                notes: notes
            });

        } catch (error) {
            console.error("Error deleting note:", error);
        }
    }

    async function deleteAllNotes(){
        try {
            const userNotesRef = doc(db, "notes", loggedUser.uid);
            const userNotesDoc = await getDoc(userNotesRef);

            if (!userNotesDoc.exists()) {
                console.error("User's note document not found.");
                return;
            }

            let notes = userNotesDoc.data().notes;

            notes = [];

            await updateDoc(userNotesRef, {
                notes: notes
            });

            console.log("All notes for user deleted successfully!");
        } catch (error) {
            console.error("Error deleting notes:", error);
        }
    }

    async function toggleStar(noteId){
        try {
            const userNotesRef = doc(db, "notes", loggedUser.uid);
            const userNotesDoc = await getDoc(userNotesRef);

            if (!userNotesDoc.exists()) {
                console.error("User's note document not found.");
                return;
            }

            let notes = userNotesDoc.data().notes;
            const noteIndex = notes.findIndex(note => note.noteId === noteId);

            if (noteIndex === -1) {
                console.error("Note not found in user's document.");
                return;
            }

            const importance = notes[noteIndex].isImportant;
            delete notes[noteIndex].isImportant;
            notes[noteIndex].isImportant = !importance;

            // Update only the isImportant field of the specific note within the array
            await updateDoc(userNotesRef, {
                'notes': notes
            });

            console.log("Note star toggled successfully!");
        } catch (error) {
            console.error("Error toggling note star:", error);
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
        {#if notes.length === 0}
            <span
                    class="no-notes-label"
                    in:fade={{ delay: 200 , duration: 250 }}
                    out:fade={{ duration: 100 }}
            >Nemáte žiadne poznámky</span>
        {/if}

        {#each notes as note}
            <div
                    class="note"
                    id={note.noteId}
                    in:fade={{ delay: 100 , duration: 250 }}
                    out:fade={{ duration: 100 }}
            >
                <div class="star-mark">
                    <md-icon-button on:click={() => toggleStar(note.noteId)}>
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


    <!-- Buttons -->
    <button
            class="add-btn"
            on:click={addNote}
    >
        <i class='bx bx-plus'></i>
        Pridať poznámku
    </button>

    <button
            class="delete-all-btn"
            on:click={deleteAllNotes}
    >
        <i class='bx bxs-trash-alt'></i>
        Odstrániť všetky poznámky
    </button>
</div>




<style>
    .notes-container {
        background: var(--color-card-background);
        padding: 15px 9%;
        padding-bottom: 50px;
        box-shadow: var(--box-shadow) ; /* 0 5px 10px rgba(0, 0, 0, .1) */
    }

    .notes-container .add-btn{
        display: inline-block;
        background: var(--primary-button);
        color: #fff;
        font-size: 14px;
        border-radius: 8px;
        padding: 8px 15px;
        border: none;
    }

    .notes-container .add-btn i{
        transform: translateY(1px);
    }

    .notes-container .add-btn:hover{
        background: var(--primary-button--hover);
        transform: scale(1.01);
        cursor: pointer;
    }

    .notes-container .delete-all-btn{
        display: inline-block;
        background: indianred;
        color: #fff;
        font-size: 14px;
        border-radius: 8px;
        padding: 8px 15px;
        border: none;
    }

    .notes-container .delete-all-btn i{
        transform: translateY(1px);
    }

    .notes-container .delete-all-btn:hover{
        background: #f35353;
        transform: scale(1.01);
        cursor: pointer;
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

    .notes-container .notes .no-notes-label{
        color: var(--color-info);
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