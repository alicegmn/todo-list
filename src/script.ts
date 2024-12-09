// Defines an interface for Todo with properties id, title, and completed
interface Todo {
    id: number;
    title: string;
    completed: boolean;
}
  
  // gets HTML elements for the input of new todos
  const todoInput = document.getElementById("todo-input") as HTMLInputElement;
  const addTodoButton = document.getElementById("add-todo") as HTMLButtonElement;
  const todoList = document.getElementById("todo-list") as HTMLUListElement;
  
  // array to store todos
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
    todoList.innerHTML = ""; // Rensar den befintliga listan i todoList
    todos.forEach((todo) => {
      const li = document.createElement("li"); // Skapar ett nytt listobjekt för varje todo
      li.textContent = todo.title; // Sätter textinnehållet till todo-titeln

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => toggleTodoCompletion(todo.id));
      li.appendChild(checkbox);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteTodo(todo.id));
      li.appendChild(deleteButton);

      todoList.appendChild(li);
    });
    console.log("Renderade todos:", todos); // Loggar de renderade todos
  };
  
  
  // Add a new todo
  const addTodo = (): void => {
    const title = todoInput.value.trim();
    if (!title) {
      alert("Write something");
      return;
    }
    const newTodo: Todo = {
      id: Date.now(), // Genererar ett unikt (datum)id för den nya todo
      title, // Title = texten 
      completed: false, // Ej klar som standard
    };
    todos.push(newTodo); // Lägger till den nya todo i todos-arrayen
    console.log("Added new todo:", newTodo); // Loggar den nya todo
    renderTodos(); // Anropar funktionen för att rendera de uppdaterade todos
    saveTodos(); // Sparar todos efter att en ny har lagts till
    todoInput.value = ""; // Rensar inmatningsfältet 
  };
  
  todoInput.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      addTodo(); // Calls the addTodo function if the Enter key is pressed
    }
  });
  
  // Toggle todo completion
  const toggleTodoCompletion = (id: number): void => {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo //Toggle för completed
    );
    renderTodos(); // Renderar den uppdaterade todo-listan
  };
  
  // Event listeners
  addTodoButton.addEventListener("click", addTodo); // Adds an event listener to the addTodoButton to call addTodo on click
  document.addEventListener("DOMContentLoaded", () => {
    loadTodos(); // Försök att ladda todos från localStorage
    if (todos.length === 0) { // Om inga todos finns i localStorage
      fetchTodos(); // Hämta från API:et
    }
  }); // Adds an event listener to fetch todos on document load
  
// Sparar todos-arrayen till localStorage och consol.logar den
  const saveTodos = (): void => {
    localStorage.setItem("todos", JSON.stringify(todos)); 
    console.log("Todos in localStorage:", todos);
  };
  
  const loadTodos = (): void => {
    const saved = localStorage.getItem("todos"); // Hämtar sparade todos från localStorage
    console.log("Laddar todos från localStorage:", saved); // Loggar vad som finns i localStorage
    if (saved) {
      todos = JSON.parse(saved); // Parsar de sparade todos tillbaka till todos-arrayen
      console.log("Todos efter parsing:", todos); // Loggar de parsade todos
      renderTodos(); // Anropar funktionen för att rendera de laddade todos
    }
  };
  
  addTodoButton.addEventListener("click", () => {
    addTodo();
    saveTodos();
  });
  
  document.addEventListener("DOMContentLoaded", () => {
    loadTodos(); // Loads the saved todos on document load
    // fetchTodos(); // Fetches the todos from the API on document load (avstängd för jag bara vill att den ska laddas om det ej finns några i local storage)
  });
  
  const deleteTodo = (id: number): void => {
    todos = todos.filter((todo) => todo.id !== id);
    renderTodos();
  };