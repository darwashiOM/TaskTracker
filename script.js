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

function createTaskTemplate(task) {
  return `
      <div class="task">
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
                <button class="option change-status">Change Status</button>
                <button class="option mark-complete">Mark as Completed</button>
                <button class="option delete-task">Delete</button>
            </div>
        </div>
      </div>
    `;
}

function renderTasks(tasks, containerSelector) {
  const container = document.querySelector(containerSelector);
  tasks.forEach((task) => {
    container.innerHTML += createTaskTemplate(task);
  });
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
document.addEventListener("DOMContentLoaded", () => {
  renderTasks(currentTasks, ".tasks-wrapper");

  const upcomingTasksHeader = document.createElement("div");
  upcomingTasksHeader.classList.add("header", "upcoming");
  upcomingTasksHeader.textContent = "Upcoming Tasks";
  document.querySelector(".tasks-wrapper").appendChild(upcomingTasksHeader);

  renderTasks(upcomingTasks, ".tasks-wrapper");
  document.querySelector("#schedule-task-amount").innerHTML =
    scheduleTasks.length;

  taskEventSelect.addEventListener("change", renderAddingMenu);
});

renderScheduleTasks(scheduleTasks, ".right-content");
