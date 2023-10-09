import React, { useState } from 'react';
import { useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { db } from '../config/firebase';
import { addDoc, getDocs, collection, Timestamp } from 'firebase/firestore'
import './survey.css';


// The Survey component is designed to guide users through 9 pages of questions, allowing them to input information 
// related to their sleep, dietary habits, mental well-being, physical health, stress levels, and performance quality.
// Two key components, SingleNumberSelection and CategoricalInput, were implemented for code reusability.

// SingleNumberSelection accepts a header and two states, one for displaying the variable and the other for setting the state.
// Both components follow a similar process. In contrast, CategoricalInput relies on an array of strings for user selection, 
// and users must choose an option before proceeding (indicated by boolean states like sleepQuality, waterConsumption, and stressSources).

// After completing the survey, the code connects to the survey collection reference in Firestore and creates new data 
// based on the state variables used.

// For testing purposes and future analytics testing, the code iterates a specified number of times (200 in this case)
// to generate randomized fake data that mimics expected user responses. This randomized data will aid in updating the dashboard
// to extract insights when real data becomes available.



function Survey({ setAuthenticationStatus }) {
  const history = useHistory();
  const MIN_PAGE = 0;
  const MAX_PAGE = 9; 
  const [pageNumber, setPageNumber] = useState(0);
  const [sleepHours, setSleepHours] = useState(0); 
  const [sleepQuality, setSleepQuality] = useState(null); 
  const [dietaryChoices, setDietaryChoices] = useState(0);
  const [waterConsumption, setWaterConsumption] = useState(null);
  const [mentalHealth, setMentalHealth] = useState(0);
  const [physicalHealth, setPhysicalHealth] = useState(0);
  const [stressLevel, setStressLevel] = useState(0);
  const [stressSources, setStressSources] = useState(null);
  const [performanceRating, setPerformanceRating] = useState(0);
  const [otherInformation, setOtherInformation] = useState("");
  const [userHasSubmitToday, setUserHasSubmitToday] = useState(false)
  const surveyCollectionRef = collection(db, "survey");



  // Pulls all survey data from the DB based on the signed in user. If the user has already submit something on todaysDate
  // It set then sets the state of userHasSubmitToday to true meaning I won't allow the user access the survey
  useEffect(() => {
    const checkIfUserHasAlreadySubmitToday = async () => {
      try {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0'); 
        const day = String(new Date().getDate()).padStart(2, '0'); 
        const todaysDate = `${year}-${month}-${day}`;

        const data = await getDocs(surveyCollectionRef);
        const filteredData = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
        
        filteredData.forEach((val) => {
          if (auth?.currentUser?.email === val.email && todaysDate === val.date) {
            setUserHasSubmitToday(true)
          }
        });     
      } catch(err) {
        console.log(err);
      }
    };
    checkIfUserHasAlreadySubmitToday()
  }, [])


  const pages = [
    <SingleNumberSelection
      header={"How many hours of sleep did you get last night?"}
      currentValue={sleepHours}
      setCurrentValue={setSleepHours}
    />,
    <CategoricalInput
      header={"How would you rate the quality of your sleep last night?"}
      range={["Excellent", "Good", "Fair", "Poor"]}
      activeItem={sleepQuality}
      setActiveItem={setSleepQuality}
    />,
    <SingleNumberSelection
      header={"How would you rate your dietary choices today?"}
      currentValue={dietaryChoices}
      setCurrentValue={setDietaryChoices}
    />,
    <CategoricalInput
      header={"Did you consume enough water today (yes, no, unsure)"}
      range={["Yes", "No", "Unsure"]}
      activeItem={waterConsumption}
      setActiveItem={setWaterConsumption}
    />,
    <SingleNumberSelection
      header={"On a scale of 1-10, How would you rank your overall mental health?"}
      currentValue={mentalHealth}
      setCurrentValue={setMentalHealth}
    />,
    <SingleNumberSelection
      header={"On a scale of 1-10, How would you rank your overall physical health?"}
      currentValue={physicalHealth}
      setCurrentValue={setPhysicalHealth}
    />,
    <SingleNumberSelection
      header={"On a scale of 1-10, how stressed do you feel today?"}
      currentValue={stressLevel}
      setCurrentValue={setStressLevel}
    />,
    <CategoricalInput
      header={"What are the primary sources of your stress today? (Work, Personal, Team-related)"}
      range={["Work", "Personal", "Team-related"]}
      activeItem={stressSources}
      setActiveItem={setStressSources}
    />,
    <SingleNumberSelection
      header={"How would you rate your performance in practice or games today?"}
      currentValue={performanceRating}
      setCurrentValue={setPerformanceRating}
    />,
    <FinalPage otherInformation={otherInformation} setOtherInformation={setOtherInformation} />
  ];

  const variables = [
    sleepHours,
    sleepQuality,
    dietaryChoices,
    waterConsumption,
    mentalHealth,
    physicalHealth,
    stressLevel,
    stressSources,
    performanceRating,
    otherInformation
  ];
  

  const addSurveyData = async () => {
    const currentDate = new Date();
    const atIndex = auth?.currentUser?.email?.indexOf('@');
    const userName = atIndex !== -1 ? auth?.currentUser?.email?.slice(0, atIndex) : ''; 

    // Extract year, month, and day components
    const year = currentDate.getFullYear(); // Get the year (YYYY)
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Get the month (MM)
    const day = String(currentDate.getDate()).padStart(2, '0'); // Get the day (DD)

    const formattedDate = `${year}-${month}-${day}`;
  
    await addDoc(surveyCollectionRef, {
      name: userName,
      email: auth?.currentUser?.email,
      sleepHours,
      sleepQuality,
      dietaryChoices,
      waterConsumption,
      mentalHealth,
      physicalHealth,
      stressLevel,
      stressSources,
      performanceRating,
      otherInformation,
      date: formattedDate
    });
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setAuthenticationStatus(false)
      history.push("/")  
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

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
    addSurveyData();
    //insertFakeData()
  }

/*
// CREATED FAKE DATA FOR THE ANALYTICS PORTION
const users = ['pdmcslarrow', 'dgreen', 'mdoroodchi', 'jjohnson']; 


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomUser() {
  return getRandomElement(users);
}

// Function to insert fake survey data
async function insertFakeData() {
  const numRecords = 200; // Number of fake records you want to generate
  const september = 8; // JavaScript months are 0-based, so September is 8

  for (let i = 0; i < numRecords; i++) {
    let user = getRandomUser();

    // Generate a random day within September
    const day = getRandomInt(1, 30); // Assume 30 days in September

    // Create a formatted date string in "YYYY-MM-DD" format for September
    const formattedDate = `2023-${(september + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    const fakeData = {
      name: `${user}`,
      email: `${user}@willamette.edu`,
      sleepQuality: getRandomElement(['Excellent', 'Good', 'Fair', 'Poor']),
      sleepHours: getRandomInt(0, 10),
      dietaryChoices: getRandomInt(0, 10),
      mentalHealth: getRandomInt(0, 10),
      performanceRating: getRandomInt(0, 10),
      physicalHealth: getRandomInt(0, 10),
      stressLevel: getRandomInt(0, 10),
      stressSources: getRandomElement(['Work', 'Personal', 'Team-related']),
      waterConsumption: getRandomElement(['Yes', 'No', 'Unsure']),
      date: formattedDate
    };

    await addDoc(surveyCollectionRef, fakeData);
    console.log(`Fake data ${i + 1} inserted.`);
  }
}
*/
  
  const LinkStyle = {
      fontFamily: 'inherit',
      fontSize: 'inherit',
      fontWeight: 'inherit',
      fontStyle: 'inherit',
      textDecoration: 'inherit',
      color: 'inherit'
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
          <div className="nav-item" onClick={logout}>
              <h3>Logout</h3>
          </div>
          </div>
      </div>

      { /* BOILERPLATE NAV BAR END */ }
      { /* Checking if the user has already submit something today -- If true it will not let them use the survey again */ }

      <div className='main-content'>
        {userHasSubmitToday === true ? (
          <>
            <h3>You can only submit 1 survey per day</h3>
          </>
        ) : (
          <>
            <p>{pageNumber + 1}/10</p>
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
                  <Link to="/" style={LinkStyle}>
                    <div onClick={handleSubmit}>Submit</div>
                  </Link>
                </>
              )}
            </div>
          </>
        )}
      </div>
  </div>
  );
}

    /* PAGES */

  // Sample input: < CategoricalInput header={"My header for h1"} range={["Excellent", "Good", "Fair", "Poor"], activeItem={state}, setActiveItem={setState}}
  function CategoricalInput({ header, range, activeItem, setActiveItem }) {

    const handleListItemClick = (item) => {
      setActiveItem(item);
    };

    return (
      <div className='page2'>
        <h1>{header}</h1>
        <ul>
          {range.map((item) => (
            <li
              key={item}
              className={activeItem === item ? 'active' : ''}
              onClick={() => handleListItemClick(item)}
            >
              {item}
            </li>
          ))}
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

function FinalPage({otherInformation, setOtherInformation}) {

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
