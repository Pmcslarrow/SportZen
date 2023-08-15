import React, { useState } from 'react';
import { useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import './survey.css';
import axios from 'axios';




function Survey({ setAuthenticationStatus }) {
    const history = useHistory();
    const MIN_PAGE = 0;
    const MAX_PAGE = 5;
    const [pageNumber, setPageNumber] = useState(0);
    const [sleepHours, setSleepHours] = useState(0);
    const [activeItem, setActiveItem] = useState(null);
    const [pageThreeNumber, setPageThreeNumber] = useState(0);
    const [pageFourNumber, setPageFourNumber] = useState(0);
    const [pageFiveNumber, setPageFiveNumber] = useState(0);
    const [otherInformation, setOtherInformation] = useState("");

    const pages = [
      <Page1 sleepHours={sleepHours} setSleepHours={setSleepHours} />,
      <Page2 activeItem={activeItem} setActiveItem={setActiveItem}/>,
      <SingleNumberSelection header={"How would you rank your overall mental health? (1 being worst and 10 being best)"} currentValue={pageThreeNumber} setCurrentValue={setPageThreeNumber} />,  // page3
      <SingleNumberSelection header={"How would you rank your overall physical health? (1 being worst and 10 being best)"} currentValue={pageFourNumber} setCurrentValue={setPageFourNumber} />,  // page4
      <SingleNumberSelection header={"How many workouts did you complete today?"} currentValue={pageFiveNumber} setCurrentValue={setPageFiveNumber} />,                                       // page5
      <Page7 otherInformation={otherInformation} setOtherInformation={setOtherInformation}/>
    ];

    const variables = [
      sleepHours,
      activeItem,
      pageThreeNumber,
      pageFourNumber,
      pageFiveNumber,
      otherInformation
    ]

     /* Handling the click of prev and next */
     function handlePrev(e, pageIndex) {

        if (pageNumber === MIN_PAGE) { return }
        else {
            setPageNumber(pageNumber - 1);
        }
    }

    function handleNext(e, pageIndex) {
        let v = variables[pageIndex]

        if (v === null) {
          return
        }

        if (pageNumber === MAX_PAGE) { return
        } else {
            setPageNumber(pageNumber + 1);
        }
    }

    function handleSubmit(e) {
      const data = {
        sleepHours: sleepHours,
        sleepQuality: activeItem,
        mentalHealth: pageThreeNumber,
        physicalHealth: pageFourNumber,
        numWorkouts: pageFiveNumber,
        otherInformation: otherInformation
      };
    
      const jsonData = JSON.stringify(data);
      console.log(jsonData);

      axios.post('https://localhost:3000/submit', jsonData)
        .then(response => {
          console.log('Data successfully posted:', response.data);

          // Redirect to /dashboard after successful POST
          history.push('/dashboard');
        })
        .catch(error => {
          console.error('Error posting data:', error);
        });

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
            <p>{pageNumber}/5</p>
            {pages[pageNumber]}
            <div className='flex-row'>
              {pageNumber !== MAX_PAGE ? (
                <>
                  <div onClick={(e) => handlePrev(e, pageNumber)}>Prev</div>
                  <div onClick={(e) => handleNext(e, pageNumber)}>Next</div>
                </>
              ) : (
                <>
                  <div onClick={(e) => handlePrev(e, pageNumber)}>Prev</div>
                  <div onClick={handleSubmit}>Submit</div>
                </>
              )}
            </div>
        </div>
    </div>
    );
  }

    /* PAGES */

  function Page1({ sleepHours, setSleepHours }) {
    
    const handleSliderChange = (event) => {
      const value = parseInt(event.target.value);
      setSleepHours(value);
    };

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

  // Serves as a component that limits re-use by using the same format for any page that calls it --> it is primarily used for single number entries between 0 and 10.
  function SingleNumberSelection({header, currentValue, setCurrentValue}) {

    function handleChange(e) {
      let value = e.target.value;
      setCurrentValue(value);
    }

    return (
      <div className='page4'>
        <h1>{header}</h1>
        <input
          id="numberInput"
          type="number"
          min={0}
          max={10}
          value={currentValue}
          onChange={handleChange}
        />
      </div>
    );
  }

  function Page7 ({otherInformation, setOtherInformation}) {

    function handleTyping(event) {
      let typed_value = event.target.value;
      /* Regex this for malicious intent */
      const verified = true

      if (verified) {
        setOtherInformation(typed_value)
      }
      return
    }

    return (
      <div className='page7'>
        <h1>Is there any additional information or feedback you would like to share with us? This can be related to yourself, your teammates, or the coaching staff. Feel free to write your thoughts below.</h1>
        <textarea name="Other Information" cols="30" rows="10" maxLength={1500} onChange={handleTyping}></textarea>
      </div>
    )
  }













  export default Survey;
