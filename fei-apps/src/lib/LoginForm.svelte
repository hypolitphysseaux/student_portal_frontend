<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from 'svelte/transition';

    import { navigate } from "svelte-routing";

    import { db , auth } from "../firebase";
    import { onAuthStateChanged , setPersistence , browserSessionPersistence } from "firebase/auth";
    import { doc, getDoc, increment, updateDoc } from "firebase/firestore";

    import { isDarkModeEnabled , loggedIn, loggedUser } from "../stores";

    import {
        GoogleAuthProvider,
        signInWithPopup,
        signInWithEmailAndPassword
    } from "firebase/auth";


    const googleProvider = new GoogleAuthProvider();
    //const facebookProvider = new FacebookAuthProvider();


    onMount(() => {
        //Observer on the auth object
        onAuthStateChanged( auth , (user) => {
            if (user){
                // User is signed in
                loggedUser.set(user);
                getUserDetails(user.uid);

                loggedIn.set(true);
            } else {
                // User is signed out
                loggedUser.set("");

                loggedIn.set(false);
            }
        });
    });

    async function facebookPopUpSignIn(){
        alert("Momentálne nie je k dispozícií.");
        /*
        try {
            // Step 1: User tries to sign in using Google.
            let result = await signInWithPopup(auth, facebookProvider);
            console.log(result);
        } catch (error) {
            console.log(error);
            // Step 2: User's email already exists.
            if (error.code === "auth/account-exists-with-different-credential") {
                // The pending Google credential.
                let pendingCred = error.credential;

                // Step 3: Save the pending credential in temporary storage,

                // Step 4: Let the user know that they already have an account
                // but with a different provider, and let them choose another
                // sign-in method.
            }
        }
         */
    } // Facebook prihlasenie

    async function googlePopUpSignIn(){
        try {
            let result = await signInWithPopup(auth, googleProvider);

            // This gives you a Google Access Token. You can use it to access the Google API
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;

            //The signed-in user info
            const user = result.user;

            incrementActiveUsers();
            //loggedUser = user.toJSON();
            //console.log(loggedUser);

            loggedIn.set(true);
        } catch (error) {

            // Step 2: User's email already exists.
            if (error.code === "auth/account-exists-with-different-credential") {
                // The pending Google credential.
                let pendingCred = error.credential;

                // Step 3: Save the pending credential in temporary storage,

                // Step 4: Let the user know that they already have an account
                // but with a different provider, and let them choose another
                // sign-in method.
            }
        }
    } // Google prihlasenie

    async function setOnlineStatus(uid){
        const docRef = doc(db, "userDetails", uid);

        await updateDoc(docRef, {
            status: "online"
        });
    } // Nastavenie online statusu

    async function getUserDetails(uid) {
        const docSnap = await getDoc(doc(db, "userDetails", uid));
        if (docSnap.exists())
        {
            $loggedUser.aisId = docSnap.data().aisId;
            isDarkModeEnabled.set(docSnap.data().prefersDarkTheme);
        }
        else {
            $loggedUser.aisId = "";
        }
    } // Ziskanie ais id a theme preference

    async function incrementActiveUsers(){
        const docRef = doc(db, "userDetails", "activeUsers");

        await updateDoc(docRef, {
            number: increment(1)
        });
    } // Zvysi pocet online userov o 1
    // ! limitacia, iba raz za sekundu


    async function logIn(){
        const email = document.getElementById('email') || new HTMLElement();
        const password = document.getElementById('password') || new HTMLElement();

        if (!email.value)
        {
            errorLabel = "Zadajte email.";
            email.focus();
            return;
        }

        if (!password.value)
        {
            errorLabel = "Zadajte heslo.";
            password.focus();
            return;
        }


        //Check if the user is not signed in elsewhere //TODO
        

        //Set session persistence
        setPersistence(auth , browserSessionPersistence);

        signInWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                const user = userCredential.user;
                // Signed in
                loggedUser.set(user);


                //TODO Store current user in a local storage ?
                // Kvoli reloadu , pri signout vymazat

                setOnlineStatus($loggedUser.uid);
                getUserDetails($loggedUser.uid);

                loggedIn.set(true);
                incrementActiveUsers();
            })
            .catch((error) => {
                if (error.code == "auth/invalid-credential"){
                    errorLabel = "Nesprávny email alebo heslo.";
                }

                if (error.code == "auth/invalid-email"){
                    errorLabel = "Nesprávny email.";

                    //Focus email input
                    email.focus();
                }
            });

    } // Prihlasenie cez email a heslo

    export let isSigningUp;
    export let isResetingPassword;

    let errorLabel = null;
