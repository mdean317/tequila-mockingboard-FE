import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = ({ onAuthSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== passwordConfirmation) {
      setError("Passwords don't match.");
      setLoading(false);
      return;
    }

    fetch('http://18.234.134.4:8000/api/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, email: email, password: password }),
    })
      .then((response) => {
        setLoading(false);
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((data) => {
            // Adjust error handling based on your backend's registration response
            let errorMessage = 'Sign-up failed.';
            if (data.username) errorMessage += ` Username: ${data.username.join(', ')}`;
            if (data.email) errorMessage += ` Email: ${data.email.join(', ')}`;
            if (data.password) errorMessage += ` Password: ${data.password.join(', ')}`;
            if (data.non_field_errors) errorMessage += ` General: ${data.non_field_errors.join(', ')}`;
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        // If registration is successful and the backend logs in automatically
        if (data.key && data.user) {
          localStorage.setItem('authToken', data.key);
          onAuthSuccess(data.user);
          navigate('/ingredients');
        } else {
          // If registration requires separate login or email verification
          alert('Registration successful! You may need to log in.');
          navigate('/signin');
        }
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message || 'Sign-up failed.');
        console.error('Sign-up error:', error);
      });
  };

  return (
    <div>
      <h2>Sign Up</h2>
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
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div>
          <label htmlFor="passwordConfirmation">Confirm Password:</label>
          <input
            type="password"
            id="passwordConfirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        <p>
          Already have an account? <Link to="/signin">Log In</Link>
        </p>
      </form>
        <p>
        <Link to="/">Back to Homepage</Link>
        </p>
    </div>
  );
};

export default SignUp;