import { addTasks, addMeeting } from "./script.js";

let currentUser = null;
let isLogin = true;

const toggleButton = document.querySelector("#toggleForm");
const loginForm = document.querySelector("#loginRegisterForm");
const submitButton = document.querySelector("#submitButton");
const logInRegesterWord = document.querySelector("#loginOrRigester");
const message = document.getElementById("message");

toggleButton.addEventListener("click", () => {
    message.textContent = '';
    
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

        // Send an AJAX request to the PHP file
        fetch(endpoint, {
          method: 'POST',
          body: formData,
        })
        .then(response => response.text())
        .then(data => {
          // Display server response (success or error message)
         
          message.textContent = data;

          // If registration or login is successful, hide the form and show tasks
          if (data.includes('successful')) {
            document.getElementById("login-register-container").style.display = 'none'; // Hide form
            document.querySelector(".page-content").style.display = 'block'; // Show task content
          }
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

