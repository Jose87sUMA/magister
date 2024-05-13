// Signup.js
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../../firebase';
import '../../styles/auth/Form.css';

const Signup = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault()
       
        await createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
              // Signed in
              const user = userCredential.user;
              console.log(user);
              navigate("/")
              // ...
          })
          .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorCode, errorMessage);
              // ..
          });
   
     
      }

    return (
        <div className="form-container">
            <h2>Sign Up</h2>
            <form>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        label="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}  
                        required                                    
                        placeholder="Email address"                                
                    />           
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        label="Create password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required                                 
                        placeholder="Password"              
                    />
                </div>
                <button type="submit" onClick={onSubmit}>Sign Up</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
};

export default Signup;
