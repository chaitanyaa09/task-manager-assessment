import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaCheck, FaUndo } from 'react-icons/fa'; // Import icons
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Fetch tasks
  useEffect(() => {
    axios.get('https://task-manager-assessment-v39u.onrender.com/api/tasks')
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  }, []);

  // Add Task
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    axios.post('https://task-manager-assessment-v39u.onrender.com/api/tasks', { title, description })
      .then(res => {
        setTasks([res.data, ...tasks]);
        setTitle('');
        setDescription('');
      });
  };

  // Delete Task
  const handleDelete = (id) => {
    axios.delete(`https://task-manager-assessment-v39u.onrender.com/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task._id !== id));
      });
  };

  // Toggle Status
  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    axios.put(`http://localhost:5000/api/tasks/${id}`, { status: newStatus })
      .then(res => {
        setTasks(tasks.map(task => (task._id === id ? res.data : task)));
      });
  };

  return (
    <div className="app-container">
      <header>
        <h1>Task Master</h1>
        <p style={{ color: '#6b7280' }}>Manage your daily goals efficiently</p>
      </header>
{/* Input Form */}
      <form onSubmit={handleSubmit} className="task-form">
        
        {/* Input 1 - Title */}
        <input 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="Task Title" 
          required 
        />
        
        {/* Input 2 - Description */}
        <input 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder="Description" 
        />
        
        {/* Button */}
        <button type="submit" className="add-btn">
          Add Task
        </button>
      </form>

      {/* Task List Grid */}
      <div className="task-list">
        {tasks.map(task => (
          <div key={task._id} className={`task-card ${task.status}`}>
            <div className="task-content">
              <span className={`status-badge status-${task.status}`}>
                {task.status}
              </span>
              <h3>{task.title}</h3>
              <p>{task.description || "No description provided."}</p>
            </div>
            
            <div className="task-actions">
              <button 
                className="btn-action btn-check" 
                onClick={() => toggleStatus(task._id, task.status)}
              >
                {task.status === 'completed' ? <><FaUndo /> Undo</> : <><FaCheck /> Done</>}
              </button>
              
              <button 
                className="btn-action btn-delete" 
                onClick={() => handleDelete(task._id)}
              >
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