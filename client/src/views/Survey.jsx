import React, { useState } from 'react';
import { useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import './survey.css';



function Survey({ setAuthenticationStatus }) {
    const history = useHistory();
    const MIN_PAGE = 0;
    const MAX_PAGE = 7;
    const [pageNumber, setPageNumber] = useState(0);
    const [sleepHours, setSleepHours] = useState(0);
    const [activeItem, setActiveItem] = useState(null);
    const [selectedNumber, setSelectedNumber] = useState(0);

    const pages = [
      <Page1 sleepHours={sleepHours} setSleepHours={setSleepHours} />,
      <Page2 activeItem={activeItem} setActiveItem={setActiveItem}/>,
      <Page3 selectedNumber={selectedNumber} setSelectedNumber={setSelectedNumber}></Page3>
    ];

     /* Handling the click of prev and next */
     function handlePrev(e) {
        if (pageNumber === MIN_PAGE) { return }
        else {
            setPageNumber(pageNumber - 1);
        }
    }

    function handleNext(e) {
        if (pageNumber === MAX_PAGE) { return
        } else {
            setPageNumber(pageNumber + 1);
        }
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
        /* BOILERPLATE NAV BAR START */

        <div className="dashboard-container">
        <div className="navigation-bar">
            <div className="nav-group">
            <div className="nav-item">
                <Link to="/dashboard" style={LinkStyle}>
                    <h3>Dashboard</h3>
                </Link>
            </div>
            <div className="nav-item">

                <Link to="/survey" style={LinkStyle}>
                    <h3>Survey</h3>
                </Link>
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

        { /* BOILERPLATE NAV BAR END */ }

        <div className="main-content">
            <p>{pageNumber}/7</p>
            {pages[pageNumber]}
            <div className='flex-row'>
                <div onClick = {handlePrev}>Prev</div>
                <div onClick = {handleNext}>Next</div>
            </div>
        </div>
    </div>
    );
  }

  function Page1({ sleepHours, setSleepHours }) {
    const handleSliderChange = (event) => {
      const value = parseInt(event.target.value);
      setSleepHours(value);
    };

    useEffect(() => {
      console.log(sleepHours);
    }, [sleepHours]);

    return (
      <>
        <h1>How many hours did you get last night?</h1>
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
      </>
    );
  }

  function Page2({ activeItem, setActiveItem }) {


    const handleListItemClick = (item) => {
      setActiveItem(item);
    };

    return (
      <div className='page2'>
        <h1>How would you rank your overall sleep quality last night?</h1>
        <ul>
          <li
            className={activeItem === 'Excellent' ? 'active' : ''}
            onClick={() => handleListItemClick('Excellent')}

          >
            Excellent
          </li>
          <li
            className={activeItem === 'Good' ? 'active' : ''}
            onClick={() => handleListItemClick('Good')}
          >
            Good
          </li>
          <li
            className={activeItem === 'Fair' ? 'active' : ''}
            onClick={() => handleListItemClick('Fair')}
          >
            Fair
          </li>
          <li
            className={activeItem === 'Poor' ? 'active' : ''}
            onClick={() => handleListItemClick('Poor')}
          >
            Poor
          </li>
        </ul>
      </div>
    );
  }

  function Page3({selectedNumber, setSelectedNumber}) {


    const handleNumberChange = (event) => {
      const value = parseInt(event.target.value, 10);
      setSelectedNumber(value);
    };

    return (
      <div className='page3'>
        <h1>How would you rank your overall mental health? (0 being poor and 10 being excellent)</h1>
        <input
          id="numberInput"
          type="number"
          min={0}
          max={10}
          value={selectedNumber}
          onChange={handleNumberChange}
        />
      </div>
    );
  }

  export default Survey;
