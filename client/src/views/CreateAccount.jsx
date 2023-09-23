import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from "../config/firebase"
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'

import './login.css';

function CreateAccount({ setAuthenticationStatus }) {
      const history = useHistory();
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [errorStatus, setError] = useState(false)
      const [errorMessage, setMessage] = useState('')

      useEffect(() => {
            logout()
            setAuthenticationStatus(false)
      }, [])


      console.log(auth?.currentUser?.email)
    
      const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          if (!email.endsWith("willamette.edu")) {
            setMessage("Email does not belong to willamette.edu")
            setError(true)
            console.log("Email doesn't end with willamette.edu")
          } else {
            await createUserWithEmailAndPassword(auth, email, password)
            setAuthenticationStatus(true)
            history.push("/dashboard")
          }
        } catch(err) {
          console.log(err)
          
          const errorCode = err.code;

          switch (errorCode) {
            case "auth/email-already-in-use":
                  setMessage("Email is already in use. Please choose another email.")
                  console.log("Email error")
                  break;
            case "auth/weak-password":
                  setMessage("Password is too weak. Please choose a stronger password.")
                  console.log("Password error")
                  break;
            default:
                  console.log("Error")
                  setMessage("An error occurred during registration. Please try again later.")
                  break;
            }
          setError(true)
        }
      };


      const logout = async () => {
            try {
              await signOut(auth)
            } catch (err) {
              console.log(err)
            }
      }

      const loginPage = () => {
            history.push("/")
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
            <input type="submit" id="submit" value="Create Account" />
          </span>

          <span>
            <button onClick={loginPage}>Already have an account?</button>
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

export default CreateAccount;
