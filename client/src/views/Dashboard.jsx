import React from 'react';
import './dashboard.css';
import { Link, Route, Switch } from "react-router-dom";


const Dashboard = () => {

  function handleSurvey(e) {
    e.preventDefault();
  }

  const LinkStyle = {
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'inherit',
    fontStyle: 'inherit',
    textDecoration: 'inherit',
    color: 'inherit',
    // Add any other desired h3 styles
};

  return (
    <div className="dashboard-container">
      <div className="navigation-bar">
        <div className="nav-group">
          <div className="nav-item">
            <h3>Dashboard</h3>
          </div>
          <div className="nav-item">
            <h3><Link to="/survey" style={LinkStyle}>Survey</Link></h3>
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
