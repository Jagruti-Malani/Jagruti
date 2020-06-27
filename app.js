//Selector
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const clearTodo = document.querySelector(".clear-all-todo");

//CONSTANTS
const INCOMPLETE = "Incomplete";
const IMPORTANT = "Important";
const COMPLETED = "Completed";

//Event Listener
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addToDo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("click", filterTodo);

//Functions
function addToDo(event) {
  event.preventDefault();
  const todos = getTodosFromLocalStorage();
  if (todos.includes(todoInput.value)) {
    return;
  }
  createNewTodo(todoInput.value);
  saveLocalTodos(todos, todoInput.value);
  todoInput.value = "";
}

function deleteCheck(event) {
  const item = event.target;
  if (item.classList[0] === "todo-trash") {
    const todo = item.closest("li");
    todo.classList.add("fall");
    removeLocalTodos(todo);
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  }

  if (item.classList[0] === "todo-complete") {
    const todo = item.closest("li");
    todo.classList.toggle("completed");
    item.classList.toggle("todo-complete-btn");
    toggleCompleteInLocalTodos(todo);
  }

  if (item.classList[0] === "todo-imp") {
    const todo = item.closest("li").children[0];
    todo.classList.toggle("imp");
    item.classList.toggle("todo-imp-btn");
    toggleImportantInLocalTodos(todo);
  }
}

function filterTodo(e) {
  const todos = todoList.childNodes;
  todos.forEach(function (todo) {
    const todoChild = todo.firstChild;
    switch (e.target.value) {
      case "all":
        todoChild.style.display = "flex";
        break;
      case COMPLETED:
        if (todo.classList.contains("completed")) {
          todoChild.style.display = "flex";
        } else {
          todoChild.style.display = "none";
        }
        break;
      case INCOMPLETE:
        if (
          !todo.classList.contains("completed") ||
          !todoChild.classList.contains("imp")
        ) {
          todoChild.style.display = "flex";
        } else {
          todoChild.style.display = "none";
        }
        break;
      case IMPORTANT:
        if (todoChild.classList.contains("imp")) {
          todoChild.style.display = "flex";
        } else {
          todoChild.style.display = "none";
        }
    }
  });
}

function saveLocalTodos(todos, todo, complete = false, important = false) {
  let todoObj = { value: todo, complete: complete, important: important };
  todos.push(todoObj);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  let todos = getTodosFromLocalStorage();
  todos.forEach((todo) =>
    createNewTodo(todo.value, todo.complete, todo.important)
  );
}

function removeLocalTodos(todo) {
  let todos = getTodosFromLocalStorage();
  const todoIndex = findTodo(todos, todo.children[0].firstChild.innerText);
  todos.splice(todoIndex, 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function createNewTodo(todoTextValue, complete = false, important = false) {
  const todos = getTodosFromLocalStorage();
  const newTodo = document.createElement("li");

  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  const todoText = document.createElement("span");
  todoText.innerText = todoTextValue;
  todoText.classList.add("todo-text");

  const todoAction = document.createElement("div");
  todoAction.classList.add("todo-action");

  const todoImp = document.createElement("button");
  todoImp.classList.add("todo-imp");
  todoImp.innerHTML = "<i class='fas fa-star'></i>";

  const todoComplete = document.createElement("button");
  todoComplete.classList.add("todo-complete");
  todoComplete.innerHTML = "<i class='fas fa-check'></i>";

  const todoTrash = document.createElement("button");
  todoTrash.classList.add("todo-trash");
  todoTrash.innerHTML = "<i class='fas fa-trash'></i>";

  if (complete) {
    newTodo.classList.toggle("completed");
    todoComplete.classList.toggle("todo-complete-btn");
  }
  if (important) {
    todoDiv.classList.toggle("imp");
    todoImp.classList.toggle("todo-imp-btn");
  }

  todoAction.appendChild(todoImp);
  todoAction.appendChild(todoComplete);
  todoAction.appendChild(todoTrash);

  todoDiv.appendChild(todoText);
  todoDiv.appendChild(todoAction);

  newTodo.appendChild(todoDiv);

  todoList.appendChild(newTodo);
}

function getTodosFromLocalStorage() {
  if (localStorage.getItem("todos") != null) {
    return JSON.parse(localStorage.getItem("todos"));
  }
  return [];
}

function toggleCompleteInLocalTodos(todo) {
  let todos = getTodosFromLocalStorage();
  const todoIndex = findTodo(todos, todo.children[0].firstChild.innerText);
  todos[todoIndex].complete = !todos[todoIndex].complete;
  localStorage.setItem("todos", JSON.stringify(todos));
}

function toggleImportantInLocalTodos(todo) {
  let todos = getTodosFromLocalStorage();
  const todoIndex = findTodo(todos, todo.firstChild.innerText);
  todos[todoIndex].important = !todos[todoIndex].important;
  localStorage.setItem("todos", JSON.stringify(todos));
}

function findTodo(todos, todo) {
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].value == todo) return i;
  }
  return -1;
}
