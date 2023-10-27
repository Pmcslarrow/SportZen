import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from "../config/firebase"
import { createUserWithEmailAndPassword, signOut, sendEmailVerification } from 'firebase/auth'
import { handleError } from './ErrorHandler';
import { db } from '../config/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import './login.css';

// This component utilizes Firebase auth to create a new user, ensuring that the email domain is restricted to "willamette.edu".
// After successfully creating an account, adhering to the specified email format and password requirements, the CreateAccount
// function component employs setTimeout to display the message "Please verify your email" for a duration of five seconds.
// Following this, the user is automatically redirected to the login page, where they can attempt to log in once they have verified
// their email.

function CreateAccount({ setAuthenticationStatus }) {
      const history = useHistory();
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [errorStatus, setError] = useState(false)
      const [errorMessage, setMessage] = useState('')
      const userCollectionRef = collection(db, "users");


      useEffect(() => {
            logout()
            setAuthenticationStatus(false)
      }, [])

      const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          if (!email.endsWith("willamette.edu")) {
            setMessage("Email does not belong to willamette.edu");
            setError(true);
          } else {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Adds email, name and timestamp to user table
            addUserData();

            // Send email verification
            await sendEmailVerification(userCredential.user);
            setMessage("Please verify your email.")
            setError(true)

            // Redirect to login page after 5 seconds
            setTimeout(() => {
              history.push("/");
            }, 5000);
          }
        } catch(err) {
          handleError(setError, setMessage, err);
        }
      };

      const addUserData= async () => {
        const currentDate = Timestamp.now();
        const atIndex = auth?.currentUser?.email?.indexOf('@');
        const userName = atIndex !== -1 ? auth?.currentUser?.email?.slice(0, atIndex) : ''; 
      
        await addDoc(userCollectionRef, {
          name: userName,
          email: auth?.currentUser?.email,
          date: currentDate,
          admin: false,
          wins: 0,
          UID: auth?.currentUser?.uid,
        });
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
            <input type="button" value="Already have an account?" onClick={loginPage} />
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