</script>

<div class="form-wrapper">
    <div class="logo">
        <svg width="91" height="31" viewBox="0 0 91 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                    d="M2.3 17.8385C3.6 17.8385 4.6 16.8352 4.6 15.5309C4.6 14.2265 3.6 13.2231 2.3 13.2231C0.999999 13.2231 0 14.2265 0 15.5309C0 16.7349 0.999999 17.8385 2.3 17.8385Z"
                    fill="#0039A6" />
            <path
                    d="M2.3 30.4807C3.6 30.4807 4.6 29.4774 4.6 28.173C4.6 26.8687 3.6 25.8654 2.3 25.8654C0.999999 25.8654 0 26.8687 0 28.173C0 29.4774 0.999999 30.4807 2.3 30.4807Z"
                    fill="#0039A6" />
            <path
                    d="M14.9 17.8385C16.2 17.8385 17.2 16.8352 17.2 15.5309C17.2 14.2265 16.2 13.2231 14.9 13.2231C13.6 13.2231 12.6 14.2265 12.6 15.5309C12.6 16.7349 13.6 17.8385 14.9 17.8385Z"
                    fill="#0039A6" />
            <path
                    d="M14.9 30.4807C16.2 30.4807 17.2 29.4774 17.2 28.173C17.2 26.8687 16.2 25.8654 14.9 25.8654C13.6 25.8654 12.6 26.8687 12.6 28.173C12.6 29.4774 13.6 30.4807 14.9 30.4807Z"
                    fill="#0039A6" />
            <path
                    d="M27.5 17.8385C28.8 17.8385 29.8 16.8352 29.8 15.5309C29.8 14.2265 28.8 13.2231 27.5 13.2231C26.2 13.2231 25.2 14.2265 25.2 15.5309C25.2 16.7349 26.2 17.8385 27.5 17.8385Z"
                    fill="#0039A6" />
            <path
                    d="M2.3 5.09607C3.6 5.09607 4.6 4.09274 4.6 2.78839C4.6 1.48405 3.6 0.480713 2.3 0.480713C0.999999 0.480713 0 1.48405 0 2.78839C0 4.09274 0.999999 5.09607 2.3 5.09607Z"
                    fill="#0039A6" />
            <path
                    d="M14.9 5.09607C16.2 5.09607 17.2 4.09274 17.2 2.78839C17.2 1.48405 16.2 0.480713 14.9 0.480713C13.6 0.480713 12.6 1.48405 12.6 2.78839C12.6 4.09274 13.6 5.09607 14.9 5.09607Z"
                    fill="#0039A6" />
            <path
                    d="M27.5 5.09607C28.8 5.09607 29.8 4.09274 29.8 2.78839C29.8 1.48405 28.8 0.480713 27.5 0.480713C26.2 0.480713 25.2 1.48405 25.2 2.78839C25.2 4.09274 26.2 5.09607 27.5 5.09607Z"
                    fill="#0039A6" />
            <path
                    d="M27.5 30.4807C28.8 30.4807 29.8 29.4774 29.8 28.173C29.8 26.8687 28.8 25.8654 27.5 25.8654C26.2 25.8654 25.2 26.8687 25.2 28.173C25.2 29.4774 26.2 30.4807 27.5 30.4807Z"
                    fill="#0039A6" />
            <path
                    d="M40.2 17.8385C41.5 17.8385 42.5 16.8352 42.5 15.5309C42.5 14.2265 41.5 13.2231 40.2 13.2231C38.9 13.2231 37.9 14.2265 37.9 15.5309C37.9 16.7349 38.9 17.8385 40.2 17.8385Z"
                    fill="#0039A6" />
            <path
                    d="M40.2 30.4807C41.5 30.4807 42.5 29.4774 42.5 28.173C42.5 26.8687 41.5 25.8654 40.2 25.8654C38.9 25.8654 37.9 26.8687 37.9 28.173C37.9 29.4774 38.9 30.4807 40.2 30.4807Z"
                    fill="#0039A6" />
            <path
                    d="M40.2 5.09607C41.5 5.09607 42.5 4.09274 42.5 2.78839C42.5 1.48405 41.5 0.480713 40.2 0.480713C38.9 0.480713 37.9 1.48405 37.9 2.78839C37.9 4.09274 38.9 5.09607 40.2 5.09607Z"
                    fill="#0039A6" />
            <path
                    d="M79.3 18.0393C79.2 18.0393 79.1 18.1396 79.1 18.24V30.1798C79.1 30.2801 79.2 30.3804 79.3 30.3804H80.7C80.8 30.3804 80.9 30.2801 80.9 30.1798V18.24C80.9 18.1396 80.8 18.0393 80.7 18.0393H79.3ZM67.9 19.6446C67.9 19.5443 67.9 19.5443 68 19.5443H72.9C73 19.5443 73.1 19.444 73.1 19.3436V18.24C73.1 18.1396 73 18.0393 72.9 18.0393H66.3C66.2 18.0393 66.1 18.1396 66.1 18.24V30.1798C66.1 30.2801 66.2 30.3804 66.3 30.3804H72.9C73 30.3804 73.1 30.2801 73.1 30.1798V29.0761C73.1 28.9758 73 28.8754 72.9 28.8754H68C67.9 28.8754 67.9 28.7751 67.9 28.7751V24.862H71.9C72 24.862 72.1 24.7617 72.1 24.6614V23.5577C72.1 23.4574 72 23.357 71.9 23.357H67.9V19.6446ZM55.6 19.6446C55.6 19.5443 55.7 19.5443 55.7 19.5443H60.5C60.6 19.5443 60.7 19.444 60.7 19.3436V18.24C60.7 18.1396 60.6 18.0393 60.5 18.0393H54.1C54 18.0393 53.9 18.1396 53.9 18.24V30.1798C53.9 30.2801 54 30.3804 54.1 30.3804H55.5C55.6 30.3804 55.7 30.2801 55.7 30.1798V24.862H59.5C59.6 24.862 59.7 24.7617 59.7 24.6614V23.5577C59.7 23.4574 59.6 23.357 59.5 23.357H55.7V19.6446H55.6Z"
                    fill="#000" />
            <path
                    d="M90.8 0.882045C90.8 0.681376 90.7 0.681363 90.6 0.681363H88.3C88.2 0.681363 88.1 0.78171 88.1 0.882045V9.10945C88.1 10.3135 87.4 10.9155 86.1 10.9155C84.8 10.9155 84.1 10.3135 84.1 9.10945V0.882045C84.1 0.681376 84 0.681363 83.9 0.681363H81.6C81.4 0.681363 81.4 0.78171 81.4 0.882045V9.20979C81.4 11.6178 82.7 13.1228 86.1 13.1228C89.4 13.1228 90.8 11.6178 90.8 9.20979V0.882045ZM72.3 13.0225C72.5 13.0225 72.5 12.9222 72.5 12.8218V3.08938C72.5 2.98905 72.5 2.98907 72.6 2.98907H75.5C75.6 2.98907 75.7 2.88873 75.7 2.78839V1.0827C75.7 0.882026 75.6 0.882045 75.5 0.882045H66.8C66.6 0.882045 66.6 0.982361 66.6 1.0827V2.78839C66.6 2.98906 66.7 2.98907 66.8 2.98907H69.6C69.7 2.98907 69.7 3.08938 69.7 3.08938V12.8218C69.7 13.0225 69.8 13.0225 69.9 13.0225H72.3ZM53.5 12.4205C54.7 13.0225 55.8 13.1228 57.2 13.1228C59.8 13.1228 61.5 11.8185 61.5 9.41047C61.5 7.70479 60.7 6.6011 58.6 5.69809C56.8 4.99575 56.5 4.59443 56.5 3.99242C56.5 3.29008 57 2.78839 58.1 2.78839C58.9 2.78839 59.6 2.88872 60.2 3.18973C60.4 3.29006 60.5 3.18972 60.5 3.08938L61.3 1.48406C61.4 1.38372 61.4 1.28337 61.2 1.18304C60 0.681363 59.2 0.480713 57.6 0.480713C55.1 0.480713 53.6 1.98573 53.6 3.99242C53.6 5.79844 54.5 6.90211 56.6 7.80512C58.2 8.50746 58.6 8.90878 58.6 9.61112C58.6 10.3135 58 10.8152 57 10.8152C55.8 10.8152 55.2 10.6145 54.5 10.2131C54.4 10.1128 54.3 10.2131 54.2 10.3135L53.4 12.1195C53.4 12.3202 53.4 12.3202 53.5 12.4205Z"
                    fill="#000" />
        </svg>
        <a href="#">APPS</a>
    </div>

    <div class="container">
        <h1>Prihlásiť sa do účtu</h1>
        <div class="social-login">
            <button on:click={googlePopUpSignIn} class="google">
                <i class='bx bxl-google'></i>
                Google
            </button>
            <button on:click={facebookPopUpSignIn} class="apple">
                <i class='bx bxl-facebook-circle'></i>
                Facebook
            </button>
        </div>

        <div class="divider">
            <div class="line"></div>
            <p>Alebo</p>
            <div class="line"></div>
        </div>

        <div class="form">
            <label for="email">Email:</label>
            <div class="custom-input">
                <input
                        on:click={() => {
                            errorLabel = null;
                        }}
                        on:input={() => {
                            errorLabel = null;
                        }}
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Zadajte email"
                        autocomplete="off"
                >
                <i class='bx bx-at'></i>
            </div>

            <label for="password">Heslo:</label>
            <div class="custom-input">
                <input
                        on:click={() => {
                            errorLabel = null;
                        }}
                        on:input={() => {
                            errorLabel = null;
                        }}
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Zadajte heslo"
                >
                <i class='bx bx-lock-alt'></i>
            </div>

            {#if errorLabel}
                <div class="errorLabel">
                    <label
                            out:fade={{ duration: 200 }}
                    >
                        {errorLabel}
                    </label>
                </div>
            {/if}

            <button
                    on:click={logIn}
                    type="submit"
                    class="login">Prihlásiť sa</button>

            <div class="links">
                <a on:click={ () => {isResetingPassword = true; navigate("/reset")}}>Resetovať heslo</a>
                <a on:click={ () => {isSigningUp = true; navigate("/register")}}>Nemáte účet?</a>
            </div>
        </div>
    </div>
</div>


<style>
    @import url('https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200..1000;1,200..1000&display=swap');


    .logo {
        position: absolute;
        top: 22px;
        left: 50%;
        translate: -50%;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .logo svg {
        width: 100px;
    }

    .logo a {
        font-size: 24px;
        font-weight: bold;
        text-decoration: none;
        color: #0039A6;
    }

    .form-wrapper{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 100px;
    }

    .container {
        width: 440px;
        padding: 40px 32px;
        margin-top: 100px;
        border-radius: 8px;
        box-shadow: rgba(100, 100, 111, 0.2) 2px 7px 25px 10px;
        background: #fff;
    }

    .container h1 {
        font-size: 1.6rem;
    }

    .container .social-login {
        display: flex;
        gap: 16px;
        margin-top: 20px;
    }

    .container .social-login button {
        padding: 8px;
        width: 100%;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 1rem;
        font-weight: 700;
        color: #323760;
        border: 1px solid #6667b0;
        background: transparent;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .container .social-login button i {
        font-size: 26px;
    }

    .container .social-login button:hover {
        color: #0039A6;
        border-color: #0039A6;
    }

    .container .divider {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-top: 20px;
    }

    .container .divider .line {
        height: 1px;
        width: 100%;
        background: #1d1d1d;
        opacity: 0.2;
    }

    .container .divider p {
        font-weight: bold;
        font-size: 15px;
    }

    .container .form label {
        color: #1d1d1d;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 0.03rem;
        display: block;
        margin-top: 12px;
    }

    .container .form .errorLabel{
        display: flex;
        justify-content: center;
        margin-top: 10px;
    }

    .container .form .errorLabel label{
        color: red;
        font-size: 15px;
    }

    .container .form .custom-input {
        position: relative;
    }

    .container .form .custom-input input {
        color: #1d1d1d;
        font-size: 16px;
        font-weight: 500;
        width: 100%;
        height: 46px;
        letter-spacing: 0.03rem;
        border: 1px solid #1d1d1d;
        background: transparent;
        outline: none;
        border-radius: 8px;
        text-indent: 20px;
        margin-top: 6px;
        transition: all 0.3s ease;
    }

    .container .form .custom-input i {
        position: absolute;
        font-size: 28px;
        right: 10px;
        top: 14px;
        transition: all 0.3s ease;
    }

    .container .form .custom-input input:focus {
        border-color: #0039A6;
    }

    .container .form .custom-input input:focus+i {
        color: #0039A6;
    }

    .container .form .login {
        width: 100%;
        margin-top: 30px;
        background: #0039A6;
        color: #fff;
        border: none;
        line-height: 50px;
        font-size: 18px;
        letter-spacing: 0.025rem;
        font-weight: bold;
        cursor: pointer;
        border-radius: 8px;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
    }

    .container .form .login:hover {
        background: #3160b8;
    }

    .container .links {
        display: flex;
        justify-content: space-evenly;
        margin-top: 30px;
    }

    .container .links a {
        text-decoration: none;
        color: #0039A6;
        font-weight: 600;
        font-size: 1rem;
        text-underline-offset: 6px;
        text-decoration-color: #0039A6;
    }

    .container .links a:hover {
        text-decoration: underline;
        cursor: pointer;
    }
</style>