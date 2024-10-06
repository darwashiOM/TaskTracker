import {
  addTaskToFirestore,
  updateTaskInFirebase,
  deleteTaskFromFirebase,
  deleteMeetingFromFirebase,
  addMeetingToFirebase,
  updateMeetingInFirebase,
  currentUser,
} from "./auth.js";

let currentTasks = [];

let currentMeetings = [];

const addButton = document.querySelector("#addButton");
const taskEventSelect = document.querySelector("#taskEventSelect");
const taskName = document.querySelector("#taskName");
const taskStatus = document.querySelector("#taskStatus");
const tasksWrapper = document.querySelector(".tasks-wrapper");

const meetingName = document.querySelector("#meetingName");
const meetingStartTime = document.querySelector("#meetingStartTime");
const meetingEndTime = document.querySelector("#meetingEndTime");
const meetingColor = document.querySelector("#meetingColor");
const meetingWrapper = document.querySelector(".right-content");

function createTaskTemplate(task) {
  return `
        <div class="task ${task.checked ? "completed" : ""}">
          <input
            class="task-item"
            name="task"
            type="checkbox"
            id="${task.id}"
            ${task.checked ? "checked" : ""}
          />
          <label for="${task.id}">
            <span class="label-text">${task.name}</span>
          </label>
          <span class="tag ${task.statusClass}">${task.status}</span>
          <div class="task-options">
              <button class="options-button">⋮</button>
              <div class="options-menu">
                  <button class="option change-name">Change Name</button>
                  <button class="option change-status">Change Status</button>
                  <button class="option mark-complete">${
                    task.checked ? "Uncheck" : "Mark as Completed"
                  }</button>
                  <button class="option delete-task">Delete</button>
              </div>
          </div>
        </div>
      `;
}

function createScheduleTaskTemplate(meeting) {
  return `
      <div class="task-box ${meeting.checked ? "completed" : ""} 
      ${meeting.color}" id="${meeting.id}">
        <div class="description-task">
          <div class="time">${meeting.time}</div>
          <div class="task-name">${meeting.name}</div>
        </div>
        
        <div class="task-options">
          <button class="options-button" id="meeting-options">⋮</button>
          <div class="options-menu">
            <button class="option change-name">Change Name</button>
            <button class="option change-color">Change Color</button>
            <button class="option mark-complete">${
              meeting.checked ? "Uncheck" : "Mark as Completed"
            }</button>
            <button class="option delete-task">Delete</button>
          </div>
        </div>
      </div>
    `;
}

function generateUniqueID() {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1e9);
  const uniqueID = `${timestamp}-${randomNum}`;

  return uniqueID;
}
export function addTasks(task, addToFirestore = true) {
  const upcomingTasksHeader = document.querySelector("div.header.upcoming");
  if (task.status != "Waiting") {
    upcomingTasksHeader.insertAdjacentHTML(
      "beforebegin",
      createTaskTemplate(task)
    );
  } else {
    tasksWrapper.innerHTML += createTaskTemplate(task);
  }
  currentTasks.push(task);

  if (currentUser && addToFirestore) {
    addTaskToFirestore(task);
  }
}

export function addMeeting(meeting, addToFirestore = true) {
  meetingWrapper.innerHTML += createScheduleTaskTemplate(meeting);
  currentMeetings.push(meeting);

  if (currentUser && addToFirestore) {
    addMeetingToFirebase(meeting);
  }
  document.querySelector("#schedule-task-amount").innerHTML =
    currentMeetings.length;
}

function renderAddingMenu() {
  const selectedValue = taskEventSelect.value;
  if (selectedValue === "task") {
    taskFields.style.display = "block";
    meetingFields.style.display = "none";
  } else if (selectedValue === "meeting") {
    taskFields.style.display = "none";
    meetingFields.style.display = "block";
  }
}

function determineStatusClass(taskStatus) {
  switch (taskStatus) {
    case "Approved":
      return "approved";
    case "In Progress":
      return "progress";
    case "In Review":
      return "review";
    default:
      return "waiting";
  }
}

