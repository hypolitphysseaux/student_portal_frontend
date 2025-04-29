
<script lang="ts">
    import { onMount } from "svelte";
    import {
        isDarkModeEnabled,
        isNotificationVisible,
        currentApp,
        notificationText, loggedUser,
        storageOptions,
        permissions
    } from "../stores";

    import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";
    import { auth } from "../firebase";

    const storage = getStorage();

    let documentInput;
    let fileName;
    let progress;

    let selectedStorage = "Moje dokumenty";
    let storageRef;

    onMount(() => {
        console.log("Portal document section loaded.");


        // Load all document pools (admin only)
        if ($loggedUser.role !== "USER" && $permissions.canManageDocumentPools){
            loadDocumentPools();
        }

        //Listener pre document input
        documentInput = document.getElementById("document-input");

        documentInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file){
                fileName = file.name;
            }
        });

    });

    async function loadDocumentPools() {
        const documentsRef = ref(storage, 'documents/');
        try {
            const result = await listAll(documentsRef);
            const folders = result.prefixes.map((folderRef) => folderRef.fullPath);

            // Add personal document pool
            const updatedFolders = [
                ...folders,
                'Moje dokumenty'
            ];

            storageOptions.set(updatedFolders);
        } catch (error) {
            console.error("Chyba pri načítavaní úložísk:", error);
        }
    }

    async function syncDocument( user , storage, document , type ){

        const response = await fetch('http://localhost:8000/syncDocument', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: user.uid,
                storage: storage,
                document: document,
                type: type
            })
        });

        const data = await response.json();

        //Notification
        requestAnimationFrame(() => {
            notificationText.set(`Nahraný dokument bol úspešne spracovaný.`);
            isNotificationVisible.set(true);

            setTimeout(() => {
                notificationText.set("");
                isNotificationVisible.set(false);
            }, 3000);
        });

        console.log(data);
    }

    async function uploadDocument(){
        const file = documentInput.files[0];
        const label = document.getElementById("document-file-upload");

        if (!file){
            label.focus();
            return;
        }

        fileName = file.name;
        const fileType = fileName.split(".")[1];

        // Storage option for roles
        if ($permissions.canManageDocumentPools){
            if (selectedStorage == "Moje dokumenty"){
                storageRef = ref(storage, `users/${auth.currentUser.uid}/${fileName}`);
            }
            else {
                storageRef = ref(storage, `${selectedStorage}/${fileName}`);
            }
        }
        else if (!($permissions.canManageDocumentPools)){
            storageRef = ref(storage, `users/${auth.currentUser.uid}/${fileName}`);
        }



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
            async () => {
                progress = "";

                const downloadUrl = await getDownloadURL(storageRef);

                //Notification
                requestAnimationFrame(() => {
                    notificationText.set(`Dokument bol úspešne nahraný do ${selectedStorage}.`);
                    isNotificationVisible.set(true);

                    //Sync document with vector database
                    syncDocument( $loggedUser , selectedStorage, downloadUrl , fileType );

                    setTimeout(() => {
                        notificationText.set("");
                        isNotificationVisible.set(false);
                    }, 3000);
                });

                documentInput.value = "";
                fileName = "";
            }
        );
    }

</script>

<div
        class="documents-wrapper"
        class:dark-mode={$isDarkModeEnabled}
        class:admin-height={$loggedUser.role === "ADMIN" || $permissions.canManageDocumentPools}
>
    <div class="heading">
        Nahratie dokumentov
    </div>

    <div class="info">
        <i class='bx bx-info-circle'></i>
        V portáli môžete nahrať vlastné dokumenty, na ktoré sa môžete spýtať svojho AI pomocníka.
    </div>

    <!-- Global document upload for admin -->
    {#if ($permissions.canManageDocumentPools && $loggedUser.role !== "USER")}
        <div class="document-pool-options">
            <label for="storage-select">
                Vyberte úložisko:
                <i class='bx bxs-badge-check'></i>
            </label>
            <select id="storage-select" bind:value={selectedStorage}>
                {#each $storageOptions as option}
                    <option value={option}>
                        {option}
                    </option>
                {/each}
            </select>
        </div>
    {/if}

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

  .admin-height{
    height: 350px;
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

  .documents-wrapper .info i{
    font-size: 25px;
    transform: translateY(3.5px);
  }

  .file-upload-wrapper{
    position: relative;
    display: flex;
    gap: 10px;

    margin-top: 20px;
  }

  //Document pool options
  .document-pool-options{
    //background-color: rgba(100, 191, 227, 0.5);
    display: flex;
    margin-top: 25px;
  }

  .document-pool-options label {
    font-weight: bold;
    width: 200px;
    color: var(--navbar-icon-color);
  }

  .document-pool-options select {
    width: 500px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: var(--search-background);
    cursor: pointer;
    color: var(--navbar-icon-color);
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

  .progress{
    color: var(--navbar-icon-color);
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