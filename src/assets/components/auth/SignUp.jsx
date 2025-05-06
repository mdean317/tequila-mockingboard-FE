import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Simplified SignUp component with success message
const SignUp = () => {
    const [formData, setFormData] = useState({ name: '', password: '', email: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); // State for the success message
    const navigate = useNavigate();

    const handleChange = (e) => {
        // Clear success message when user starts typing again
        if (success) setSuccess('');
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(''); // Clear previous success message

        try {
            const response = await fetch('http://18.234.134.4:8000/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Sign up successful!');
                setSuccess('Sign up successful!'); // *** Set success message ***
                setFormData({ name: '', password: '', email: '' }); // Clear form

                // Optional: Redirect after a short delay to show the message
                setTimeout(() => {
                    navigate('/signin');
                }, 1500); // Redirect after 1.5 seconds

            } else {
                const errorData = await response.json();
                setError(errorData?.detail || 'Failed to sign up.');
                console.error('Sign-up error response:', errorData);
            }
        } catch (err) {
            setError('Network error or server unreachable.');
            console.error('Sign-up fetch error:', err);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            {/* Display error message */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {/* Display success message */}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Username"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={!!success} // Disable form fields after success
                />
                <br />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={!!success} // Disable form fields after success
                />
                 <br />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={!!success} // Disable form fields after success
                />
                <br />
                <button type="submit" disabled={!!success}> {/* Disable button after success */}
                    Sign Up
                </button>
            </form>
             {/* Link to Sign In Page (optional if redirecting anyway) */}
             {!success && ( // Only show if not successful yet
                 <p>
                    Already have an account?{' '}
                    <button type="button" onClick={() => navigate('/signin')} style={{ color: 'blue', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                        Sign In
                    </button>
                </p>
             )}
        </div>
    );
};

export default SignUp;