function determinTime(startTime, endTime) {
  let [startHour, startMinute] = startTime.split(":").map(Number);
  let [endHour, endMinute] = endTime.split(":").map(Number);
  if (
    startHour > endHour ||
    (startHour === endHour && startMinute > endMinute)
  ) {
    [startHour, startMinute, endHour, endMinute] = [
      endHour,
      endMinute,
      startHour,
      startMinute,
    ];
  }

  function formatTime(hour, minute, addPeriod = false) {
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    minute = minute.toString().padStart(2, "0");
    return `${hour}:${minute} ${addPeriod ? period : ""}`;
  }

  const formattedStartTime = formatTime(startHour, startMinute);
  const formattedEndTime = formatTime(endHour, endMinute, true);

  return `${formattedStartTime} - ${formattedEndTime}`;
}

taskEventSelect.addEventListener("change", renderAddingMenu);
addButton.addEventListener("click", () => {
  switch (taskEventSelect.value) {
    case "task":
      let newTask = {
        id: `item-${generateUniqueID()}`,
        name: taskName.value,
        status: taskStatus.value,
        statusClass: determineStatusClass(taskStatus.value),
        checked: false,
      };

      addTasks(newTask);
      break;

    case "meeting":
      let newMeeting = {
        id: `item-${generateUniqueID()}`,
        name: meetingName.value,
        time: determinTime(meetingStartTime.value, meetingEndTime.value),
        color: meetingColor.value,
        checked: false,
      };

      addMeeting(newMeeting);
  }
});

tasksWrapper.addEventListener("click", (event) => {
  const taskElement = event.target.closest(".task");
  if (!taskElement) return;

  if (event.target.classList.contains("options-button")) {
    const index = Array.from(document.querySelectorAll(".task")).indexOf(
      taskElement
    );
    toggleOptionsMenu(index);
  } else if (event.target.classList.contains("change-status")) {
    changeTaskStatus(taskElement);
  } else if (event.target.classList.contains("mark-complete")) {
    if (taskElement.classList.contains("completed")) {
      markTaskUnComplete(taskElement);
    } else {
      markTaskComplete(taskElement);
    }
  } else if (event.target.classList.contains("delete-task")) {
    deleteTask(taskElement);
  } else if (event.target.classList.contains("change-name")) {
    editTaskName(taskElement);
  }
});

meetingWrapper.addEventListener("click", (event) => {
  const meetingElement = event.target.closest(".task-box");
  if (!meetingElement) return;

  if (event.target.classList.contains("more-button")) {
    const index = Array.from(document.querySelectorAll(".task-box")).indexOf(
      meetingElement
    );
    toggleOptionsMenu(index);
  } else if (event.target.classList.contains("change-color")) {
    changeMeetingColor(meetingElement);
  } else if (event.target.classList.contains("mark-complete")) {
    if (meetingElement.classList.contains("completed")) {
      markMeetingUnComplete(meetingElement);
    } else {
      markMeetingComplete(meetingElement);
    }
  } else if (event.target.classList.contains("delete-task")) {
    deleteMeeting(meetingElement);
  } else if (event.target.classList.contains("change-name")) {
    editMeetingName(meetingElement);
  }
});

function changeTaskStatus(taskElement) {
  const newStatus = prompt(
    "Enter new status (Approved, In Progress, In Review, Waiting):"
  );
  if (newStatus) {
    const taskId = taskElement.querySelector(".task-item").id;
    const task = findTaskById(taskId);
    task.status = newStatus;
    task.statusClass = determineStatusClass(newStatus);
    taskElement.querySelector(".tag").textContent = newStatus;
    taskElement.querySelector(".tag").className = `tag ${task.statusClass}`;

    if (currentUser) {
      updateTaskInFirebase(taskId, task);
    }
  }
}

function changeMeetingColor(meetingElement) {
  const newColor = prompt("Enter new color (red, green, yellow, blue):");
  if (newColor) {
    meetingElement.className = `task-box ${newColor}`;

    const meeting = findMeetingById(meetingElement.id);
    meeting.color = newColor;
    if (currentUser) {
      updateMeetingInFirebase(meetingElement.id, meeting);
    }
  }
}

