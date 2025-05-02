import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignIn = ({ onAuthSuccess }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    const handleSubmit = (event) => {
        event.preventDefault()
        setError('')
        setLoading(true)

        fetch('http://18.234.134.4:8000/api/auth/login/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, password: password }),
          })
            .then(response => response.json()) // Try to convert the response to JSON
            .then(data => {
              if (data.key && data.user) {
                localStorage.setItem('authToken', data.key);
                onAuthSuccess(data.user);
                navigate('/ingredients');
              } else if (data.non_field_errors) {
                throw new Error(data.non_field_errors[0] || 'Sign-in failed.');
              } else {
                throw new Error('Sign-in failed due to an unexpected response.');
              }
            })
            .catch(error => {
              setError(error.message || 'Sign-in failed.');
              setLoading(false);
              console.error('Sign-in error:', error);
            });
    }

    return (
        <div>
          <h2>Log In</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Logging In...' : 'Log In'}
            </button>
            <p>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </form>
          <p>
              <Link to="/">Back to Homepage</Link>
            </p>
        </div>
      );
    };
    
    export default SignIn;