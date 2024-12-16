import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editText, setEditText] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isSorting, setIsSorting] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3005/todos")
      .then((todoData) => setTodos(todoData.data));
  }, []);

  const addTodo = () => {
    if (newTodo === "") return;
    const newTask = {
      id: Date.now(),
      title: newTodo,
      completed: false,
    };
    axios
      .post("http://localhost:3005/todos", newTask)
      .then((rawResponse) => setTodos([...todos, rawResponse.data]));
    setNewTodo("");
  };

  const deleteTodo = (id) => {
    axios
      .delete(`http://localhost:3005/todos/${id}`)
      .then(() => setTodos(todos.filter((todo) => todo.id !== id)));
  };

  const toggleCompleted = (id) => {
    const todo = todos.find((todo) => todo.id === id);
    const updatedTodo = { ...todo, completed: !todo.completed };

    axios.put(`http://localhost:3005/todos/${id}`, updatedTodo).then(() => {
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    });
  };

  const updateTodo = (id) => {
    if (editText === "") return;
    const updatedTodo = todos.find((todo) => todo.id === id);
    updatedTodo.title = editText;

    axios.put(`http://localhost:3005/todos/${id}`, updatedTodo).then(() => {
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
      setEditId(null);
      setEditText("");
    });
  };

  let filterTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchText.toLowerCase())
  );

  if (isSorting) {
    filterTodos = [...filterTodos].sort((a, b) =>
      a.title.localCompare(b.title)
    );
  }

  return (
    <div className="App">
      <input
        type="text"
        placeholder="add new task..."
        value={newTodo}
        onChange={(t) => setNewTodo(t.target.value)}
      />
      <button onClick={addTodo}>+</button>
      <input
        type="text"
        placeholder="Search todos..."
        value={searchText}
        onChange={(todo) => setSearchText(todo.target.value)}
      />
      <button onClick={() => setIsSorting((prev) => !prev)}>
        {isSorting ? "Original Order" : "Sort Alphabetically"}
      </button>
      <ul>
        {todos.map(({ id, title, completed }) => (
          <div key={id}>
            {editId === id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(t) => setEditText(t.target.value)}
                />
                <button onClick={() => updateTodo(id)}>Save</button>
                <button onClick={() => setEditId(id)}>Cancel</button>
              </>
            ) : (
              <>
                <div onClick={() => toggleCompleted(id)}>{title}</div>
                <button onClick={() => deleteTodo(id)}>delete</button>
                <button
                  onClick={() => {
                    setEditId(id);
                    setEditText(title);
                  }}
                >
                  update
                </button>
              </>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
}

export default App;