function toggleOptionsMenu(index) {
  const optionsMenus = document.querySelectorAll(".options-menu");
  optionsMenus.forEach((menu, menuIndex) => {
    if (menuIndex !== index) {
      menu.classList.remove("show");
    }
  });
  const optionsMenu = optionsMenus[index];
  if (optionsMenu) {
    optionsMenu.classList.toggle("show");
  }
}

function markTaskComplete(taskElement) {
  const taskId = taskElement.querySelector(".task-item").id;
  const task = findTaskById(taskId);
  task.checked = true;
  taskElement.classList.add("completed");
  taskElement.querySelector(".task-item").checked = true;

  const markCompleteButton = taskElement.querySelector(".mark-complete");
  markCompleteButton.textContent = "Uncheck";

  if (currentUser) {
    updateTaskInFirebase(taskId, task);
  }
}

function markTaskUnComplete(taskElement) {
  const taskId = taskElement.querySelector(".task-item").id;
  const task = findTaskById(taskId);
  task.checked = false;
  taskElement.classList.remove("completed");
  taskElement.querySelector(".task-item").checked = false;

  const markCompleteButton = taskElement.querySelector(".mark-complete");
  markCompleteButton.textContent = "Mark as Completed";

  if (currentUser) {
    updateTaskInFirebase(taskId, task);
  }
}

function markMeetingComplete(meetingElement) {
  meetingElement.classList.add("completed");
  const markCompleteButton = meetingElement.querySelector(".mark-complete");
  markCompleteButton.textContent = "Uncheck";
  const meeting = findMeetingById(meetingElement.id);
  meeting.checked = true;

  if (currentUser) {
    updateMeetingInFirebase(meetingElement.id, meeting);
  }
}

function markMeetingUnComplete(meetingElement) {
  meetingElement.classList.remove("completed");
  const markCompleteButton = meetingElement.querySelector(".mark-complete");
  markCompleteButton.textContent = "Mark as Completed";

  const meeting = findMeetingById(meetingElement.id);
  meeting.checked = false;

  if (currentUser) {
    updateMeetingInFirebase(meetingElement.id, meeting);
  }
}

function deleteTask(taskElement) {
  const taskId = taskElement.querySelector(".task-item").id;
  const taskIndex = findTaskIndexById(taskId);

  if (taskIndex !== -1) {
    currentTasks.splice(taskIndex, 1);
    taskElement.remove();
  }

  if (currentUser) {
    deleteTaskFromFirebase(taskId);
  }
}

function deleteMeeting(meetingElement) {
  const meetingId = meetingElement.id;
  const meetingIndex = findMeetingIndexById(meetingId);

  if (meetingIndex !== -1) {
    currentMeetings.splice(meetingIndex, 1);
    meetingElement.remove();
  }

  if (currentUser) {
    deleteMeetingFromFirebase(meetingId);
  }
}

function editTaskName(taskElement) {
  const newTaskName = prompt("Enter new task name:");
  if (newTaskName) {
    const taskId = taskElement.querySelector(".task-item").id;
    const task = findTaskById(taskId);
    task.name = newTaskName;
    taskElement.querySelector(".label-text").textContent = newTaskName;

    if (currentUser) {
      updateTaskInFirebase(taskId, task);
    }
  }
}

function editMeetingName(meetingElement) {
  const newMeetingName = prompt("Enter new task name:");
  if (newMeetingName) {
    const meetingId = meetingElement.id;
    const meeting = findMeetingById(meetingId);
    meeting.name = newMeetingName;
    meetingElement.querySelector(".task-name").textContent = newMeetingName;

    if (currentUser) {
      updateMeetingInFirebase(meetingId, meeting);
    }
  }
}

function findTaskById(id) {
  return currentTasks.find((task) => task.id === id);
}

function findMeetingById(id) {
  return currentMeetings.find((meeting) => meeting.id === id);
}

function findTaskIndexById(id) {
  let index = currentTasks.findIndex((task) => task.id === id);
  return index;
}

function findMeetingIndexById(id) {
  let index = currentMeetings.findIndex((meeting) => meeting.id === id);
  return index;
}
