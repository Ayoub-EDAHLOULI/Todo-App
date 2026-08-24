import { useEffect, useState } from "react";
import Auth from "./Auth";

function App() {

  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState('');
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    return token && email ? { token, email } : null;
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const getTodos = async () => {
      const res = await fetch('/api/v1/tasks');
      const todos = await res.json()

      setTodos(todos)
    }
    getTodos()
  },[])

  const handleAuthenticated = ({ token, email }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    setAuth({ token, email });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setAuth(null);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/v1/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ task: content, completed: false }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Could not add task');
        return;
      }

      setTodos([...todos, data.newTask]);
      setContent('');
    } catch (err) {
      setError('Network error, please try again');
    }
  };

  if (!auth) {
    return <Auth onAuthenticated={handleAuthenticated} />;
  }

  return (
    <main className="container">
      <button type="button" className="auth-switch logout" onClick={handleLogout}>
        Log out
      </button>
      <h1 className="title">Get Things Done !</h1>
      <form onSubmit={handleAddTask}>
        <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="✍️  Add Item..."
        className="input-box"
        required
        />
      </form>
      {error && <p className="auth-error">{error}</p>}
      <div className="Tasks">
        {(todos.length > 0) &&
        todos.map((todo) => (
          <div key={todo._id} className="task">{todo.task}</div>
        ))}
      </div>
    </main>
  );
}

export default App;
