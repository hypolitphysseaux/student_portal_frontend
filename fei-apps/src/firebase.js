//FIREBASE
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Add SDKs for Firebase products that you want to use
import { getAuth, GoogleAuthProvider,signInWithPopup } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCRMaVlK3fnrhO1DOU7sDbKkWWL6imrcmE",
    authDomain: "fei-apps.firebaseapp.com",
    projectId: "fei-apps",
    storageBucket: "fei-apps.appspot.com",
    messagingSenderId: "360166082859",
    appId: "1:360166082859:web:247449fb777c18cec01d6e",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp
///FIREBASE
//----------------------------------------------------------------------------------------