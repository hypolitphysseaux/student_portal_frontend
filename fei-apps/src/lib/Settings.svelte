<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from 'svelte/transition';

    import { navigate } from "svelte-routing";
    import { getStorage, ref, uploadBytes, listAll, deleteObject, getMetadata } from "firebase/storage";

    import {
        isDarkModeEnabled,
        loggedUser,
        statusColor,
        notificationText,
        isNotificationVisible,
        notificationType,
        storageOptions,
        roleOptions,
        permissions
    } from "../stores";

    import '@material/web/iconbutton/icon-button.js';
    import '@material/web/fab/fab.js';
    import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
    import { db } from "../firebase";

    const storage = getStorage();

    let isAddingNewRole = false;
    let isAddingNewStorage = false;

    let isDeletingRole = false;
    let isDeletingStorage = false;

    let selectedStorage = "Moje dokumenty";
    let selectedRole = "ADMIN";

    let isEditingAboutText = false;

    onMount( async () => {
        const allLinks = document.querySelectorAll(".tabs a");
        const allTabs = document.querySelectorAll(".tab-content");

        // Load all document pools and roles
        loadDocumentPools();
        loadRoleOptions();

        allLinks.forEach(link => {
            link.addEventListener('click', () => {
                const linkId = link.id;

                allLinks.forEach(l => l.classList.toggle("active", l === link));
                allTabs.forEach(tab => tab.classList.toggle("active-tab-content", tab.id === linkId));
            });
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

    async function loadRoleOptions(){
        const rolesRef = doc(db, "userDetails", "roles");
        const roleDoc = await getDoc(rolesRef);

        if (roleDoc.exists()){
            const data = roleDoc.data();

            const result = Object.entries(data).map(([roleName, permissionArray]) => ({
                role: roleName,
                ...permissionArray[0]
            }));

            roleOptions.set(result);

            console.log($roleOptions);
        }
    }

    const toggleDarkMode = () => {
        isDarkModeEnabled.set(!$isDarkModeEnabled);
        //isDarkModeEnabled = !isDarkModeEnabled;
    }

    async function saveAboutMe(){
        const newAboutMe = document.getElementById("about-me").value.trim();
        if (!newAboutMe || (newAboutMe == $loggedUser.aboutMe)){
            isEditingAboutText = false;
            return;
        }

        const userDocRef = doc(db, "userDetails", $loggedUser.uid);
        try {
            await updateDoc(userDocRef, {
                aboutMe: newAboutMe
            });

            isEditingAboutText = false;
            $loggedUser.aboutMe = newAboutMe;

            setTimeout(() => {
                navigate("/settings" , { replace: true });
            }, 50);
        } catch (error) {
            console.error("Chyba pri ukladaní About Me:", error);
        }
    }

    async function addNewRole(){
        const newRoleNameInput = document.getElementById("role-name");

        // Check input
        if (!newRoleNameInput.value.trim()){
            newRoleNameInput.focus();
            return;
        }

        const newRoleName = newRoleNameInput.value.trim().toUpperCase();

        const rolesRef = doc(db, "userDetails", "roles");
        const docSnap = await getDoc(rolesRef);
        const rolesData = docSnap.data();

        // Check if role already exists
        if (rolesData[newRoleName]) {
            isAddingNewRole = false;

            //Notification
            requestAnimationFrame(() => {
                notificationText.set(`Rola "${newRoleName}" už existuje.`);
                notificationType.set("error");
                isNotificationVisible.set(true);

                setTimeout(() => {
                    notificationText.set("");
                    notificationType.set("");
                    isNotificationVisible.set(false);
                }, 3000);
            });

            return;
        }

        rolesData[newRoleName] = [
            {
                canManageDocumentPools: false,
                canManageRoles: false
            }
        ];

        await setDoc(rolesRef, rolesData);
        isAddingNewRole = false;

        //Notification
        requestAnimationFrame(() => {
            notificationText.set(`Rola "${newRoleName}" bola úspešne pridaná.`);
            isNotificationVisible.set(true);

            loadRoleOptions();
            selectedRole = newRoleName;

            setTimeout(() => {
                notificationText.set("");
                isNotificationVisible.set(false);
            }, 3000);
        });

    }

    async function deleteRole(){

        // Cannot delete ADMIN and USER roles for now
        if (selectedRole == "ADMIN" || selectedRole == "USER"){
            isDeletingRole = false;

            //Notification
            requestAnimationFrame(() => {
                notificationText.set(`Rolu "${selectedRole}" nie je možné odstrániť.`);
                notificationType.set("error");
                isNotificationVisible.set(true);

                setTimeout(() => {
                    notificationText.set("");
                    notificationType.set("");
                    isNotificationVisible.set(false);
                }, 3000);
            });
            return;
        }

        const rolesRef = doc(db, "userDetails", "roles");
        const docSnap = await getDoc(rolesRef);

        if (docSnap.exists()){
            const rolesData = docSnap.data();

            delete rolesData[selectedRole];
            await setDoc(rolesRef, rolesData);

            isDeletingRole = false;

            // Notification
            requestAnimationFrame(() => {
                notificationText.set(`Rola "${selectedRole}" bola úspešne odstránená.`);
                isNotificationVisible.set(true);

                loadRoleOptions();
                selectedRole = "ADMIN";

                setTimeout(() => {
                    notificationText.set("");
                    isNotificationVisible.set(false);
                }, 3000);
            });
        }

    }

    async function addNewStorage(){
        const newStorageNameInput = document.getElementById("storage-name");

        // Check input
        if (!newStorageNameInput.value.trim()){
            newStorageNameInput.focus();
            return;
        }

        const initFile = new Blob([""], { type: "text/plain" });
        const fileRef = ref(storage, `documents/${newStorageNameInput.value}/.keep`);

        //Check if pool already exists
        try {
            await getMetadata(fileRef);

            isAddingNewStorage = false;

            //Notification
            requestAnimationFrame(() => {
                notificationText.set(`Úložisko "${newStorageNameInput.value}" už existuje.`);
                isNotificationVisible.set(true);
                notificationType.set("error");

                setTimeout(() => {
                    notificationText.set("");
                    isNotificationVisible.set(false);
                }, 3000);
            });



            return;
        } catch (error) {
            if (error.code !== "storage/object-not-found") {
                // Iná chyba než že súbor neexistuje (napr. sieťová)
                console.error("Chyba pri overovaní úložiska:", error);
                return;
            }
        }

        try {
            await uploadBytes(fileRef, initFile);

            isAddingNewStorage = false;

            //Notification
            requestAnimationFrame(() => {
                notificationText.set(`Úložisko ${newStorageNameInput.value} bolo úspešne vytvorené.`);
                isNotificationVisible.set(true);

                setTimeout(() => {
                    notificationText.set("");
                    isNotificationVisible.set(false);
                }, 3000);
            });

            //Update document pools
            await loadDocumentPools();

        } catch (error) {
            console.error("Chyba pri vytváraní adresára:", error);
        }
    }

    async function deleteExistingStorage(){
        const folderRef = ref(storage, selectedStorage);

        if (selectedStorage == "Moje dokumenty"){

            isDeletingStorage = false;

            //Notification
            requestAnimationFrame(() => {
                notificationText.set(`Úložisko ${selectedStorage} nie je možné odstrániť.`);
                notificationType.set("error");
                isNotificationVisible.set(true);

                setTimeout(() => {
                    notificationText.set("");
                    notificationType.set("");
                    isNotificationVisible.set(false);
                }, 3000);
            });

            return;
        }

        try {
            const result = await listAll(folderRef);

            // Odstrániť všetky súbory v adresári
            for (const fileRef of result.items) {
                await deleteObject(fileRef);
                console.log(`Súbor '${fileRef.fullPath}' bol odstránený.`);
            }

            /*
            // Rekurzívne odstrániť podadresáre
            for (const prefixRef of result.prefixes) {
                await deleteStorage(prefixRef.fullPath);
            }*/

            //TODO zmazat v chromadb - chunky musia vediet ku ktoremu dokumentu patria

            isDeletingStorage = false;

            //Notification
            requestAnimationFrame(() => {
                notificationText.set(`Úložisko ${selectedStorage} bolo úspešne odstránené.`);
                isNotificationVisible.set(true);
                notificationType.set("");

                setTimeout(() => {
                    notificationText.set("");
                    isNotificationVisible.set(false);
                }, 3000);
            });

            //Update document pools
            await loadDocumentPools();
            selectedStorage = "Moje dokumenty";

        } catch (error) {
            console.error("Chyba pri odstraňovaní adresára:", error);
        }
    }
</script>

<div
        class="settings-container"
        class:dark-mode={$isDarkModeEnabled}
        in:fade={{ delay: 100 , duration: 250 }}
>

    <div
            class="heading"
    >
        <i class='bx bx-cog'></i>
        <h2>Nastavenia</h2>
    </div>

    <div class="settings">
        <div class="setting">
            <div class="setting-title">
                <label>Tmavý režim</label>
            </div>
            <div class="setting-option">
                <!-- Tlacidlo na prepinanie darkmode -->
                {#if !$isDarkModeEnabled}
                    <div class="my-button">
                        <md-icon-button on:click={toggleDarkMode}>
                            <i class='bx bx-toggle-left'></i>
                        </md-icon-button>
                    </div>

                {:else}
                    <div class="my-button">
                        <md-icon-button on:click={toggleDarkMode}>
                            <i class='bx bxs-toggle-right' ></i>
                        </md-icon-button>
                    </div>
                {/if}
            </div>
        </div>

        <!-- Language (not supported) -->
        <div class="setting">
            <div class="setting-title">
                <label>Jazyk</label>
            </div>
            <div class="setting-option">slovenský</div>   <!-- Viacero jazykov ... -->
        </div>

        <!-- Profile -->
        <div class="setting">
            <div class="setting-title">
                <label>Profil</label>
                <!-- Profile info card / editable TODO-->
                <div
                        class="profile-card-container"
                        class:dark-mode={$isDarkModeEnabled}
                        in:fade={{ delay: 100 , duration: 250 }}
                        out:fade={{ duration: 100 }}
                >
                    <div class="container">
                        <header>
                            <div class="info">
                                <div class="count">
                                    <p>{$loggedUser.aisId}</p>
                                </div>
                                <p>AIS ID</p>
                            </div>

                            <div class="profile">
                                <img src="{$loggedUser.photoURL}">
                                <button class="status-circle" style="background: {$statusColor}"></button>
                            </div>

                            <div class="info">
                                <div class="count">
                                    <p>2. bc</p> <!-- TODO integracia AIS -->
                                </div>
                                <p>Ročník</p>
                            </div>
                        </header>

                        <div class="about">
                            <h2>{$loggedUser.displayName}<i class='bx bxs-badge-check'></i></h2>
                            <p>Informačné a komunikačné technológie</p> <!-- TODO integracia AIS -->
                        </div>

                        <div class="tabs-container">
                            <ul class="tabs">
                                <li>
                                    <a id="tab-1">O mne</a>
                                </li>
                                <li>
                                    <a id="tab-2">Kontakt</a>
                                </li>
                                <li>
                                    <a id="tab-3">Siete</a>
                                </li>
                                <li id="active-tab"></li>
                            </ul>
                        </div>

                        <!-- About me -->
                        <div
                                class="tab-content active-tab-content"
                                id="tab-1"
                        >
                            {#if !isEditingAboutText}
                                <p
                                        class="about-me-paragraph"
                                        on:click={() => {isEditingAboutText = true;}}
                                >
                                    {$loggedUser.aboutMe}
                                </p>
                            {/if}

                            {#if isEditingAboutText}
                                <textarea
                                        class="about-me-textarea"
                                        value={$loggedUser.aboutMe}
                                        id="about-me"
                                ></textarea>

                                <div class="about-me-buttons">
                                    <div class="save-button">
                                        <md-icon-button on:click|preventDefault={() => {saveAboutMe();}}>
                                            <i class='bx bx-check-circle'></i>
                                        </md-icon-button>
                                    </div>

                                    <div class="close-button">
                                        <md-icon-button on:click|preventDefault={() => {isEditingAboutText = false;}}>
                                            <i class='bx bx-x'></i>
                                        </md-icon-button>
                                    </div>
                                </div>

                            {/if}
                        </div>

                        <!-- Kontakt -->
                        <div class="tab-content" id="tab-2">
                            <div class="contact">
                                <div class="contact-type">Email:</div>
                                <div class="contact-value">{$loggedUser.email}</div>
                            </div>

                            <div class="contact">
                                <div class="contact-type">Tel.č:</div>
                                <div class="contact-value">TODO</div>
                                <!-- TODO pridanie t.c-->
                            </div>
                        </div>

                        <div class="tab-content" id="tab-3">
                            <div class="social-links">
                                <a href="#"><i class='bx bxl-youtube'></i></a>
                                <!-- TODO pridanie -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="setting-option" style="background: rgba(0, 0, 0, 0.2);"></div>
        </div>

        <!-- Admin settings -->
        {#if $loggedUser.role !== "USER"}

            <!-- Roles -->
            {#if $permissions.canManageRoles}
                <div class="setting">
                    <div class="setting-title">
                        <label>Roly</label>
                    </div>

                    <div class="setting-option" style="background: rgba(0, 0, 0, 0.2);">
                        <!-- Add new role button -->
                        <button
                                class="add-btn"
                                on:click={() => {isAddingNewRole = true;}}
                        >
                            <i class='bx bx-plus'></i>
                            Pridať novú rolu
                        </button>

                        <!-- Delete role button -->
                        <button
                                class="delete-btn"
                                on:click={() => {isDeletingRole = true;}}
                        >
                            <i class='bx bx-minus'></i>
                            Odstrániť rolu
                        </button>
                    </div>
                </div>

                <div class="document-pool-options">
                    <label for="storage-select">
                        Zoznam rolí:
                        <i class='bx bxs-badge-check'></i>
                    </label>
                    <select id="storage-select" bind:value={selectedRole}>
                        {#each $roleOptions as option}
                            <option value={option.role}>
                                {option.role}
                            </option>
                        {/each}
                    </select>
                </div>
            {/if}


            <!-- Storages -->
            {#if $permissions.canManageDocumentPools}
                <div class="setting">
                    <div class="setting-title">
                        <label>Úložiská</label>
                    </div>

                    <div class="setting-option" style="background: rgba(0, 0, 0, 0.2);">
                        <!-- Add new storage button -->
                        <button
                                class="add-btn"
                                on:click={() => {isAddingNewStorage = true;}}
                        >
                            <i class='bx bx-plus'></i>
                            Pridať nové úložisko
                        </button>

                        <!-- Delete storage button -->
                        <button
                                class="delete-btn"
                                on:click={() => {isDeletingStorage = true;}}
                        >
                            <i class='bx bx-minus'></i>
                            Odstrániť úložisko
                        </button>
                    </div>
                </div>

                <div class="document-pool-options">
                    <label for="storage-select">
                        Zoznam úložisk:
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

        {/if}

        <!-- Admin modals -->
        {#if ($loggedUser.role !== "USER")}

            <!-- Adding new role modal -->
            {#if (isAddingNewRole && $permissions.canManageRoles)}
                <div class="adding-modal">
                    <div class="modal-content">

                        <!-- Role name input -->
                        <div class="storage-name">
                            <i class='bx bx-chevrons-right'></i>
                            <input type="text" spellcheck="false" class="search" id="role-name" placeholder="Zadajte názov role">
                        </div>

                        <!-- Add new role button -->
                        <button
                                class="add-btn"
                                on:click={addNewRole}
                        >
                            <i class='bx bx-plus'></i>
                            Pridať rolu
                        </button>

                        <!-- Close Modal button -->
                        <div class="close-modal-button">
                            <md-icon-button on:click={() => {isAddingNewRole = false;}}>
                                <i class='bx bx-x'></i>
                            </md-icon-button>
                        </div>
                    </div>
                </div>
            {/if}

            <!-- Deleting role modal  -->
            {#if (isDeletingRole && $permissions.canManageRoles)}
                <div class="deleting-modal">
                    <div class="modal-content">

                        <div class="confirmation-label">
                            <i class='bx bxs-error-alt'></i>
                            <label>Naozaj chcete odstrániť rolu "<strong>{selectedRole}</strong>"?</label>
                        </div>

                        <!-- Delete existing role button -->
                        <button
                                class="delete-btn"
                                on:click={deleteRole}
                        >
                            <i class='bx bx-minus'></i>
                            Odstrániť
                        </button>

                        <!-- Close Modal button -->
                        <div class="close-modal-button">
                            <md-icon-button on:click={() => {isDeletingRole = false;}}>
                                <i class='bx bx-x'></i>
                            </md-icon-button>
                        </div>
                    </div>
                </div>
            {/if}

            <!-- Adding new storage modal -->
            {#if (isAddingNewStorage && $permissions.canManageDocumentPools)}
                <div class="adding-modal">
                    <div class="modal-content">

                        <!-- Storage name input -->
                        <div class="storage-name">
                            <i class='bx bx-chevrons-right'></i>
                            <input type="text" spellcheck="false" class="search" id="storage-name" placeholder="Zadajte názov úložiska">
                        </div>

                        <!-- Add new storage button -->
                        <button
                                class="add-btn"
                                on:click={addNewStorage}
                        >
                            <i class='bx bx-plus'></i>
                            Pridať úložisko
                        </button>

                        <!-- Close Modal button -->
                        <div class="close-modal-button">
                            <md-icon-button on:click={() => {isAddingNewStorage = false;}}>
                                <i class='bx bx-x'></i>
                            </md-icon-button>
                        </div>
                    </div>
                </div>
            {/if}


            <!-- Deleting storage modal -->
            {#if (isDeletingStorage && $permissions.canManageDocumentPools)}
                <div class="deleting-modal">
                    <div class="modal-content">

                        <div class="confirmation-label">
                            <i class='bx bxs-error-alt'></i>
                            <label>Naozaj chcete odstrániť <strong>{selectedStorage}</strong> úložisko spolu s celým jeho obsahom?</label>
                        </div>

                        <!-- Delete existing storage button -->
                        <button
                                class="delete-btn"
                                on:click={deleteExistingStorage}
                        >
                            <i class='bx bx-minus'></i>
                            Odstrániť
                        </button>

                        <!-- Close Modal button -->
                        <div class="close-modal-button">
                            <md-icon-button on:click={() => {isDeletingStorage = false;}}>
                                <i class='bx bx-x'></i>
                            </md-icon-button>
                        </div>
                    </div>
                </div>
            {/if}
        {/if}

        <div class="close-settings"> <!-- TODO lepsie buttony, na ulozenie a vratenie sa
            TODO ukladanie do databazy pre jednotlivych userov
        -->
            <md-icon-button
                    on:click={() => {
                navigate("/dashboard" , { replace : true });
            }}
            >
                <i class='bx bx-x'></i>
            </md-icon-button>
        </div>

        <!-- Save button
        <a on:click={saveChanges} href="#" class="save-btn">ULOŽIŤ</a> -->

    </div>
</div>

<style lang="scss">

    .settings-container{
      background: var(--welcome-section-background);
      padding: 55px 9%;
      //height: 100vh;
      position: relative;
    }

    .settings-container .heading {
      display: flex;
      gap: 20px;
      position: absolute;
      text-align: left;
      color: var(--navbar-icon-color);
      font-size: 20px;
      margin-top: 100px;
      margin-left: 6.5rem;
      z-index: 3;
    }

    .settings-container .heading i{
      position: absolute;
      font-size: 25px;
      top: 7px;
      left: -30px;
    }

    .close-settings{
      position: absolute;
      top: 55px;
      right: 30px;
    }

    .settings-container .settings{
      background: var(--dotted-background-with-opacity);
      background-size: 10px 10px;
      height: 150vh;
      //border-radius: 50px;
      border: 3px solid rgba(0, 0, 0, 0.2);
      margin-top: 40px;

      position: relative;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .settings-container .settings .setting{
      display: flex;
      flex-direction: row;
      align-items: center;

      width: 100%;
      height: 35px;
      border: var(--setting-border);
      border-left: none;
      border-right: none;

      &:nth-child(1){
        margin-top: 100px;
      }

      &:nth-child(3){
        height: 70vh;
        align-items: start;
        border-bottom: none;
      }
    }

    .settings-container .settings .setting .setting-title{
      width: 50%;
      height: 30px;

      text-align: center;

      background: rgba(0, 0, 0, 0.2);
    }

    .settings-container .settings .setting .setting-title label{
      color: var(--navbar-icon-color);
      font-size: 18px;
    }

    .settings-container .settings .setting .setting-option{
      position: relative;
      width: 50%;
      height: 30px;

      text-align: center;

      background: rgba(255, 255, 255, 0.2);
      color: var(--navbar-icon-color);
    }

    .settings-container .settings .setting .setting-option .add-btn{
      //transform: translateY(2px);

      display: inline-block;
      background: #2b6209;
      color: #fff;
      font-size: 11px;
      border-radius: 8px;
      padding: 8px 15px;
      border: none;
    }

    .settings-container .settings .setting .setting-option .add-btn i{
      transform: translateY(1px);
    }

    .settings-container .settings .setting .setting-option .add-btn:hover{
      background: rgba(43, 98, 9, 0.95);
      transform: scale(1.02);
      cursor: pointer;
    }

    .settings-container .settings .setting .setting-option .delete-btn{
      //transform: translateY(2px);

      display: inline-block;
      background: indianred;
      color: #fff;
      font-size: 11px;
      border-radius: 8px;
      padding: 8px 15px;
      border: none;
    }

    .settings-container .settings .setting .setting-option .delete-btn i{
      transform: translateY(1px);
    }

    .settings-container .settings .setting .setting-option .delete-btn:hover{
      background: rgba(205, 92, 92, 0.95);
      transform: scale(1.02);
      cursor: pointer;
    }

    .settings-container .settings .setting .setting-option .my-button{
      --md-icon-button-hover-state-layer-color: none;
      transform: translateY(-5px);
    }

    .settings-container .settings .setting .setting-option .my-button i{
      position: absolute;
      top: 0;
      left: 0;
      font-size: 40px;
      color: var(--navbar-icon-color);
    }

    //About me section
    .about-me-buttons{
      display: flex;
      justify-content: center;
    }

    .about-me-buttons .save-button{
      //TODO
    }

    .about-me-buttons .close-button{
      //TODO
    }

    .about-me-paragraph{
      width: 300px;
      padding: 20px;
      cursor: pointer;
    }

    .about-me-paragraph:hover{
      background-color: var(--search-background);
      border-radius: 8px;
      border: 1px solid var(--navbar-icon-color);
    }

    /*
    .settings-container .settings .save-btn {
      position: absolute;
      right: 100px;
      bottom: 55px;

      display: inline-block;
      text-decoration: none;

      background: var(--primary-button);
      color: #fff;
      font-size: 17px;
      border-radius: 8px;
      padding: 8px 15px;
    }

    .settings-container .settings .save-btn:hover {
      background: var(--primary-button--hover);
      transform: scale(1.03);
    }
     */

    //Document pool options
    .document-pool-options{
      //background-color: rgba(100, 191, 227, 0.5);
      display: flex;
      margin-top: 15px;
      justify-content: center;
    }

    .document-pool-options label {
      font-weight: bold;
      width: 200px;
      color: var(--navbar-icon-color);
    }

    .document-pool-options select {
      width: 600px;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: var(--search-background);
      cursor: pointer;
      color: var(--navbar-icon-color);
    }

    /* Tlačidlo na zatvorenie modálneho okna */
    .close-modal-button {
      position: absolute;
      top: 10px;
      right: 10px;
      --md-icon-button-hover-state-layer-color: red;
    }

    .close-modal-button i{
      color: var(--navbar-icon-color);
    }

    //Admin modals
    .adding-modal{
      display: flex;
      position: fixed;
      top: 110px;
      left: 50%;
      transform: translate(-50%, 0);
      width: 800px;
      height: 100px;
      max-width: 90%;
      background-color: rgba(0, 0, 0, 0.00001);
      z-index: 999;
      pointer-events: none;
      box-shadow: var(--box-shadow);
    }

    .adding-modal .modal-content{
      width: 100%;
      height: 100%;
      background-color: var(--note-text-area-background);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--box-shadow);
      position: relative;
      pointer-events: all;
      position: relative;
    }

    .adding-modal .modal-content .add-btn{
      display: inline-block;
      background: #2b6209;
      color: #fff;
      font-size: 11px;
      border-radius: 8px;
      padding: 8px 15px;
      border: none;
      position: absolute;
      right: 15%;
      top: 50%;
      translate: 0 -50%;
    }

    .adding-modal .modal-content .add-btn i{
      transform: translateY(1px);
    }

    .adding-modal .modal-content .add-btn:hover{
      background: rgba(43, 98, 9, 0.95);
      transform: scale(1.02);
      cursor: pointer;
    }

    .adding-modal .modal-content .storage-name{
      margin: 0 auto;
      position: relative;
      width: 60%;
      translate: -100px;
      margin-top: 25px;
      color: var(--search-text-color);
      border: 1px solid var(--search-text-color);
      border-radius: 8px;
    }

    .adding-modal .modal-content .storage-name i{
      position: absolute;
      top: 50%;
      left: 16px;
      translate: 0 -50%;
      z-index: 1;
      font-size: 20px;
      color: var(--navbar-icon-color);
    }

    .adding-modal .modal-content .storage-name input{
      width: 100%;
      height: 44px;
      padding-left: 46px;
      font-size: 16px;
      border: 0;
      border-radius: 8px;
      background: var(--search-background);
      color: inherit;
      font-family: inherit;
      outline: none;
    }

    .deleting-modal{
      display: flex;
      position: fixed;
      top: 110px;
      left: 50%;
      transform: translate(-50%, 0);
      width: 800px;
      height: 130px;
      max-width: 90%;
      background-color: rgba(0, 0, 0, 0.00001);
      z-index: 999;
      pointer-events: none;
      box-shadow: var(--box-shadow);
    }

    .deleting-modal .modal-content{
      width: 100%;
      height: 100%;
      background-color: var(--note-text-area-background);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--box-shadow);
      position: relative;
      pointer-events: all;

      display: flex;
      flex-direction: column;
    }

    .deleting-modal .modal-content .confirmation-label{
      display: flex;
      gap: 10px;

      margin-top: 20px;
      margin-bottom: 10px;
      margin-left: 20px;

      word-wrap: break-word;
      white-space: normal;
      overflow-wrap: break-word;
      max-width: 80%;
    }

    .deleting-modal .modal-content .confirmation-label i{
      color: indianred;
      font-size: 25px;
    }

    .deleting-modal .modal-content .confirmation-label label{
      color: var(--navbar-icon-color);
      font-size: 18px;

    }

    .deleting-modal .modal-content .delete-btn{
      //transform: translateY(2px);

      display: inline-block;
      background: indianred;
      color: #fff;
      font-size: 11px;
      border-radius: 8px;
      padding: 8px 15px;
      border: none;
      align-self: center;
      width: 100px;
    }

    .deleting-modal .modal-content .delete-btn i{
      transform: translateY(1px);
    }

    .deleting-modal .modal-content .delete-btn:hover{
      background: rgba(205, 92, 92, 0.95);
      transform: scale(1.02);
      cursor: pointer;
    }

    // Profile info card styles ------------------------------------------------------------------
    a {
      text-decoration: none;
      cursor: pointer;
    }

    .profile-card-container {
      position: relative;  //TODO styles
      top: 60px;
      color: var(--navbar-icon-color);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .container {
      background: var(--profile-card-background);
      width: 448px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      border-radius: 16px;
      box-shadow: var(--box-shadow);
    }

    .container header {
      display: flex;
      justify-content: space-between;
      width: 100%;
      gap: 12px;
    }

    .container header .info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      font-size: 15px;
      width: 100%;
      flex-grow: 1;
    }

    .container header .info .count {
      padding: 6px;
      font-weight: 600;
      width: 100%;
      background: var(--color-card-background);
      border: 1px solid #eee;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      border-radius: 8px;
    }

    .container header .profile {
      position: relative;
      width: 400px;
    }

    .container header .profile img {
      position: relative;
      width: 100%;
      aspect-ratio: 1/1;
      object-fit: cover;
      border-radius: 50%;
      margin-top: -50%;
      border: 6px solid var(--color-background);
    }


    .status-circle{
      position: absolute;
      background: green; /* TODO */
      bottom: 15px;
      right: 10px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 2px solid var(--card-status-border);
    }

    .container .about {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .container .about h2 {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .container .about h2 i {
      color: #3d5afe;
    }

    .container .about p {
      font-size: 16px;
      color: var(--color-info);
    }

    .container .social-links {
      display: flex;
      gap: 16px;
    }

    .container .social-links a {
      background: transparent;
      padding: 8px;
      display: flex;
      width: 48px;
      height: 48px;
      align-items: center;
      justify-content: center;
      border: 1px solid #eee;
      color: var(--navbar-icon-color);
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .container .social-links a i {
      font-size: 26px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .container .social-links a:hover {
      border: 1px solid var(--primary-button--hover);
    }

    .container .social-links a:hover i {
      color: var(--primary-button--hover);
    }

    .container .tabs-container {
      overflow-x: auto;
      margin-bottom: 4px;
      width: 100%;
    }

    .container .tabs-container .tabs {
      position: relative;
      display: flex;
      border: 1px solid #ccc;
      border-radius: 8px;
      list-style: none;
    }

    .container .tabs-container .tabs li {
      /*z-index: 2;*/
    }

    .container .tabs-container .tabs li a {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--navbar-icon-color);
      min-width: 112px;
      outline: none;
      padding: 12px 16px;
      white-space: nowrap;
      transition: all 0.3s ease;
    }

    .container .tabs-container .tabs li a:hover,
    .container .tabs-container .tabs li a.active {
      color: var(--tab-link-hover);
    }

    .container .tabs-container #active-tab {
      position: absolute;
      width: 100%;
      width: 112px;
      height: 100%;
      background: var(--tab-active-color);
      /*z-index: 1;*/
      border-radius: 8px;
      transition: all 0.5s ease;
    }

    .container .tab-content {
      display: none;
      overflow-y: auto;
    }

    .container .active-tab-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      height: 100px;
      padding: 0 4px;
      font-size: 15px;
      margin-bottom: 5px;
      color: var(--color-info);
    }

    .container .tab-content .contact{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 250px;
    }


    .container .tabs-container .tabs li:nth-child(1):has(.active)~#active-tab {
      transform: translateX(0);
    }

    .container .tabs-container .tabs li:nth-child(2):has(.active)~#active-tab {
      transform: translateX(112px);
    }

    .container .tabs-container .tabs li:nth-child(3):has(.active)~#active-tab {
      transform: translateX(224px);
    }

    //===========================================================================
</style>