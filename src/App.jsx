import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEdit2, FiSave, FiX } from "react-icons/fi";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");

  // Load todos from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos);
      // Sort by newest first when loading
      const sortedTodos = [...parsedTodos].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTodos(sortedTodos);
    }
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!inputValue.trim()) {
      setError("Task cannot be empty");
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    // Add new task at the beginning of the array
    setTodos([newTodo, ...todos]);
    setInputValue("");
    setError("");
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditValue(text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue("");
    setError("");
  };

  const saveEdit = (id) => {
    if (!editValue.trim()) {
      setError("Task cannot be empty");
      return;
    }

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editValue } : todo
      )
    );
    setEditingId(null);
    setError("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Sort todos by newest first whenever they change
  const sortedTodos = [...todos].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-purple-600 to-blue-500">
          <h1 className="text-2xl font-bold text-white">My To-Do List</h1>
        </div>

        <div className="p-6">
          <div className="flex mb-6">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
              placeholder="Add a new task..."
              className="flex-grow px-4 py-3 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={addTodo}
              className="px-4 py-3 bg-purple-500 text-white rounded-r-lg hover:bg-purple-600 transition flex items-center">
              <FiPlus className="mr-1" /> Add
            </button>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <ul className="space-y-3">
            {sortedTodos.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">No tasks yet</div>
                <div className="text-sm text-gray-500">
                  Add your first task above
                </div>
              </div>
            ) : (
              sortedTodos.map((todo) => (
                <li
                  key={todo.id}
                  className={`p-4 border rounded-lg transition-all duration-200 ${
                    todo.completed ? "bg-gray-50" : "bg-white"
                  }`}>
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo.id)}
                      className="mt-1 mr-3 h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />

                    <div className="flex-1">
                      {editingId === todo.id ? (
                        <div className="mb-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && saveEdit(todo.id)
                            }
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div
                          className={`${
                            todo.completed
                              ? "line-through text-gray-500"
                              : "text-gray-800"
                          }`}>
                          {todo.text}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        Added: {formatDate(todo.createdAt)}
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-3">
                      {editingId === todo.id ? (
                        <>
                          <button
                            onClick={() => saveEdit(todo.id)}
                            className="p-1.5 text-green-500 hover:bg-green-50 rounded-full transition">
                            <FiSave size={16} />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition">
                            <FiX size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(todo.id, todo.text)}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-full transition">
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition">
                            <FiTrash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
