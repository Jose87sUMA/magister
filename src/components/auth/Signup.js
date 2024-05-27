import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import '../../styles/auth/Form.css';

// Signup.js

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log(user);
            navigate('/');
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            setErrorMessage(errorMessage);
        }
    };

    return (
        <div className="auth-form-container">
            <h2 tabIndex={0}>Registrarse</h2>
            <form>
                <div className="form-group">
                    <label htmlFor="email" tabIndex={0}>Dirección de correo electrónico:</label>
                    <input
                        id="email"
                        type="email"
                        label="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Dirección de correo electrónico"
                        tabIndex={0}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password" tabIndex={0}>Contraseña:</label>
                    <input
                        id="password"
                        name="password"
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Contraseña"
                        tabIndex={0}
                    />
                </div>
                {errorMessage && <p className="error-message" tabIndex={0}>{errorMessage}</p>}
                <button type="submit" onClick={onSubmit} tabIndex={0}>Registrarse</button>
            </form>
            <p className='form-p' tabIndex={0}>¿Ya tienes cuenta? <Link to="/login">Iniciar Sesión</Link></p>
        </div>
    );
};

export default Signup;
