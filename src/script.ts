// Defines an interface for Todo with properties id, title, and completed
interface Todo {
    id: number;
    title: string;
    completed: boolean;
}
  
  // Retrieves HTML elements for todo-input, add-todo-button, and todo-list
  const todoInput = document.getElementById("todo-input") as HTMLInputElement;
  const addTodoButton = document.getElementById("add-todo") as HTMLButtonElement;
  const todoList = document.getElementById("todo-list") as HTMLUListElement;
  
  // Initial array to store todos
  let todos: Todo[] = [];
  
  // Asynchronous function to fetch todos from API
  const fetchTodos = async (): Promise<void> => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5"); // Fetches the first 5
      const data: Todo[] = await response.json();
      // Updates todos with the fetched data
      todos = data;
      renderTodos();
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };
  
  // Function to render todos in the user interface
  const renderTodos = (): void => {
    // Clears the existing list in todoList
    todoList.innerHTML = "";
  
    // Iterates over todos and creates a new list element for each todo
    todos.forEach((todo) => {
      const li = document.createElement("li"); // Creates a new list item element for each todo
      
      // Adds the todo text to the list element
      li.textContent = todo.title; // Sets the text content of the list item to the todo title
      
      // Creates a checkbox to mark as completed
      const checkbox = document.createElement("input"); // Creates a new input element for the checkbox
      checkbox.type = "checkbox"; // Sets the input type to checkbox
      // Sets the checkbox status based on todo.completed
      checkbox.checked = todo.completed; // Sets the checkbox to checked if the todo is completed
      // Adds an event listener to change todo.completed on checkbox change
      checkbox.addEventListener("change", () => toggleTodoCompletion(todo.id)); // Adds an event listener to toggle the todo completion on checkbox change
      // Adds the checkbox to the list element
      li.appendChild(checkbox); // Adds the checkbox to the list item
      
      // Creates a button to delete the todo
      const deleteButton = document.createElement("button"); // Creates a new button element for deleting the todo
      deleteButton.textContent = "Delete"; // Sets the text content of the button to "Delete"
      // Adds an event listener to delete the todo on button click
      deleteButton.addEventListener("click", () => deleteTodo(todo.id)); // Adds an event listener to delete the todo on button click
      li.appendChild(deleteButton); // Adds the delete button to the list item
      
      todoList.appendChild(li); // Adds the list item to the todoList element
    });
  };
  
  
  // Add a new todo
  const addTodo = (): void => {
    const title = todoInput.value.trim(); // Retrieves the trimmed value from the todoInput element
    if (!title) {
      alert("Todo cannot be empty!"); // Alerts the user if the todo title is empty
      return;
    }
    const newTodo: Todo = {
      id: Date.now(), // Generates a unique id for the new todo
      title, // Sets the title of the new todo
      completed: false, // Sets the completed status of the new todo to false
    };
    todos.push(newTodo); // Adds the new todo to the todos array
    renderTodos(); // Calls the function to render the updated todos
    todoInput.value = ""; // Clears the input field after adding the todo
  };
  
  todoInput.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      addTodo(); // Calls the addTodo function if the Enter key is pressed
    }
  });
  
  // Toggle todo completion
  const toggleTodoCompletion = (id: number): void => {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo // Toggles the completed status of the todo with the specified id
    );
    renderTodos(); // Calls the function to render the updated todos
  };
  
  // Event listeners
  addTodoButton.addEventListener("click", addTodo); // Adds an event listener to the addTodoButton to call addTodo on click
  document.addEventListener("DOMContentLoaded", fetchTodos); // Adds an event listener to fetch todos on document load
  

  const saveTodos = (): void => {
    localStorage.setItem("todos", JSON.stringify(todos)); // Saves the todos array to localStorage
  };
  
  const loadTodos = (): void => {
    const saved = localStorage.getItem("todos"); // Retrieves the saved todos from localStorage
    if (saved) {
      todos = JSON.parse(saved); // Parses the saved todos back into the todos array
      renderTodos(); // Calls the function to render the loaded todos
    }
  };
  
  addTodoButton.addEventListener("click", () => {
    addTodo(); // Calls the addTodo function on addTodoButton click
    saveTodos(); // Saves the todos after adding a new one
  });
  
  document.addEventListener("DOMContentLoaded", () => {
    loadTodos(); // Loads the saved todos on document load
    fetchTodos(); // Fetches the todos from the API on document load
  });
  
  const deleteTodo = (id: number): void => {
    todos = todos.filter((todo) => todo.id !== id); // Filters out the todo with the specified id from the todos array
    renderTodos(); // Calls the function to render the updated todos
  };