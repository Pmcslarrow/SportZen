import React, { useEffect } from 'react';
import './dashboard.css';
import { Link, useHistory } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

const Dashboard = ({setAuthenticationStatus}) => {
  const history = useHistory();


  const logout = async () => {
    try {
      await signOut(auth);
      setAuthenticationStatus(false)
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  const survey = async () => {
    history.push("/survey")
  }

  return (
    <div className="dashboard-container">
      <div className="navigation-bar">
        <div className="nav-group">
          <div className="nav-item">
            <h3>Dashboard</h3>
          </div>
          <div className="nav-item" onClick={survey}>
              <h3>Survey</h3>
          </div>
        </div>
        <div className="nav-group">
          <div className="nav-item">
            <h3>Profile</h3>
          </div>
          <div className="nav-item" onClick={logout}>
              <h3>Logout</h3>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="grid-container">
          <div className="grid-item item1">Item 1</div>
          <div className="grid-item item2">Item 2</div>
          <div className="grid-item item3">Item 3</div>
          <div className="grid-item item4">Item 4</div>
          <div className="grid-item item9">Item 9</div>
          <div className="grid-item item10">Item 10</div>
          <div className="grid-item item11">Item 11</div>
          <div className="grid-item item12">Item 12</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
