import React, { useEffect, useState } from 'react';
import SleepHoursChart from './SleepHoursChart';
import Teammates from './teammates';
import ProgressBar from './ProgressBar';
import './dashboard.css';
import { useHistory } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { db } from '../config/firebase';
import { getDoc, getDocs, collection, doc, updateDoc } from 'firebase/firestore'

// The Dashboard component serves as the application's homepage, acting as a central hub for coaches and players to analyze
// aggregated responses and personal data derived from their survey responses, presented in the form of graphs and metrics.

// Upon loading, the useEffect hook is employed to retrieve all data entries from the survey collection in Firestore.

// The layout is designed by dynamically splitting the content into two sections using flexbox, followed by the use of CSS grid
// to structure each individual data visualization. 


const Dashboard = ({setAuthenticationStatus, isAdmin, setIsAdmin }) => {
  const history = useHistory();
  const [surveyList, setSurveyList] = useState([]);
  const [users, setUsers] = useState([]);
  const surveyCollectionRef = collection(db, "survey");
  const usersCollectionRef = collection(db, "users");
  const [selectedUser, setSelectedUser] = useState("All Players");
  const [selectedDashboard, setSelectedDashboard] = useState("Daily Update")
  const [dashboardData, setDashboardData] = useState([])
  const [avgMentalHealth, setAvgMentalHealth] = useState(0)
  const [avgPhysicalHealth, setAvgPhysicalHealth] = useState(0)
  const [summedData, setSummedData] = useState({})
  const [averagedData, setAveragedData] = useState([])
  const [averagedObjects, setAveragedObjects] = useState({})
  const [visualSleepHours, setVisualSleepHours] = useState({})
  const [visualPerformanceHours, setVisualPerformanceHours] = useState({})
  const [dailyUpdateData, setDailyUpdateData] = useState({
    Offense: '',
    Defense: '',
    Quote: '',
    Joke: '',
    Will: '',
    Music: '',
    lastModified: '',
  });
  const [refreshKey, setRefreshKey] = useState(0);


  // Reading survey data and user data from the database
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

        // Checking to see if the user logged in is an admin or not
        filteredData.forEach((obj) => {
          if (obj.email === auth?.currentUser?.email && obj.admin !== false) {
            setIsAdmin(true);
          } 
        });
        
        setUsers(names)
      } catch(err) {
        console.log(err);
      }
    }

    const getTodaysUpdates = async () => {
      try {
        const dailyRef = doc(db, "DailyUpdate", "DailyDocID");
        const snapshot = await getDoc(dailyRef);
        const data = snapshot.data();
        const currentDate = new Date();
        const currentDateString = currentDate.toLocaleDateString("en-US")
        const dataLastModified = new Date(data.lastModified);
        currentDate.setHours(0, 0, 0, 0);
        dataLastModified.setHours(0, 0, 0, 0);
        const timeDifference = currentDate - dataLastModified;
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

        // Check if the difference is greater than or equal to 1 day
        if (daysDifference >= 1) {
          const offenseOptions = [
            "2 ft stops",
            "2 outs",
            "no stand zone",
            "early and opposite",
            "screening angles",
            "1 can't guard 2 spacing",
            "draw 2 reads",
            "high passes",
            "push/pull",
            "setting screens",
          ];
          const defenseOptions = [
            "stunt on dribble",
            "locate/chuck/carve",
            "blast/quarters",
            "exaggerated communication",
            "limit 3s",
            "quarters",
            "move on every pivot or dribble",
            "move on pivots",
            "sprint to level of ball",
          ];
          
          const names = [
            "Jake", "Meelad", "Mitchell", "Gavin", "Jack", "Kahiau", "Dylan", "Josiah",
            "Ryder", "Terry", "DJ", "Will", "Eli", "Aadem", "AJ", "Caymoe", "Gavin R.", "D'ante"
          ];
          
          // Function to get a random element from an array
          function getRandomElement(arr) {
            const randomIndex = Math.floor(Math.random() * arr.length);
            return arr[randomIndex];
          }

          const selectedNames = [];

          // Function to select a distinct name from the names array
          function getDistinctName() {
            let name;
            do {
              name = getRandomElement(names);
            } while (selectedNames.includes(name));
            selectedNames.push(name);
            return name;
          }

          // Get distinct names for Quote, Joke, and Will
          const quoteName = getDistinctName();
          const jokeName = getDistinctName();
          const willName = getDistinctName();
          const musicName = getDistinctName();

          
          const dataToUpdate = {
            Offense: getRandomElement(offenseOptions),
            Defense: getRandomElement(defenseOptions),
            Quote: quoteName,
            Joke: jokeName,
            Will: willName,
            Music: musicName,
            lastModified: currentDateString,
          };
          
          // Updating the doc and the page
          await updateDoc(dailyRef, dataToUpdate);
          setDailyUpdateData(dataToUpdate);
        } else {
          setDailyUpdateData(data);
        }
      } catch (err) {
        console.log(err)
      }
    }

    getSurveyList();
    getUsers();
    getTodaysUpdates();
  }, [])

  // Handle the dropdown menu of a player selection
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


  // When the user selects a new player (or all players)
  // This will update all the summed data and averaged data that will be displayed on the dashboard
  useEffect(() => {
    var summedData = {
      dietaryChoices: {},
      mentalHealth: {},
      performanceRating: {},
      physicalHealth: {},
      sleepHours: {},
      stressLevel: {},
    };

    var averagedData = {
      dietaryChoices: [],
      mentalHealth: [],
      performanceRating: [],
      physicalHealth: [],
      sleepHours: [],
      stressLevel: [],
    };

    var averagedObjects = {
      dietaryChoices: {},
      mentalHealth: {},
      performanceRating: {},
      physicalHealth: {},
      sleepHours: {},
      stressLevel: {},
    }

    const columns = ['dietaryChoices', 'performanceRating', 'sleepHours', 'stressLevel', 'mentalHealth', 'physicalHealth'];

    dashboardData.forEach((val) => {
      var curr_date = val.date;

      columns.forEach((column) => {
        if (summedData[column][curr_date] === undefined) {
          summedData[column][curr_date] = parseInt(val[column]);
          averagedObjects[column][curr_date] = { sum: parseInt(val[column]), count: 1 };
        } else {
          summedData[column][curr_date] += parseInt(val[column]);
          averagedObjects[column][curr_date].sum += parseInt(val[column]);
          averagedObjects[column][curr_date].count += 1;
        }
      });

      // Averaging all values
      columns.forEach((column) => {
        averagedData[column].push(val[column]);
      });
    });

    // Define a function to calculate the average of an array
    function getAverage(arr) {
      if (arr.length === 0) return 0;
      const numericArray = arr.map(val => parseFloat(val));
      const validNumericArray = numericArray.filter(val => !isNaN(val));
    
      if (validNumericArray.length === 0) return 0;
    
      const total = validNumericArray.reduce((acc, val) => acc + val, 0);
      return (total / validNumericArray.length).toFixed(2);
    }

    // Calculate and set the averages
    setAvgMentalHealth(getAverage(averagedData.mentalHealth));
    setAvgPhysicalHealth(getAverage(averagedData.physicalHealth));

    setSummedData(summedData);
    setAveragedData(averagedData);
    setAveragedObjects(averagedObjects); 
  }, [dashboardData]);

  // Filtering sleepHours to only include the last 30 days of data
  useEffect(() => {
    try {
      const sleepData = summedData.sleepHours;
      const performanceData = summedData.performanceRating
      const currentDate = new Date();

      // Calculate the date 30 days ago from today
      const thirtyDaysAgo = new Date(currentDate);
      thirtyDaysAgo.setDate(currentDate.getDate() - 30);
  
      // Convert to YYYY-MM-DD
      const thirtyDaysAgoString = thirtyDaysAgo.toISOString().split('T')[0];
  
      // Filter sleepData to only include the last 30 days
      const filteredData = Object.entries(sleepData)
        .filter(([date]) => date >= thirtyDaysAgoString)
        .reduce((obj, [date, value]) => {
          obj[date] = value;
          return obj;
        }, {});

      // Filter sleepData to only include the last 30 days
      const filteredPerformanceData = Object.entries(performanceData)
        .filter(([date]) => date >= thirtyDaysAgoString)
        .reduce((obj, [date, value]) => {
          obj[date] = value;
          return obj;
        }, {});

      setVisualSleepHours(filteredData)
      setVisualPerformanceHours(filteredPerformanceData)
    } catch(err) {
      console.log(err)
    }
    
  }, [summedData]);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  }

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

  const navigateAdminPage = async () => {
    history.push("/admin")
  }
  
  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleDashboardChange = (event) => {
    setSelectedDashboard(event.target.value);
  }



  function DataDashboard() {
    return (
      <div className="main-content">
        <div className="grid-container">
        <div className="grid-item item1">
          <SleepHoursChart sleepData={visualSleepHours} performanceData={visualPerformanceHours} averages={averagedObjects}  selectedPlayer={selectedUser} key={refreshKey}/>
        </div>
          <div className="grid-item item2">
            <ProgressBar title={"Avg Mental"} value={avgMentalHealth} key={refreshKey}/> 
          </div>
          <div className="grid-item item3">
            <ProgressBar title={"Avg Physical"} value={avgPhysicalHealth} key={refreshKey}/> 
          </div>
          <div className="grid-item item9">
            <Teammates surveyList={surveyList} currentUserEmail={auth?.currentUser?.email} key={refreshKey}/>
          </div>
        </div>
      </div>
    )
  }




  function DailyUpdate() {
    const [leadershipBoard, setLeadershipBoard] = useState([]);
  
    useEffect(() => {
      const getLeadershipBoard = async () => {
        const usersCollectionRef = collection(db, "users");
        const data = await getDocs(usersCollectionRef);
        const userData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const sortedData = userData
                .filter(user => !user.admin)
                .sort((a, b) => parseInt(b.wins) - parseInt(a.wins));

        const lb = sortedData.map((user, index) => ({
                Rank: index + 1,
                Name: user.name,
                Wins: user.wins,
        }));
        
        setLeadershipBoard(lb);
      };
  
      getLeadershipBoard();
    }, []);
  
    return (
      <div className='daily-container'>
        <div>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Wins</th>
              </tr>
            </thead>
            <tbody>
              {leadershipBoard.map((leader) => (
                <tr key={leader.Rank}>
                  <td>{leader.Rank}</td>
                  <td>{leader.Name}</td>
                  <td>{leader.Wins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='daily-flex-col'>
          <span className='daily-flex-col'>
            <div><b>Offense:</b> {dailyUpdateData.Offense ?? ""}</div>
            <div><b>Defense:</b> {dailyUpdateData.Defense ?? ""}</div>
          </span>
          <span className='daily-flex-col'>
            <div><b>Quote:</b> {dailyUpdateData.Quote ?? ""}</div>
            <div><b>Joke:</b> {dailyUpdateData.Joke ?? ""}</div>
            <div><b>Will Emphasis:</b> {dailyUpdateData.Will ?? ""}</div>
            <div><b>Music:</b> {dailyUpdateData.Music ?? ""}</div>
          </span>
          </div>
      </div>
    );
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
          {isAdmin && (
            <div className="nav-item" onClick={navigateAdminPage}>
              <h3>Admin Page</h3>
            </div>
          )}
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
          <div>
            <select value={selectedDashboard} onChange={handleDashboardChange}>
              <option value="Data Dashboard">Dashboard</option>
              <option value="Daily Update">Daily Update</option>
            </select>
          </div>

          
          
          <button
            onClick={handleRefresh}>
            Refresh Data
          </button>
        </div>
        <div className="nav-group">
         
          <div className="nav-item" onClick={logout}>
              <h3>Logout</h3>
          </div>
        </div>
      </div>

      {selectedDashboard === "Data Dashboard" ? <DataDashboard /> : <DailyUpdate />}      
    </div>
  );
  
};

export default Dashboard;
