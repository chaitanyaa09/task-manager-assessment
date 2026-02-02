import { useState } from 'react';
import axios from 'axios';

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between Login/Register
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Change URL to your Render backend or localhost
    const API_URL = 'http://localhost:5000/api/auth'; 
    const endpoint = isRegistering ? '/register' : '/login';

    try {
      const res = await axios.post(`${API_URL}${endpoint}`, { username, password });
      
      if (isRegistering) {
        alert('Registration Successful! Please Login.');
        setIsRegistering(false); // Switch back to login mode
      } else {
        // Login Mode: Save token and update App state
        const token = res.data.token;
        localStorage.setItem('token', token);
        setToken(token);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>{isRegistering ? 'Register' : 'Login'}</h1>
        <p>Secure Task Manager Access</p>
      </header>

      <form onSubmit={handleSubmit} className="task-form">
        {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}
        
        <input 
          placeholder="Username" 
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        
        <button type="submit" className="add-btn">
          {isRegistering ? 'Sign Up' : 'Login'}
        </button>

        <p style={{marginTop: '20px', textAlign: 'center', color: '#666'}}>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"} 
          <span 
            onClick={() => setIsRegistering(!isRegistering)} 
            style={{color: '#6366f1', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px'}}
          >
            {isRegistering ? 'Login here' : 'Register here'}
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;