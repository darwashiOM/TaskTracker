import { firebaseConfig } from "./config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

import { addTasks } from "./script.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;

const signInButton = document.querySelector("#google-sign-in");
const signOutButton = document.querySelector("#sign-out");

function createGoogleSignInButton() {
  signInButton.addEventListener("click", () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        currentUser = result.user;
        console.log(`Hello, ${currentUser.displayName}`);
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
        currentUser = null;
        signInButton.style.display = "block";
        signOutButton.style.display = "none";
      })
      .catch((error) => {
        console.error("Error during sign-out: ", error);
      });
  });
}

async function addTaskToFirestore(task) {
  try {
    const docRef = await addDoc(
      collection(db, `users/${currentUser.uid}/tasks`),
      task
    );
    console.log("Task added with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding task: ", e);
  }
}

async function updateTaskInFirestore(taskId, updatedData) {
  try {
    const taskRef = doc(db, `users/${currentUser.uid}/tasks`, taskId);
    await updateDoc(taskRef, updatedData);
    console.log("Task updated successfully!");
  } catch (e) {
    console.error("Error updating task: ", e);
  }
}

async function deleteTaskFromFirestore(taskId) {
  try {
    const tasksCollection = collection(db, `users/${currentUser.uid}/tasks`);
    const tasksSnapshot = await getDocs(tasksCollection);

    const deletePromises = tasksSnapshot.docs.map(async (taskDoc) => {
      const taskData = taskDoc.data();

      if (taskData.id === taskId) {
        await deleteDoc(doc(db, `users/${currentUser.uid}/tasks`, taskDoc.id));
        console.log(`Deleted task with custom ID: ${taskId}`);
      }
    });

    // Wait for all deletions to complete
    await Promise.all(deletePromises);
    console.log(taskId);
    console.log("Task deleted successfully!");
  } catch (e) {
    console.error("Error deleting task: ", e);
  }
}

async function getTasksFromFirestore() {
  const tasks = [];
  try {
    const querySnapshot = await getDocs(
      collection(db, `users/${currentUser.uid}/tasks`)
    );

    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });

    console.log("found", tasks);
  } catch (e) {
    console.error("Error fetching tasks: ", e);
  }

  tasks.forEach((task) => addTasks(task, false));
  return tasks;
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log(`User is signed in as ${user.displayName}`);
    signInButton.style.display = "none";
    signOutButton.style.display = "block";
    getTasksFromFirestore();
  } else {
    currentUser = null;
    console.log("No user is signed in");
    signInButton.style.display = "block";
    signOutButton.style.display = "none";
  }
});

export {
  addTaskToFirestore,
  updateTaskInFirestore,
  deleteTaskFromFirestore,
  currentUser,
};

document.addEventListener("DOMContentLoaded", createGoogleSignInButton);
