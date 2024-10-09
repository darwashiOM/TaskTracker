import { addTasks, addMeeting } from "./script.js";

let currentUser = null;

const signInButton = document.querySelector("#google-sign-in");
const signOutButton = document.querySelector("#sign-out");


function createSignInButton() {
  signInButton.addEventListener("click", () => {
    currentUser = { id: 1 }; 
    signInButton.style.display = "none";
    signOutButton.style.display = "block";
  });

  signOutButton.addEventListener("click", () => {
    currentUser = null;
    signInButton.style.display = "block";
    signOutButton.style.display = "none";
  });
}


async function addTaskToDatabase(task) {
  console.log("Task added:", task);
}

async function addMeetingToDatabase(task) {
  console.log("Meeting added:", task);
}

async function updateTaskInDatabase(taskId, updatedData) {
  console.log("Task updated:", taskId, updatedData);
}

async function updateMeetingInDatabase(meetingId, updatedData) {
  console.log("Meeting updated:", meetingId, updatedData);
}

async function deleteTaskFromDatabase(taskId) {
  console.log("Task deleted:", taskId);
}

async function deleteMeetingFromDatabase(meetingId) {
  console.log("Meeting deleted:", meetingId);
}

async function getTasksFromDatabase() {
  console.log("Fetching tasks...");
  const tasks = [];
  tasks.forEach((task) => addTasks(task, false));
  return tasks;
}

async function getMeetingsFromDatabase() {
  console.log("Fetching meetings...");
  const meetings = []; 
  meetings.forEach((meeting) => addMeeting(meeting, false));
  return meetings;
}

function checkUserAuthentication() {
  if (currentUser) {
    signInButton.style.display = "none";
    signOutButton.style.display = "block";
    getTasksFromDatabase();
    getMeetingsFromDatabase();
  } else {
    currentUser = null;
    signInButton.style.display = "block";
    signOutButton.style.display = "none";
  }
}

export {
  addTaskToDatabase,
  updateTaskInDatabase,
  deleteTaskFromDatabase,
  deleteMeetingFromDatabase,
  addMeetingToDatabase,
  updateMeetingInDatabase,
  currentUser,
};

document.addEventListener("DOMContentLoaded", createSignInButton);
