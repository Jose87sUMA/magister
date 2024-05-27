// Login.js
import React, {useState}from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import '../../styles/auth/Form.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            navigate("/")
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
            setErrorMessage(errorMessage);
        });
       
    }

    return (
        <div className="auth-form-container">
            <h2 tabIndex={0}>Iniciar Sesión</h2>
            <form>
                <div className="form-group">
                    <label htmlFor="email" tabIndex={0}>Dirección de correo electrónico:</label>
                    <input
                        id="email"
                        name="email"
                        type="email"                                    
                        required                                                                                
                        placeholder="Dirección de correo electrónico"
                        onChange={(e)=>setEmail(e.target.value)}
                        tabIndex={0}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password" tabIndex={0}>Contraseña:</label>
                    <input
                        id="password"
                        name="password"
                        type="password"                                    
                        required                                                                                
                        placeholder="Contraseña"
                        onChange={(e)=>setPassword(e.target.value)}
                        tabIndex={0}
                    />
                </div>
                {errorMessage && <p className="error-message" tabIndex={0}>{errorMessage}</p>}
                <button type="submit" onClick={onLogin} tabIndex={0}>Iniciar Sesión</button>
            </form>
            <p className='form-p' tabIndex={0}>¿No tienes cuenta? <Link to="/signup" tabIndex={0}>Registrarse</Link></p>
        </div>
    );
};

export default Login;
