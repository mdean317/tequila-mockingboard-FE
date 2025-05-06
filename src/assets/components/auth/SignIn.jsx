import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Simplified SignIn component
const SignIn = ({ onAuthSuccess }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous error

        // Basic validation
        if (!formData.email || !formData.password) {
            setError('Email and Password are required.');
            return;
        }

        try {
            // Ensure this endpoint matches your backend login URL
            const response = await fetch('http://18.234.134.4:8000/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('SignIn successful:', data);
                // Call the function passed from App.js to handle successful login
                onAuthSuccess(data);
                // Navigation is handled within the onAuthSuccess function in App.js
            } else {
                // Handle login errors from the backend
                const errorData = await response.json();
                console.error('SignIn error:', errorData);
                // Display error detail or a generic message
                setError(errorData?.detail || errorData?.error || errorData?.message || 'Invalid email or password.');
            }
        } catch (err) {
            // Handle network or other unexpected errors
            console.error('SignIn fetch error:', err);
            setError('Network error or server unreachable.');
        }
        // Removed setIsLoading logic
    };

    // Basic JSX structure
    return (
        <div>
            <h2>Sign In</h2>
            {/* Display error message if there is one */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                {/* Email Input */}
                <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <br />

                {/* Password Input */}
                <input
                    type="password"
                    name="password"
                    placeholder="Your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <br />

                {/* Submit Button */}
                <button type="submit">Sign In</button> {/* Removed loading state text */}
            </form>

            {/* Link to Sign Up Page */}
            <p>
                Don't have an account?{' '}
                <button type="button" onClick={() => navigate('/signup')} style={{ color: 'blue', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                    Sign Up
                </button>
            </p>
        </div>
    );
};

export default SignIn;
