import { firebaseConfig } from "./config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signInButton = document.querySelector("#google-sign-in");
const signOutButton = document.querySelector("#sign-out");

function createGoogleSignInButton() {
  signInButton.addEventListener("click", () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(`Hello, ${user.displayName}`);
        signInButton.style.display = "none";
        signOutButton.style.display = "block";
      })
      .catch((error) => {
        console.error("Error during sign-in: ", error);
      });
  });

  signOutButton.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        signInButton.style.display = "block";
        signOutButton.style.display = "none";
      })
      .catch((error) => {
        console.error("Error during sign-out: ", error);
      });
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(`User is signed in as ${user.displayName}`);
    signInButton.style.display = "none";
    signOutButton.style.display = "block";
  } else {
    console.log("No user is signed in");
    signInButton.style.display = "block";
    signOutButton.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", createGoogleSignInButton);
