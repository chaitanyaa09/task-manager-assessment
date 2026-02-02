import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaCheck, FaUndo, FaSignOutAlt } from 'react-icons/fa';
import Login from './components/Login';
import './App.css';

function App() {
  // 1. Check if user is already logged in (from LocalStorage)
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // 2. Configure Axios to always send the Token
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // 3. Fetch Tasks (Only runs if token exists)
  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/api/tasks')
        .then(res => setTasks(res.data))
        .catch(err => {
          console.error(err);
          // If token is invalid (expired), logout
          if (err.response && err.response.status === 401) handleLogout();
        });
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setTasks([]); // Clear tasks from screen
  };

  // --- EXISTING TASK LOGIC (Same as before) ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    axios.post('http://localhost:5000/api/tasks', { title, description })
      .then(res => {
        setTasks([res.data, ...tasks]);
        setTitle('');
        setDescription('');
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/tasks/${id}`)
      .then(() => setTasks(tasks.filter(task => task._id !== id)));
  };

  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    axios.put(`http://localhost:5000/api/tasks/${id}`, { status: newStatus })
      .then(res => setTasks(tasks.map(task => (task._id === id ? res.data : task))));
  };

  // 4. CONDITIONAL RENDERING: Show Login if no token
  if (!token) {
    return <Login setToken={setToken} />;
  }

  // 5. Show Dashboard if token exists
  return (
    <div className="app-container">
      <header>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
           <h1>Task Master</h1>
           <button 
             onClick={handleLogout} 
             style={{background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: '1.5rem'}}
             title="Logout"
           >
             <FaSignOutAlt />
           </button>
        </div>
        <p>Welcome back! Manage your goals.</p>
      </header>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="task-form">
        <input 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="What needs to be done?" 
          required 
        />
        <input 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder="Add details (optional)" 
        />
        <button type="submit" className="add-btn">
          <FaPlus /> Add Task
        </button>
      </form>

      {/* Task List */}
      <div className="task-list">
        {tasks.map(task => (
          <div key={task._id} className={`task-card ${task.status}`}>
            <div className="task-content">
              <span className={`status-badge status-${task.status}`}>{task.status}</span>
              <h3>{task.title}</h3>
              <p>{task.description || "No description provided."}</p>
            </div>
            
            <div className="task-actions">
              <button className="btn-action btn-check" onClick={() => toggleStatus(task._id, task.status)}>
                {task.status === 'completed' ? <><FaUndo /> Undo</> : <><FaCheck /> Done</>}
              </button>
              <button className="btn-action btn-delete" onClick={() => handleDelete(task._id)}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;