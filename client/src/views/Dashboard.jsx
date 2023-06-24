import React from 'react';
import './dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <div className="navigation-bar">
        <div className="nav-group">
          <div className="nav-item">
            <h3>Dashboard</h3>
          </div>
          <div className="nav-item">
            <h3>Tracking Survey</h3>
          </div>
        </div>
        <div className="nav-group">
          <div className="nav-item">
            <h3>Profile</h3>
          </div>
          <div className="nav-item">
            <h3>Logout</h3>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content"></div>
    </div>
  );
};

export default Dashboard;
