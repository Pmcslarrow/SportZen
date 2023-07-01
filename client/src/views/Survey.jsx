import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import './survey.css';

function Survey({ setAuthenticationStatus }) {
    const history = useHistory();
    const MIN_PAGE = 1
    const MAX_PAGE = 8
    const [pageNumber, setPageNumber] = useState(1);
    const [sleepHours, setSleepHours] = useState(0);

    const handleSliderChange = (event) => {
        const value = parseInt(event.target.value);
        setSleepHours(value);
    };
    
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
                <h3><Link to="/dashboard" style={LinkStyle}>Dashboard</Link></h3>
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
            <h4>How many hour did you get last night?</h4>
            <div className="slidecontainer">
        
                <input
                    type="range"
                    min="0"
                    max="24"
                    value={sleepHours}
                    className="slider"
                    id="myRange"
                    onChange={handleSliderChange}
                />

                <p>{sleepHours}</p>
            </div>
            
        </div>
        </div>
    );
}

export default Survey;


/**
 *  KEEPING ALL COMPLETED VIEWS FOR THE SURVEY UNDER HERE FOR LATER TO ITERATE THROUGH
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 


 */