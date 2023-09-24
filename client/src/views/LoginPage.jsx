import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from "../config/firebase"
import { signOut, signInWithEmailAndPassword } from 'firebase/auth'
import { handleError } from './ErrorHandler';

import './login.css';

function LoginPage({ setAuthenticationStatus }) {
      const history = useHistory();
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [errorStatus, setError] = useState(false)
      const [errorMessage, setMessage] = useState('')

      useEffect(() => {
        logout()
        setAuthenticationStatus(false)
      }, [])

      //console.log(auth?.currentUser?.email)
      console.log(auth?.currentUser)
    
      const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);

          if (userCredential.user.emailVerified) {
            setAuthenticationStatus(true);
            history.push("/dashboard");
          } else {
            setMessage("Please verify your email before logging in.");
            setError(true);
          }
        } catch(err) {
          handleError(setError, setMessage, err);      
        }
      };

      const logout = async () => {
        try {
          await signOut(auth)
        } catch (err) {
          console.log(err)
        }
      }

      const createAccount = () => {
        history.push("/createAccount")
      }
      
    

  return (
    <div className="flex-container">
      <div>
        <form name="message" onSubmit={handleSubmit}>
          <span>
            <label htmlFor="Email">Email</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </span>

          <span>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </span>

          <span>
            <input type="submit" id="submit" value="Login" />
          </span>

          <span>
            <input type="button" value="Create Account" onClick={createAccount} />
          </span>

          {errorStatus && <p> {errorMessage} </p>}
        </form>
      </div>

      <div id="right">
        <img src="/GRAPH.svg" alt="Image of an imaginary graph." />
      </div>
    </div>
  );
}

export default LoginPage;
