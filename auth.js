import { addTasks, addMeeting } from "./script.js";

let currentUser = null;
let isLogin = true;

const toggleButton = document.querySelector("#toggleForm");
const loginForm = document.querySelector("#loginRegisterForm");
const submitButton = document.querySelector("#submitButton");
const logInRegesterWord = document.querySelector("#loginOrRigester");
const message = document.getElementById("message");
const logOut = document.querySelector("#logout-container")
toggleButton.addEventListener("click", () => {
    message.textContent = '';
    document.getElementById("password").value = "";
    document.getElementById("email").value = '';
    if (isLogin) {
    submitButton.textContent = "Register";
    logInRegesterWord.innerHTML = "Register";
  } else {
    submitButton.textContent = "Login";
    logInRegesterWord.innerHTML = "Login";
  }
  isLogin = !isLogin;
});

loginForm.addEventListener("submit", function (e) {
        
	e.preventDefault();
	const formData = new FormData(this);
        const endpoint = isLogin ? 'login.php' : 'register.php';

        
        fetch(endpoint, {
          method: 'POST',
          body: formData,
        })
        .then(response => response.text())
        .then(data => {
         
         
          message.textContent = data;
	  document.getElementById("password").value = "";	
          document.getElementById("email").value = "";
         if (isLogin && data.includes('successful')) {
            document.getElementById("login-register-container").style.display = 'none';
            document.querySelector(".page-content").style.display = 'block';
	    logOut.style.display = 'block';
          }        })
        .catch(error => console.error('Error:', error));
      });



logOut.addEventListener("click", function () {
        fetch('logout.php', {
          method: 'POST'
        })
        .then(response => response.text())
        .then(data => {
          document.getElementById("logout-container").style.display = 'none'; // Hide logout button
          document.getElementById("login-register-container").style.display = 'block'; // Show login form
          document.getElementById("message").textContent = data;
	  document.getElementById("password").value = "";
          document.getElementById("email").value = "";
        })
        .catch(error => console.error('Error:', error));
      });

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

export {
  addTaskToDatabase,
  updateTaskInDatabase,
  deleteTaskFromDatabase,
  deleteMeetingFromDatabase,
  addMeetingToDatabase,
  updateMeetingInDatabase,
  currentUser,
};

