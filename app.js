// DOM elements
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const todoList = document.getElementById("todo-list");
const inProgressList = document.getElementById("in-progress-list");
const doneList = document.getElementById("done-list");
const quoteDisplay = document.createElement("p");

quoteDisplay.className = "quote-display";

// Append quoteDisplay below task management area
document
  .querySelector(".container")
  .insertBefore(quoteDisplay, document.querySelector(".task-lists"));

// Event listener for adding tasks
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText) {
    addTaskToList(taskText, "todo");
    taskInput.value = ""; // Clear input field
    fetchRandomQuote(); // Fetch a new quote when a task is added
  }
});

// Add task to the appropriate list
function addTaskToList(taskText, listType) {
  const task = document.createElement("li");
  task.textContent = taskText;
  task.setAttribute("draggable", true);
  task.addEventListener("dragstart", dragStart);
  task.addEventListener("dragend", dragEnd);

  switch (listType) {
    case "todo":
      todoList.appendChild(task);
      break;
    case "in-progress":
      inProgressList.appendChild(task);
      break;
    case "done":
      doneList.appendChild(task);
      break;
  }

  saveTasks();
}

// Allow task to be dragged
function allowDrop(event) {
  event.preventDefault();
}

// Handle drag start event
function dragStart(event) {
  event.target.classList.add("dragging");
}

// Handle drag end event
function dragEnd(event) {
  event.target.classList.remove("dragging");
  saveTasks();
}

// Handle drop event
function drop(event) {
  event.preventDefault();
  const draggedTask = document.querySelector(".dragging");
  event.target.appendChild(draggedTask);
  saveTasks();
}

// Save tasks to localStorage
function saveTasks() {
  const todoTasks = Array.from(todoList.children).map(
    (task) => task.textContent
  );
  const inProgressTasks = Array.from(inProgressList.children).map(
    (task) => task.textContent
  );
  const doneTasks = Array.from(doneList.children).map(
    (task) => task.textContent
  );

  localStorage.setItem("todo", JSON.stringify(todoTasks));
  localStorage.setItem("in-progress", JSON.stringify(inProgressTasks));
  localStorage.setItem("done", JSON.stringify(doneTasks));
}

// Load tasks from localStorage
function loadTasks() {
  const todoTasks = JSON.parse(localStorage.getItem("todo")) || [];
  const inProgressTasks = JSON.parse(localStorage.getItem("in-progress")) || [];
  const doneTasks = JSON.parse(localStorage.getItem("done")) || [];

  todoTasks.forEach((task) => addTaskToList(task, "todo"));
  inProgressTasks.forEach((task) => addTaskToList(task, "in-progress"));
  doneTasks.forEach((task) => addTaskToList(task, "done"));
}

// Load saved tasks when the page is loaded
loadTasks();

// Fetch a random quote and display it
function fetchRandomQuote() {
  fetch("https://api.adviceslip.com/advice")
    .then((response) => response.json())
    .then((data) => {
      const quoteText = `${data.slip.advice}`;
      quoteDisplay.textContent = `"${quoteText}"`;
    })
    .catch((error) => {
      console.error("Error fetching quote:", error);
      quoteDisplay.textContent = "Could not fetch quote at the moment.";
    });
}
