<script lang="ts">

  //Routing
  import { Router, Link, Route } from "svelte-routing";
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
  //import firestore = firebase.firestore;
  //----------------------------

  // State control
  let loggedIn = false;
  let isSigningUp = false;
  let isResetingPassword = false;
  let loggedUser;
  let isDarkModeEnabled = false;
  let isProfileInfoCardOpen = false;
  //----------------------------

  // Functions

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
              bind:isDarkModeEnabled={isDarkModeEnabled}
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
      <div>
        Reset password TODO
      </div>
    {/if}


    <!-- Hlavny distribucny uzol , zoznam aplikacii -->

    {#if loggedIn}
      <!-- Navbar -->
      <Navbar
              bind:loggedIn={loggedIn}
              bind:loggedUser={loggedUser}
              bind:isDarkModeEnabled={isDarkModeEnabled}
              bind:isProfileInfoCardOpen={isProfileInfoCardOpen}
      ></Navbar>

      <!-- Welcome section -->
      <WelcomeSection
              bind:isDarkModeEnabled={isDarkModeEnabled}
              bind:loggedUser={loggedUser}
      ></WelcomeSection>


      <!-- Info section -->

      <!-- App section -->
      <AppWidgets
              bind:isDarkModeEnabled={isDarkModeEnabled}
      ></AppWidgets>

      <!-- Notes section -->
      <Notes
              bind:isDarkModeEnabled={isDarkModeEnabled}
              bind:loggedUser={loggedUser}
      >
      </Notes>

      <!-- Profile Info Card -->
      {#if isProfileInfoCardOpen}
        <ProfileInfoCard
                bind:isDarkModeEnabled={isDarkModeEnabled}
                bind:loggedUser={loggedUser}
                bind:isProfileInfoCardOpen={isProfileInfoCardOpen}
        ></ProfileInfoCard>
      {/if}



      <!--
      <div style="display: flex; justify-content: center; flex-direction: column;">
        <h3>Test na citanie z firestore</h3>
        <button style="width: 200px" on:click={testRead}>Read</button>
      </div>

      <div style="display: flex; justify-content: center; flex-direction: column;">
        <h3>Test na zapis do firestore</h3>
        <input type="text" id="testInput">
        <button style="width: 200px" on:click={testWrite}>Write</button>
      </div>
      -->
    {/if}
  </div>


  <div class="app-footer">
    <!-- App Footer -->
    <AppFooter bind:isDarkModeEnabled={isDarkModeEnabled}></AppFooter>
  </div>
</div>



<style>

</style>
