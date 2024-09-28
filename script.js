let currentTasks = [
  {
    id: "item-1",
    name: "Dashboard Design Implementation",
    status: "Approved",
    statusClass: "approved",
    checked: true,
  },
  {
    id: "item-2",
    name: "Create a userflow",
    status: "In Progress",
    statusClass: "progress",
    checked: true,
  },
  {
    id: "item-3",
    name: "Application Implementation",
    status: "In Review",
    statusClass: "review",
    checked: false,
  },
];

let upcomingTasks = [
  {
    id: "item-4",
    name: "Dashboard Design Implementation",
    status: "Waiting",
    statusClass: "waiting",
    checked: false,
  },
  {
    id: "item-5",
    name: "Create a userflow",
    status: "Waiting",
    statusClass: "waiting",
    checked: false,
  },
];

let scheduleTasks = [
  {
    time: "08:00 - 09:00 AM",
    name: "Product Review",
    color: "yellow",
  },
  {
    time: "10:00 - 11:00 AM",
    name: "Design Meeting",
    color: "blue",
  },
  {
    time: "01:00 - 02:00 PM",
    name: "Team Meeting",
    color: "purble",
  },
];

const addButton = document.querySelector("#addButton");
const taskEventSelect = document.querySelector("#taskEventSelect");
const taskName = document.querySelector("#taskName");
const taskStatus = document.querySelector("#taskStatus");
const tasksWrapper = document.querySelector(".tasks-wrapper");

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

function renderTasks(tasks) {
  tasks.forEach((task) => {
    tasksWrapper.innerHTML += createTaskTemplate(task);
  });
}

function addTasks(task) {
  const upcomingTasksHeader = document.querySelector("div.header.upcoming");
  if (task.status != "Waiting") {
    upcomingTasksHeader.insertAdjacentHTML(
      "beforebegin",
      createTaskTemplate(task)
    );
    currentTasks.push(task);
  } else {
    tasksWrapper.innerHTML += createTaskTemplate(task);
    upcomingTasks.push(task);
  }
}

function createScheduleTaskTemplate(task) {
  return `
      <div class="task-box ${task.color}">
        <div class="description-task">
          <div class="time">${task.time}</div>
          <div class="task-name">${task.name}</div>
        </div>
        <div class="more-button"></div>
      </div>
    `;
}

function renderScheduleTasks(tasks, containerSelector) {
  const container = document.querySelector(containerSelector);
  tasks.forEach((task) => {
    container.innerHTML += createScheduleTaskTemplate(task);
  });
}

function renderAddingMenu() {
  const selectedValue = taskEventSelect.value;
  if (selectedValue === "task") {
    taskFields.style.display = "block";
    meetingFields.style.display = "none";
    noteFields.style.display = "none";
  } else if (selectedValue === "meeting") {
    taskFields.style.display = "none";
    meetingFields.style.display = "block";
    noteFields.style.display = "none";
  } else if (selectedValue === "note") {
    taskFields.style.display = "none";
    meetingFields.style.display = "none";
    noteFields.style.display = "block";
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

taskEventSelect.addEventListener("change", renderAddingMenu);
addButton.addEventListener("click", () => {
  switch (taskEventSelect.value) {
    case "task":
      newTask = {
        id: `item-${currentTasks.length + upcomingTasks.length + 1}`,
        name: taskName.value,
        status: taskStatus.value,
        statusClass: determineStatusClass(taskStatus.value),
        checked: false,
      };

      addTasks(newTask);
      break;
    case "meeting":
      console.log("meeting");
    case "note":
      console.log("note");
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
}

function markTaskUnComplete(taskElement) {
  const taskId = taskElement.querySelector(".task-item").id;
  const task = findTaskById(taskId);
  task.checked = false;
  taskElement.classList.remove("completed");
  taskElement.querySelector(".task-item").checked = false;

  const markCompleteButton = taskElement.querySelector(".mark-complete");
  markCompleteButton.textContent = "Mark as Completed";
}

function deleteTask(taskElement) {
  const taskId = taskElement.querySelector(".task-item").id;
  const taskIndex = findTaskIndexById(taskId);

  if (taskIndex !== -1) {
    currentTasks.splice(taskIndex, 1);
    taskElement.remove();
  }
}

function editTaskName(taskElement) {
  const newTaskName = prompt("Enter new task name:");
  if (newTaskName) {
    const taskId = taskElement.querySelector(".task-item").id;
    const task = findTaskById(taskId);
    task.name = newTaskName;
    taskElement.querySelector(".label-text").textContent = newTaskName;
  }
}

function findTaskById(id) {
  return (
    currentTasks.find((task) => task.id === id) ||
    upcomingTasks.find((task) => task.id === id)
  );
}

function findTaskIndexById(id) {
  let index = currentTasks.findIndex((task) => task.id === id);
  if (index === -1) {
    index = upcomingTasks.findIndex((task) => task.id === id);
  }
  return index;
}

document.addEventListener("DOMContentLoaded", () => {
  renderTasks(currentTasks);

  const upcomingTasksHeader = document.createElement("div");
  upcomingTasksHeader.classList.add("header", "upcoming");
  upcomingTasksHeader.textContent = "Upcoming Tasks";
  tasksWrapper.appendChild(upcomingTasksHeader);

  renderTasks(upcomingTasks);
  document.querySelector("#schedule-task-amount").innerHTML =
    scheduleTasks.length;

  renderScheduleTasks(scheduleTasks, ".right-content");
});
