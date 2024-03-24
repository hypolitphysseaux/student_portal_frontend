<script lang="ts">

  // Initialize Firebase
  import { initializeApp } from "firebase/app";
  import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";


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
  const db = getFirestore(firebaseApp);
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
  //import firestore = firebase.firestore;
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

  async function testRead(){ //WORKING
    const querySnapshot = await getDocs(collection(db, 'users'));

    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data().meno} , ${doc.data().ais_id}`)
    });
  }

  async function testWrite(){ //WORKING
    const testName = document.getElementById("testInput") || HTMLInputElement;

    try {
      const docRef = await addDoc(collection(db, "users"), {
        name: testName.value
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

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


    <!-- Docasne testy  ALL WORKING-->
    <div style="display: flex; justify-content: center; flex-direction: column;">
      <h3>Test na citanie z firestore</h3>
      <button style="width: 200px" on:click={testRead}>Read</button>
    </div>

    <div style="display: flex; justify-content: center; flex-direction: column;">
      <h3>Test na zapis do firestore</h3>
      <input type="text" id="testInput">
      <button style="width: 200px" on:click={testWrite}>Write</button>
    </div>
  {/if}
</main>

<style>

</style>
