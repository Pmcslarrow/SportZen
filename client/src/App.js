import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './views/LoginPage';
import Dashboard from './views/Dashboard';
import Survey from './views/Survey';

function App() {
  const [isAuthenticated, setAuthenticationStatus] = useState(false);

  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);


  return (
    <Router >
      <Switch>
        <Route path="/login" render={(props) => <LoginPage {...props} setAuthenticationStatus={setAuthenticationStatus}  />} />
        <Route path="/survey" render={(props) => <Survey {...props} setAuthenticationStatus={setAuthenticationStatus}  />} />

        <ProtectedRoute path="/" component={Dashboard} isAuthenticated={isAuthenticated}  />
        <ProtectedRoute path="/dashboard" component={Dashboard} isAuthenticated={isAuthenticated}  />

      </Switch>
    </Router>
  );
}


// If it is authenticated, then it goes to the component you pass. Otherwise, login page. 
export const ProtectedRoute = ({ component: Component, isAuthenticated,...rest }) => {
  const loginPath = '/login';
  console.log('isAuthenticated:', isAuthenticated);
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props}  />
        ) : (
          <Redirect
            to={{
              pathname: loginPath,
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

export default App