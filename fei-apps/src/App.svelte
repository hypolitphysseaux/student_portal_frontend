<script lang="ts">

  //Routing
  //import { Router, Link, Route } from "svelte-routing";
  //export let url = "";
  //----------------------------

  // Import komponentov
  import LoginForm from "./lib/LoginForm.svelte";
  import RegistrationForm from "./lib/RegistrationForm.svelte";

  import Navbar from "./lib/Navbar.svelte";  //TODO Dynamic import po prihlaseni
  import WelcomeSection from "./lib/WelcomeSection.svelte";
  import AppWidgets from "./lib/AppWidgets.svelte";
  import AppFooter from "./lib/AppFooter.svelte";
  import ProfileInfoCard from "./lib/ProfileInfoCard.svelte";
  import Notes from "./lib/Notes.svelte";
  import ResetPasswordForm from "./lib/ResetPasswordForm.svelte";
  import {onMount} from "svelte";
  import {getAuth} from "firebase/auth";
  import firebaseApp from "./firebase";
  import Settings from "./lib/Settings.svelte";
  //import firestore = firebase.firestore;
  //----------------------------

  // State control
  import {isDarkModeEnabled} from "./stores";

  let loggedIn = false;
  let isSigningUp = false;
  let isResetingPassword = false;
  let loggedUser;
  let isProfileInfoCardOpen = false;
  let isSettingsOpen = false;


  //----------------------------

  // Functions
  onMount(() => {
    console.log("App loaded.");

    const auth = getAuth(firebaseApp);

    // TODO skontrolujeme, ci je user v session? v local storage?

    console.log("Checking for user.");
    console.log(auth.currentUser);

    if (auth.currentUser){ //Toto je by default Local storage persistance
      // Chcem session? alebo remember me checkbox?
      const user = auth.currentUser;
      loggedUser = user;
      loggedIn = true;

      console.log("User found.", user);
    }

  });
  //----------------------------
</script>

<div class="app-wrapper">
  <div class="app-content">

    <!-- Prihlasovanie -->
    {#if
            !loggedIn &&
            !isSigningUp &&
            !isResetingPassword
    }
      <LoginForm
              bind:loggedIn={loggedIn}
              bind:loggedUser={loggedUser}
              bind:isSigningUp={isSigningUp}
              bind:isResetingPassword={isResetingPassword}
      ></LoginForm>
    {/if}


    <!-- Registracia -->
    {#if
            !loggedIn &&
            !isResetingPassword &&
            isSigningUp
    }
      <RegistrationForm
              bind:isSigningUp={isSigningUp}
      ></RegistrationForm>
    {/if}

    <!-- Resetovanie hesla -->
    {#if
            !loggedIn &&
            !isSigningUp &&
            isResetingPassword
    }
      <ResetPasswordForm
              bind:isResetingPassword={isResetingPassword}
      ></ResetPasswordForm>
    {/if}


    <!-- Hlavny distribucny uzol , zoznam aplikacii -->

    {#if
            loggedIn &&
            !isSettingsOpen
    }
      <!-- Navbar -->
      <Navbar
              bind:loggedIn={loggedIn}
              bind:loggedUser={loggedUser}
              bind:isProfileInfoCardOpen={isProfileInfoCardOpen}
              bind:isSettingsOpen={isSettingsOpen}
      ></Navbar>

      <!-- Welcome section -->
      <WelcomeSection
              bind:loggedUser={loggedUser}
      ></WelcomeSection>


      <!-- Info section -->

      <!-- App section -->
      <AppWidgets></AppWidgets>

      <!-- Notes section -->
      <Notes bind:loggedUser={loggedUser}></Notes>

      <!-- Profile Info Card -->
      {#if isProfileInfoCardOpen}
        <ProfileInfoCard
                bind:loggedUser={loggedUser}
                bind:isProfileInfoCardOpen={isProfileInfoCardOpen}
        ></ProfileInfoCard>
      {/if}
    {/if}

    <!-- Nastavenia -->
    {#if isSettingsOpen}
      <Navbar
              bind:loggedIn={loggedIn}
              bind:loggedUser={loggedUser}
              bind:isProfileInfoCardOpen={isProfileInfoCardOpen}
              bind:isSettingsOpen={isSettingsOpen}
      ></Navbar>

      <Settings
              bind:isSettingsOpen={isSettingsOpen}
              bind:loggedUser={loggedUser}
      ></Settings>
    {/if}

  </div>


  <div class="app-footer">
    <!-- App Footer -->
    <AppFooter bind:isDarkModeEnabled={$isDarkModeEnabled}></AppFooter>
  </div>
</div>



<style>
</style>
