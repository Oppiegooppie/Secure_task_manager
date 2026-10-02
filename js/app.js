const SAMPLE_TASKS = [
  "Review DOM selectors",
  "Practice createElement",
  "Study event delegation"
];
const EMPTY_MESSAGE = "Task cannot be empty";
const STATE = { PENDING: "pending", COMPLETED: "completed" };
let taskCounter = 0;

const byId = (id) => document.getElementById(id);
const taskInput = byId("taskInput");
const addTaskBtn = byId("addTaskBtn");
const loadSamplesBtn = byId("loadSamplesBtn");
const taskList = byId("taskList");
const taskMessage = byId("taskMessage");
const totalCount = byId("totalCount");
const pendingCount = byId("pendingCount");
const completedCount = byId("completedCount");


const isBlank = (value) => String(value).trim() === "";

function showMessage(text) {
  taskMessage.textContent = text;
}

function makeButton(className, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  return button;
}

function generateTaskId() {
  const used = Array.from(taskList.querySelectorAll(".task-item"), (item) => item.dataset.taskId);
  let id;
  do {
    taskCounter += 1;
    id = `task-${taskCounter}`;
  } while (used.includes(id));
  return id;
}


function createTaskElement(taskText, taskId) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.dataset.taskId = taskId;
  taskItem.dataset.state = STATE.PENDING;

  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = taskText;

  taskItem.append(
    textSpan,
    makeButton("complete-btn", "Complete"),
    makeButton("edit-btn", "Edit"),
    makeButton("remove-btn", "Remove")
  );
  return taskItem;
}

function addTask(taskText) {
  if (isBlank(taskText)) {
    showMessage(EMPTY_MESSAGE);
    return;
  }
  taskList.appendChild(createTaskElement(taskText.trim(), generateTaskId()));
  taskInput.value = "";
  showMessage("");
  updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
  const nowCompleted = taskItem.classList.toggle("completed");
  taskItem.dataset.state = nowCompleted ? STATE.COMPLETED : STATE.PENDING;
  updateTaskCounts();
}

function beginTaskEdit(taskItem) {
  const textSpan = taskItem.querySelector(".task-text");
  if (!textSpan) return;

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.classList.add("edit-input");
  editInput.value = textSpan.textContent;

  textSpan.replaceWith(editInput);
  taskItem.querySelector(".edit-btn").textContent = "Save";
  editInput.focus();
}

function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector(".edit-input");
  if (!editInput) return;

  if (isBlank(editInput.value)) {
    showMessage(EMPTY_MESSAGE);
    return;
  }

  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = editInput.value.trim();

  editInput.replaceWith(textSpan);
  taskItem.querySelector(".edit-btn").textContent = "Edit";
  showMessage("");
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

function updateTaskCounts() {
  const items = Array.from(taskList.querySelectorAll(".task-item"));
  const completed = items.filter((item) => item.dataset.state === STATE.COMPLETED).length;
  totalCount.textContent = items.length;
  completedCount.textContent = completed;
  pendingCount.textContent = items.length - completed;
}

function handleTaskListClick(event) {
  const target = event.target;
  const taskItem = target.closest(".task-item");
  if (!taskItem) return;

  if (target.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (target.matches(".edit-btn")) {
    if (taskItem.querySelector(".edit-input")) {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
  } else if (target.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

function loadSampleTasks() {
  const fragment = document.createDocumentFragment();
  SAMPLE_TASKS.forEach((text) => {
    fragment.appendChild(createTaskElement(text, generateTaskId()));
  });
  taskList.appendChild(fragment);
  showMessage("");
  updateTaskCounts();
}


taskList.addEventListener("click", handleTaskListClick);
addTaskBtn.addEventListener("click", () => addTask(taskInput.value));
loadSamplesBtn.addEventListener("click", loadSampleTasks);
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addTask(taskInput.value);
});

updateTaskCounts();