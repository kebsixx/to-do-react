import { useState, useEffect } from "react";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiSave,
  FiX,
  FiFilter,
} from "react-icons/fi";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [sortOrder, setSortOrder] = useState("HighToLow"); // 'HighToLow' or 'LowToHigh'

  // Load todos from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
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
      createdAt: new Date().toDateString(),
      priority: priority, // Add priority
    };

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

  const startEditing = (id, text, priority) => {
    setEditingId(id);
    setEditValue(text);
    setPriority(priority);
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
        todo.id === id ? { ...todo, text: editValue, priority: priority } : todo
      )
    );
    setEditingId(null);
    setEditValue("");
    setError("");
  };

  const sortTodosByPriority = (todos, order) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };

    return [...todos].sort((a, b) => {
      const priorityA = priorityOrder[a.priority];
      const priorityB = priorityOrder[b.priority];

      if (order === "HighToLow") {
        return priorityA - priorityB;
      } else {
        return priorityB - priorityA;
      }
    });
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "HighToLow" ? "LowToHigh" : "HighToLow");
    setPriority("Medium"); // Reset priority to default
  };

  const sortedTodos = sortTodosByPriority(todos, sortOrder);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden font-sans">
        <div className="flex justify-between items-end px-6 py-6 bg-gradient-to-b from-blue-200 to-white">
          <h1 className="text-2xl font-bold text-blue-500">My To Do List</h1>
          <p className="text-xs font-medium text-white bg-blue-500 px-4 py-2 rounded-lg transition duration-500 hover:scale-110">
            Total Task : {todos.length}
          </p>
        </div>

        <div className="p-6">
          <div className="flex mb-6">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="Add a new task..."
              className="flex-grow px-4 py-2 text-sm text-gray-400 border border-gray-200 rounded-l-full transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent focus:text-gray-800"
            />
            <button
              onClick={addTodo}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-r-full transition duration-500 flex items-center hover:scale-120">
              <FiPlus className="mr-1" /> Add
            </button>
          </div>

          {error && (
            <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}
          <button
            onClick={toggleSortOrder}
            className="mb-4 flex mx-auto items-center px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:scale-110 transition duration-300">
            <FiFilter size={16} className="mr-2" />
            {"  "}
            {sortOrder === "HighToLow" ? "High to Low" : "Low to High"}
          </button>
          <ul className="space-y-3">
            {todos.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2 font-medium">No tasks</div>
                <div className="text-sm text-gray-500">Add your first task</div>
              </div>
            ) : (
              sortedTodos.map((todo) => (
                <li
                  key={todo.id}
                  className={`p-4 rounded-lg transition-all duration-500 hover:scale-103 ${
                    todo.completed
                      ? "bg-gradient-to-r from-blue-200 to-white-100"
                      : "bg-gray-100"
                  }`}>
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo.id)}
                      className="mt-1 mr-3 h-4 w-4 rounded"
                    />

                    <div className="flex-1">
                      {editingId === todo.id ? (
                        <div className="mb-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && saveEdit(todo.id)
                            }
                            className="w-full px-2 py-1 text-sm border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                            autoFocus
                          />
                          <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full px-2 py-1 mt-2 text-sm border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-gray-500">
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>
                      ) : (
                        <>
                          <div
                            className={`font-semibold ${
                              todo.completed
                                ? "line-through text-gray-500"
                                : "text-gray-800"
                            }`}>
                            {todo.text}
                          </div>
                          <div className="text-xs text-gray-500">
                            Priority: {todo.priority}
                          </div>
                        </>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        Added: {todo.createdAt}
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-3">
                      {editingId === todo.id ? (
                        <>
                          <button
                            onClick={() => saveEdit(todo.id)}
                            className="p-1.5 text-green-500 hover:bg-green-100 rounded-full transition hover:-translate-y-1">
                            <FiSave size={16} />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-1.5 text-red-500 hover:bg-red-100 rounded-full transition hover:-translate-y-1">
                            <FiX size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              startEditing(todo.id, todo.text, todo.priority)
                            }
                            className="p-1.5 text-orange-500 hover:bg-orange-100 rounded-full transition hover:-translate-y-1">
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="p-1.5 text-red-500 hover:bg-red-100 rounded-full transition hover:-translate-y-1">
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
