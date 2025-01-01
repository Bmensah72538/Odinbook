import { useState } from 'react';
import client from '../tools/axiosClient';
import styles from './Signup.module.css';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/userContext';

function Signup() {
    const [credentials, setCredentials] = useState({ username: '', password: '', email: '' });
    const [confirmPassword, setConfirmPassword] = useState(''); // Separate state for password confirmation
    const [error, setError] = useState(null);
    const [signingUp, setSigningUp] = useState(false);
    const navigate = useNavigate();
    const { signup } = useUserContext();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const signupPayload = Object.fromEntries(new FormData(e.target));
        setError(null); 
        setSigningUp(true);
        if (credentials.password !== confirmPassword) {
            setError('Passwords do not match');
            setSigningUp(false);
            return;
        }
        try {
            await signup(signupPayload);
            setSigningUp(false);
            navigate('/');
        } catch (error) {
            setError(error);
            setSigningUp(false);
        };
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                <div className={styles['signup-form']}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                    />
                    <button
                        className={styles['login-button']}
                        type="submit"
                    >
                        {signingUp ? ('Signing up...') : ('Sign Up')}
                    </button>
                </div>
            </form>
            {error && <div className="error">{
                Array.isArray(error) ? (
                    error.map((err, index) => (
                        <ul key={index}>{err}</ul>
                    ))
                ) : (
                    <p>An unexpected error occured.</p>
                )
                }</div>}
            <p>
                Have an account? <button onClick={() => { navigate('/'); }}>Login here</button>
            </p>
        </div>
    );
}

export default Signup;
