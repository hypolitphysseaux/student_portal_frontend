
<script lang="ts">
    import { onMount } from "svelte";
    import { isDarkModeEnabled, loggedUser } from "../stores";
    import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
    import { auth } from "../firebase";

    const storage = getStorage();

    let documentInput;
    let fileName;
    let progress;


    onMount(() => {
        console.log("Portal document section loaded.");

        //Listener pre document input
        documentInput = document.getElementById("document-input");

        documentInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file){
                fileName = file.name;
            }
        });

    });




    function uploadDocument(){
        const file = documentInput.files[0];
        const label = document.getElementById("document-file-upload");

        if (!file){
            label.focus();
            return;
        }

        fileName = file.name;
        //TODO pripony??

        // 1. Vytvorte referenciu na umiestnenie dokumentu v Storage
        const storageRef = ref(storage, `users/${auth.currentUser.uid}/${fileName}`);

        // 2. Vytvorte úlohu na nahratie súboru
        const uploadTask = uploadBytesResumable(storageRef, file);

        // 3. Sledujte priebeh nahrávania
        uploadTask.on('state_changed',
            (snapshot) => {
                progress = Math.trunc((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            },
            (error) => {
                console.error('Chyba pri nahrávaní dokumentu:', error); //TODO label
            },
            () => {
                progress = "";
                documentInput.value = "";
                fileName = "";
                alert("Dokument bol úspešne nahratý.");
            }
        );
    }

</script>

<div
        class="documents-wrapper"
        class:dark-mode={$isDarkModeEnabled}
>
    <div class="heading">
        Nahratie dokumentov
    </div>

    <div class="info">
        <i class='bx bx-info-circle'></i>
        V portáli môžete nahrať vlastné dokumenty, na ktoré sa môžete spýtať svojho AI pomocníka.
    </div>


    <div class="file-upload-wrapper">
        <label
                id="document-file-upload"
                for="document-input"
                class="custom-file-upload"
                tabindex="0"
        >
            <i class='bx bx-upload'></i>
            {#if !(fileName)}
                Nahrajte dokument
            {:else}
                {fileName}
            {/if}

        </label>
        <input id="document-input" class="document-input" type="file">

        <!-- Proceed button -->
        <div
                class="my-button proceed"
                data-tooltip="Pokračovať"
        >
            <md-icon-button on:click={uploadDocument}>
                <i class='bx bxs-right-arrow-circle'></i>
            </md-icon-button>
        </div>

        <!-- Delete button -->
        <div
                class="my-button close"
                data-tooltip="Zmazať dokument"
        >
            <md-icon-button on:click={() => {
                documentInput.value = "";
                fileName = "";
            }}>
                <i class='bx bxs-x-circle'></i>
            </md-icon-button>
        </div>

        <!-- Progress -->
        {#if progress}
            <div class="progress">
                {progress}%
            </div>
        {/if}

    </div>


</div>


<style lang="scss">
  .documents-wrapper{
    position: relative;
    background: var(--color-card-background);
    padding: 15px 9%;
    padding-bottom: 50px;


    width: 100%;
    height: 250px;
    box-shadow: var(--box-shadow);
  }

  .documents-wrapper .heading {
    //position: absolute;
    text-align: left;
    color: var(--navbar-icon-color);
    font-size: 25px;
    margin-top: 50px;
  }

  .documents-wrapper .info{
    margin-top: 10px;
    color: var(--color-info);
  }

  .file-upload-wrapper{
    position: relative;
    display: flex;
    gap: 10px;

    margin-top: 20px;
  }

  .file-upload-wrapper .custom-file-upload{
    display: inline-block;
    padding: 10px 20px;
    background-color: var(--primary-button);
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    border: 1px solid var(--primary-button);
    border-radius: 5px;
    text-align: center;
    transition: transform 0.3s ease-in-out;
  }

  .file-upload-wrapper .custom-file-upload:hover{
    background-color: var(--primary-button--hover);
    border-color: var(--primary-button--hover);
  }

  .file-upload-wrapper .custom-file-upload:focus{
    background-color: var(--primary-button--hover);
    border-color: white;
  }

  .file-upload-wrapper .document-input{
    display: none;
  }

  .proceed i{
    color: rgba(43, 98, 9);
  }

  .close i{
    color: indianred;
  }


  .my-button::before {
    --scale: 0;

    --translate-y: 130%;

    position: absolute;

    transform: translateX(-35%) translateY(var(--translate-y, 0)) scale(var(--scale));
    transition: 300ms transform;
    transform-origin: top center;
    //left: 15%;
    content: attr(data-tooltip);
    color: white;
    padding: .5rem;
    border-radius: 8px;
    text-align: center;
    width: max-content;
    background: var(--tooltip-color);
  }

  .my-button:hover::before {
    --scale: 1;
  }
</style>