<script lang="ts">
  // Import komponentov
  import LoginForm from "./lib/LoginForm.svelte";
  import RegistrationForm from "./lib/RegistrationForm.svelte";
  import Navbar from "./lib/Navbar.svelte";
  import AppWidgets from "./lib/AppWidgets.svelte";
  //----------------------------

  //Routing
  import { Router, Link, Route } from "svelte-routing";
  //export let url = "";
  //----------------------------

  // Login flow control
  let loggedIn = false;
  let isSigningUp = false;
  let isResetingPassword = false;
  //----------------------------

  // State control
  let isDarkModeEnabled = false;
  //----------------------------

  // Functions

  //----------------------------
</script>

<main>

  <!-- Prihlasovanie -->
  {#if
          !loggedIn &&
          !isSigningUp &&
          !isResetingPassword
  }
    <LoginForm bind:loggedIn={loggedIn}></LoginForm>
  {/if}


  <!-- Registracia -->
  {#if
          !loggedIn &&
          !isResetingPassword &&
          isSigningUp
  }
    <RegistrationForm></RegistrationForm>
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
            bind:isDarkModeEnabled={isDarkModeEnabled}
    ></Navbar>

    <!-- Welcome section -->

    <!-- Info section -->

    <!-- App section -->
    <AppWidgets></AppWidgets>
  {/if}
</main>

<style>

</style>
