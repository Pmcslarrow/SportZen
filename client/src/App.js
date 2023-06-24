import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './views/LoginPage';
import Dashboard from './views/Dashboard';

function App() {
  const [isAuthenticated, setAuthenticationStatus] = useState(false);

  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);

  return (
    <Dashboard />
  )


  /*
  WORKING SOLUTION > JUST USE DASHBOARD RIGHT NOW UNTIL YOU FINISH IT
  return (
    <Router>
      <Switch>
        <Route path="/login" render={(props) => <LoginPage {...props} setAuthenticationStatus={setAuthenticationStatus} />} />
        <ProtectedRoute
          path="/dashboard"
          component={Dashboard}
          isAuthenticated={isAuthenticated}
        />
      </Switch>
    </Router>
  );
  */
}

const ProtectedRoute = ({ component: Component, isAuthenticated, ...rest }) => {
  const loginPath = '/login';
  console.log('isAuthenticated:', isAuthenticated);
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
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

export default App;
