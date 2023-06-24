import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './login.css';

function LoginPage({ setAuthenticationStatus }) {
      const [name, setName] = useState('');
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const history = useHistory();
    
      const handleSubmit = (e) => {
        e.preventDefault();
    
        // Perform form validation if needed
    
        // Make a POST request to the /auth endpoint
        fetch('/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            username,
            password,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            let isAuth = data.isAuthenticated
            setAuthenticationStatus(isAuth);

            if (isAuth) {
                  history.push('/dashboard');
            }
          })
          .catch((error) => {
            console.log('Error:', error);
          });
      };
    

  return (
    <div className="flex-container">
      <div>
        <form name="message" onSubmit={handleSubmit}>
          <span>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </span>

          <span>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            <input type="submit" id="submit" value="Get Started" />
          </span>
        </form>
      </div>

      <div id="right">
        <img src="/GRAPH.svg" alt="Image of an imaginary graph." />
      </div>
    </div>
  );
}

export default LoginPage;
