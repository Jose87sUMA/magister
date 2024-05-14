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
        });
       
    }

    return (
        <div className="form-container">
        <h2>Login</h2>
        <form>
            <div className="form-group">
            <label>Email:</label>
            <input
                id="email-address"
                name="email"
                type="email"                                    
                required                                                                                
                placeholder="Email address"
                onChange={(e)=>setEmail(e.target.value)}
            />
            </div>
            <div className="form-group">
            <label>Password:</label>
            <input
                id="password"
                name="password"
                type="password"                                    
                required                                                                                
                placeholder="Password"
                onChange={(e)=>setPassword(e.target.value)}
            />
            </div>
            <button type="submit" onClick={onLogin}>Login</button>
        </form>
        <p className='form-p'>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
    );
};

export default Login;
