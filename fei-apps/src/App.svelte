<script lang="ts">

  // Initialize Firebase
  import { initializeApp } from "firebase/app";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {  //TODO env variables
    apiKey: "AIzaSyCRMaVlK3fnrhO1DOU7sDbKkWWL6imrcmE",
    authDomain: "fei-apps.firebaseapp.com",
    projectId: "fei-apps",
    storageBucket: "fei-apps.appspot.com",
    messagingSenderId: "360166082859",
    appId: "1:360166082859:web:247449fb777c18cec01d6e"
  };

  const firebaseApp = initializeApp(firebaseConfig);
  //---------------------------------

  //Routing
  import { Router, Link, Route } from "svelte-routing";
  //export let url = "";
  //----------------------------

  // Import komponentov
  import LoginForm from "./lib/LoginForm.svelte";
  import RegistrationForm from "./lib/RegistrationForm.svelte";

  import Navbar from "./lib/Navbar.svelte";  //TODO Dynamic import po prihlaseni
  import AppWidgets from "./lib/AppWidgets.svelte";
  //----------------------------


  // Login flow control
  let loggedIn = false;
  let isSigningUp = false;
  let isResetingPassword = false;

  // State control
  let loggedUser;
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
    <LoginForm
            bind:loggedIn={loggedIn}
            bind:loggedUser={loggedUser}
    ></LoginForm>
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
            bind:loggedUser={loggedUser}
            bind:isDarkModeEnabled={isDarkModeEnabled}
    ></Navbar>

    <!-- Welcome section -->

    <!-- Info section -->

    <!-- App section -->
    <AppWidgets
            bind:isDarkModeEnabled={isDarkModeEnabled}
    ></AppWidgets>

    {#if loggedUser}
      <div style="text-align: center">
        <h5>logged user:</h5>
        <p>{loggedUser.email} {loggedUser.displayName}</p>
        <p>Tieto informacie su od Google, spolu s profilovkou vpravo hore</p>
      </div>
    {/if}


  {/if}
</main>

<style>

</style>
