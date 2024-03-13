<script lang="ts">
  // Import komponentov
  import LoginForm from "./lib/LoginForm.svelte";
  import RegistrationForm from "./lib/RegistrationForm.svelte";
  import Navbar from "./lib/Navbar.svelte";
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
      <Navbar
              bind:loggedIn={loggedIn}
      ></Navbar>
  {/if}
</main>

<style>
</style>
