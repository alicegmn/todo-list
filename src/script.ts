interface Todo {
    id: number;
    title: string;
    completed: boolean;
  }
  
  const todoInput = document.getElementById("todo-input") as HTMLInputElement;
  const addTodoButton = document.getElementById("add-todo") as HTMLButtonElement;
  const todoList = document.getElementById("todo-list") as HTMLUListElement;
  
  let todos: Todo[] = [];
  
  // Fetch todos from API
  const fetchTodos = async (): Promise<void> => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
      const data: Todo[] = await response.json();
      todos = data;
      renderTodos();
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };
  
  const renderTodos = (): void => {
    todoList.innerHTML = ""; // Rensa befintlig lista
  
    todos.forEach((todo) => {
      const li = document.createElement("li");
  
      // Lägg till todo-texten
      li.textContent = todo.title;
  
      // Skapa checkbox för att markera som klar
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => toggleTodoCompletion(todo.id));
      li.appendChild(checkbox);
  
      // Skapa en knapp för att radera todo
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Ta bort";
      deleteButton.addEventListener("click", () => deleteTodo(todo.id));
      li.appendChild(deleteButton);
  
      todoList.appendChild(li);
    });
  };
  
  
  // Add a new todo
  const addTodo = (): void => {
    const title = todoInput.value.trim();
    if (!title) {
      alert("Todo cannot be empty!");
      return;
    }
    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
    };
    todos.push(newTodo);
    renderTodos();
    todoInput.value = "";
  };
  
  todoInput.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      addTodo();
    }
  });
  
  // Toggle todo completion
  const toggleTodoCompletion = (id: number): void => {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    renderTodos();
  };
  
  // Event listeners
  addTodoButton.addEventListener("click", addTodo);
  document.addEventListener("DOMContentLoaded", fetchTodos);
  


  const saveTodos = (): void => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  const loadTodos = (): void => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      todos = JSON.parse(saved);
      renderTodos();
    }
  };
  
  addTodoButton.addEventListener("click", () => {
    addTodo();
    saveTodos();
  });
  
  document.addEventListener("DOMContentLoaded", () => {
    loadTodos();
    fetchTodos();
  });
  
  const deleteTodo = (id: number): void => {
    todos = todos.filter((todo) => todo.id !== id);
    renderTodos();
  };
  