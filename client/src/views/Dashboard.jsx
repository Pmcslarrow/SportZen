import React, { useEffect, useState } from 'react';
import './dashboard.css';
import { Link, useHistory } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { db } from '../config/firebase';
import { getDocs, addDoc, collection } from 'firebase/firestore'

// The Dashboard component serves as the application's homepage, acting as a central hub for coaches and players to analyze
// aggregated responses and personal data derived from their survey responses, presented in the form of graphs and metrics.

// Upon loading, the useEffect hook is employed to retrieve all data entries from the survey collection in Firestore.

// The layout is designed by dynamically splitting the content into two sections using flexbox, followed by the use of CSS grid
// to structure each individual data visualization. 


const Dashboard = ({setAuthenticationStatus}) => {
  const history = useHistory();
  const [surveyList, setSurveyList] = useState([]);
  const [users, setUsers] = useState([]);
  const surveyCollectionRef = collection(db, "survey");
  const usersCollectionRef = collection(db, "users");
  const [selectedUser, setSelectedUser] = useState("All Players");
  const [dashboardData, setDashboardData] = useState([])

  // Reading data from the database on load
  useEffect(() => {
    const getSurveyList = async () => {
      try {
        const data = await getDocs(surveyCollectionRef);
        const filteredData = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
        setSurveyList(filteredData)
        setDashboardData(filteredData)
      } catch(err) {
        console.log(err);
      }
    };

    const getUsers = async () => {
      try {
        const data = await getDocs(usersCollectionRef);
        const filteredData = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
        const names = filteredData.map((obj) => obj.name);
        setUsers(names)
      } catch(err) {
        console.log(err);
      }
    }
    getSurveyList();
    getUsers();
  }, [])

  // Handle the user's selection of a player for the dashboard
  useEffect(() => {
    if (selectedUser === "All Players") {
      setDashboardData(surveyList);
    } else {
      const filteredData = [];
      surveyList.forEach((val) => {
        if (selectedUser === val.name) {
          filteredData.push(val);
        }
      });      
      setDashboardData(filteredData);
    }
  }, [selectedUser]);


  // When the user selects a new player or all players it will go through the process
  // Of aggregating all the data into their numericData bins. 
  // It is essentially doing the same thing as 
  // SELECT SUM(numericDataBin) FROM db WHERE player = "user selection";
  useEffect(() => {
    var numericData = {
      dietaryChoices: {},
      mentalHealth: {},
      performanceRating: {},
      physicalHealth: {},
      sleepHours: {},
      stressLevel: {},
    };
  
    // NEXT STEP:
    // Rather than aggregating everything by the sum of the information. Look through the data and figure out which numeric
    // Columns are the ones that you want to show summed data based on dates. Which you want averaged over all data, and so forwarth. 
    dashboardData.forEach((val) => {
      var curr_date = val.date;
  
      const numericColumns = ['dietaryChoices', 'mentalHealth', 'performanceRating', 'physicalHealth', 'sleepHours', 'stressLevel'];
  
      numericColumns.forEach((column) => {
        if (numericData[column][curr_date] === undefined) {
          numericData[column][curr_date] = val[column];
        } else {
          numericData[column][curr_date] += val[column];
        }
      });
    });
  
    console.log(numericData);
  }, [dashboardData]);
  


  // Function that logs a user out and sends them to the login screen
  const logout = async () => {
    try {
      await signOut(auth);
      setAuthenticationStatus(false);
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  const survey = async () => {
    history.push("/survey");
  }
  
  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

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
          <div>
            <select value={selectedUser} onChange={handleUserChange}>
              <option value="All Players">All Players</option>
              {users.map((user, index) => (
                <option key={index} value={user}>
                  {user}
                </option>
              ))}
            </select>
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
