//Selector
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const clearTodo = document.querySelector(".clear-all-todo");

//Event Listener
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addToDo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("click", filterTodo);
clearTodo.addEventListener("click", clearTodoList);

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
  if (item.classList[0] === "trash-btn") {
    const todo = item.parentElement;
    todo.classList.add("fall");
    removeLocalTodos(todo);
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  }

  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
  }
}

function filterTodo(e) {
  const todos = todoList.childNodes;
  todos.forEach(function (todo) {
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "Completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "Incomplete":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
    }
  });
}

function saveLocalTodos(todos, todo) {
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  let todos = getTodosFromLocalStorage();
  todos.forEach(function (todo) {
    createNewTodo(todo);
  });
}

function removeLocalTodos(todo) {
  let todos = getTodosFromLocalStorage();
  const todoIndex = todos.indexOf(todo.children[0].innerText);
  todos.splice(todoIndex, 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function clearTodoList(event) {
  event.preventDefault();
  localStorage.removeItem("todos");
  todoList.innerHTML = "";
}

function createNewTodo(todoText) {
  const todos = getTodosFromLocalStorage();
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  const newTodo = document.createElement("li");
  newTodo.innerText = todoText;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);

  const completeButton = document.createElement("button");
  completeButton.classList.add("complete-btn");
  completeButton.innerHTML = "<i class='fas fa-check'></i>";
  todoDiv.appendChild(completeButton);

  const trashButton = document.createElement("button");
  trashButton.classList.add("trash-btn");
  trashButton.innerHTML = "<i class='fas fa-trash'></i>";
  todoDiv.appendChild(trashButton);

  todoList.appendChild(todoDiv);
}

function getTodosFromLocalStorage() {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  return todos;
}
