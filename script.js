/** MAIN */
function main() {
  render();
  taskMaker();
}

/** CONSTRUCTORS */
class Task {
  constructor(name, description, date) {
    this.name = name;
    this.description = description;
    this.date = date;
    this.isCompleted = false;
    this.id = generateId(15);
  }

  toggleCompleted() {
    this.isCompleted = !this.isCompleted;
  }

  edit(value) {
    this.name = value.name;
    this.description = value.description;
    this.date = value.date;
  }
}

function taskTemplate(task) {
  const article = document.createElement("article");
  article.classList.add("task");
  task.isCompleted && article.classList.toggle("completed");

  // TASK CONTENT
  const taskContent = document.createElement("section");
  taskContent.innerHTML = `
    <h1 class='task-name'>${task.name}</h1>
    <p class='task-description'>${task.description}</p>
    <span class='task-date'>${task.date.split("-").reverse().join("-")}</span>
    `;
  // TASK OPTIONS
  const taskOptions = document.createElement("div");
  const editBtn = document.createElement("button");
  const completeBtn = document.createElement("button");
  const deleteBtn = document.createElement("button");
  const checkImg = document.createElement("i");
  const checkImgContainer = document.createElement("div");

  editBtn.textContent = "Edit";
  completeBtn.textContent = task.isCompleted ? "inComplete" : "Complete";
  deleteBtn.textContent = "Delete";

  taskOptions.classList.add("task-options");
  taskOptions.appendChild(editBtn);
  taskOptions.appendChild(completeBtn);
  taskOptions.appendChild(deleteBtn);

  editBtn.classList.add("btn");
  completeBtn.classList.add("btn", "btn-green");
  deleteBtn.classList.add("btn", "btn-red");
  checkImg.classList.add("fa-solid", "fa-check");
  checkImgContainer.classList.add("check-img-container", "hidden");

  task.isCompleted && checkImgContainer.classList.toggle("hidden");

  editBtn.id = task.id;
  completeBtn.id = task.id;
  deleteBtn.id = task.id;

  editBtn.setAttribute("name", "edit");
  completeBtn.setAttribute("name", "complete");
  deleteBtn.setAttribute("name", "delete");

  let buttons = [editBtn, completeBtn, deleteBtn];
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.name === "edit") {
        editForm(task);
      } else if (button.name === "complete") {
        completeTask(task.id);
      }
    });
  });

  // TASK
  article.appendChild(taskContent);
  article.appendChild(taskOptions);
  checkImgContainer.appendChild(checkImg);
  article.appendChild(checkImgContainer);

  return article;
}

/** TASK FUNCTIONALITIES*/
function taskMaker() {
  const newTaskBtn = document.querySelector("#add-new-btn");
  const newTaskFormContainer = document.querySelector(".create-form-container");
  newTaskBtn.addEventListener("click", () => {
    show(newTaskFormContainer);
  });
  // triggers the listener for the add task button when the form is not hidden
  const addTaskBtn = document.querySelector("#add-task-btn");
  addTaskBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addTask();
    hide(newTaskFormContainer);
    render();
  });
}

function addTask(group = "default") {
  let items = JSON.parse(localStorage.getItem(group));

  // Gets the value of all the inputs
  const taskName = document.querySelector("input[name='task-name']").value;
  const taskDescription = document.querySelector(
    "input[name='task-description']"
  ).value;
  const taskDate = document.querySelector("input[name='task-date']").value;

  // set localstorage if either the local storage is empty/null or not
  if (items !== null) {
    localStorage.setItem(
      group,
      JSON.stringify([...items, new Task(taskName, taskDescription, taskDate)])
    );
  } else {
    localStorage.setItem(
      group,
      JSON.stringify([new Task(taskName, taskDescription, taskDate)])
    );
  }
}

function editForm(task) {
  const form = document.querySelector(".edit-form-modal");
  show(form);
  const editBtn = document.querySelector("#edit-btn");
  const cancelEditBtn = document.querySelector("#cancel-edit-btn");

  const taskNameInput = document.querySelector('input[name="edit-task-name"]');
  const taskDescriptionInput = document.querySelector(
    'input[name="edit-task-description"]'
  );
  const taskDateInput = document.querySelector('input[name="edit-task-date"]');

  taskNameInput.value = task.name;
  taskDescriptionInput.value = task.description;
  taskDateInput.value = task.date;

  listenForClicks(editBtn, () => {
    editTask(task.id, {
      name: taskNameInput.value,
      description: taskDescriptionInput.value,
      date: taskDateInput.value,
    });
    hide(form);
  });

  listenForClicks(cancelEditBtn, () => hide(form));
}

function editTask(taskId, value) {
  let items = JSON.parse(localStorage.getItem("default"));
  items = items.map((item) => {
    if (item.id === taskId) {
      item.name = value.name;
      item.description = value.description;
      item.date = value.date;
    }
    return item;
  });

  updateStorage(items);
}

function completeTask(taskId) {
  let items = JSON.parse(localStorage.getItem("default"));
  items = items.map((item) => {
    if (item.id === taskId) {
      item.isCompleted = !item.isCompleted;
    }
    return item;
  });

  updateStorage(items);
}

/** UTILITIES */
function render(group = "default") {
  const container = document.querySelector(".task-inner-container");
  const items = JSON.parse(localStorage.getItem(group));

  container.innerHTML = "";
  if (items === null) return;
  items.forEach((item) => {
    container.appendChild(taskTemplate(item));
  });
}

function show(target) {
  target.classList.remove("hidden");
}

function hide(target) {
  target.classList.add("hidden");
}

function listenForClicks(button, callback) {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    callback();
  });
}

function generateId(length) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    const randomNum = Math.floor(Math.random() * 35);
    const secondRandomNum = Math.floor(Math.random() * 10);
    id +=
      secondRandomNum % 2 === 0
        ? characters[randomNum].toUpperCase()
        : characters[randomNum];
  }

  return id;
}

function updateStorage(items, group = "default") {
  localStorage.setItem(group, JSON.stringify(items));

  render();
}

main();
