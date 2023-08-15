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
    <Router>
      <Switch>

        <Route path="/" exact>
          {isAuthenticated ? <Dashboard /> : <LoginPage setAuthenticationStatus={setAuthenticationStatus} />}
        </Route>

        <Route path="/survey" render={(props) => <Survey {...props} setAuthenticationStatus={setAuthenticationStatus}  />} />
        
        <ProtectedRoute
          path="/dashboard"
          component={Dashboard}
          isAuthenticated={isAuthenticated}
          failedRoute={"/"}
        />

      </Switch>
    </Router>
  );

}


// If it is authenticated, then it goes to the component you pass. Otherwise, login page. 
export const ProtectedRoute = ({ component: Component, isAuthenticated, failedRoute, ...rest }) => {
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
              pathname: failedRoute,
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

export default App