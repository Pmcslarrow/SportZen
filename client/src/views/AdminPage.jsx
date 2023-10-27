import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../config/firebase';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import pencilImage from '../images/pencil.png';
import trashImage from '../images/trash-can.png';
import './admin.css';


// The top component that defines all top level variables like the list of players and global states
// if the user is an admin it will let the admin use CRUD on the users database and the front end update page
function AdminPage({ setAuthenticationStatus, isAdmin, setIsAdmin }) {
  const usersCollectionRef = collection(db, 'users');
  const [players, setPlayers] = useState([]);
  const [isUserEditing, toggleEditPlayer] = useState(false)
  const [playerToEdit, setEditPlayer] = useState({})

  useEffect(() => {
    refreshPlayerData()
    verifyIsAdmin()
  }, []);

  const refreshPlayerData = async () => {
      const data = await getDocs(usersCollectionRef);
      const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setPlayers(filteredData);
  };

  const verifyIsAdmin = async () => {
      try {
        const data = await getDocs(usersCollectionRef);
        const filteredData = data.docs.map((doc) => ({...doc.data(), id: doc.id}))

        // Checking to see if the user logged in is an admin or not
        filteredData.forEach((obj) => {
          if (obj.email === auth?.currentUser?.email) {
            if (obj.admin === true) {
                  setIsAdmin(true);
            } else {
                  setIsAdmin(false)
            }
          }
        });        
      } catch(err) {
        console.log(err);
      }
    }

  return (
    <div id="wrapper">

      <NavigationBar />
      
      <PlayerEditForm
      isUserEditing={isUserEditing}
      playerToEdit={playerToEdit}
      toggleEditPlayer={toggleEditPlayer}
      refreshPlayerData={refreshPlayerData}
      verifyIsAdmin={verifyIsAdmin}
      />

        
      {isAdmin ? (
        <>
          <ManagePlayers props={{ players, setPlayers, isUserEditing, setEditPlayer, toggleEditPlayer }} />
          <DailyUpdatePage />
        </>
      ) : (
        <div>You have insufficient privileges</div>
      )}
    </div>
  );
}



// This component holds the table that admins can adjust accordingly. It also handles the toggling the form visibility.
function ManagePlayers({ props }) {
      const { players, setPlayers, isUserEditing, setEditPlayer, toggleEditPlayer } = props;

      const onEditPlayer = (player) => {
            toggleEditPlayer(!isUserEditing)
            setEditPlayer(player)
      };

      const onDeletePlayer = async (player) => {
            try {
            const playerId = player.id;

            const playerReference = doc(db, 'users', playerId);
            await deleteDoc(playerReference);
            setPlayers((prevPlayers) => prevPlayers.filter((player) => player.id !== playerId));
            } catch (err) {
            console.log(err);
            }
      };


      return (
      <>
            <div className='flex'>
                  <h1>Manage Team</h1>
            </div>

            <table>
            <thead>
            <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Admin</th>
                  <th>Wins</th>
                  <th>Edit</th>
                  <th>Delete</th>
            </tr>
            </thead>
            <tbody>
            {players.map((player) => (
                  <tr key={player.id}>
                  <td>{player?.name}</td>
                  <td>{player?.email}</td>
                  <td>{player?.admin ? 'Yes' : 'No'}</td>
                  <td>{player?.wins || 0}</td>
                  <td>
                        <img onClick={() => onEditPlayer(player)} src={pencilImage} alt={"Pencil (edit) icon"} width={"25px"}/>
                  </td>
                  <td>
                        <img onClick={() => onDeletePlayer(player)} src={trashImage} alt={"Trash (delete) icon"} width={"25px"}/>
                  </td>
                  </tr>
            ))}
            </tbody>
            </table>
      </>
      );
}



// Just holds the navigation Dashboard button
function NavigationBar() {
  const history = useHistory();

  const navigateDashboard = async () => {
    history.push("/dashboard")
  }

  return (
    <div className="dashboard-container">
      <div className="navigation-bar">
        <div className="nav-group">
          <div className="nav-item" onClick={navigateDashboard}>
            <h3>Dashboard</h3>
          </div>          
        </div>
      </div>
    </div>
  )
}



// Will hold the code for the next CRUD part of the page
function DailyUpdatePage(props) {
  const dailyRef = doc(db, 'DailyUpdate', 'DailyDocID');
  const [dailyUpdate, setDailyUpdate] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docSnapshot = await getDoc(dailyRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setDailyUpdate(data);
          setUpdatedData(data);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error getting document:', error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (field) => {
    setIsEditing(true);
    setEditingField(field);
  };

  const handleSave = async () => {
    try {
      await updateDoc(dailyRef, { [editingField]: updatedData[editingField] });
      setIsEditing(false);
      setEditingField(null);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  return (
    <div>
      <h1>Daily Update Page</h1>
      <table>
        <thead>
          <tr>
            <th>Field Name</th>
            <th>Player Name</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(dailyUpdate).map((field) => {
            // Exclude the "lastModified" field from the table
            if (field === "lastModified") return null;

            return (
              <tr key={field}>
                <td>{field}</td>
                <td>
                  {isEditing && editingField === field ? (
                    <input
                      type="text"
                      value={updatedData[field]}
                      onChange={(e) =>
                        setUpdatedData({ ...updatedData, [field]: e.target.value })
                      }
                    />
                  ) : (
                    updatedData[field]
                  )}
                </td>
                <td>
                  {isEditing && editingField === field ? (
                    <>
                      <button onClick={handleSave}>Save</button>
                      <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </>
                  ) : (
                    <img onClick={() => handleEdit(field)} src={pencilImage} width={"25px"} />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}





// This component holds all the code for editing a player on the manage team component.
// It interacts with the database directly and will update the values in "real time"
function PlayerEditForm(props) {
      const {
        isUserEditing,
        playerToEdit,
        toggleEditPlayer,
        refreshPlayerData,
        verifyIsAdmin
      } = props;

      const { UID, admin, email, name, wins } = playerToEdit;
      const [formData, setFormData] = useState({
        email,
        name,
        wins: parseInt(wins),
      });
      const [isAdmin, setIsAdmin] = useState(admin); 
    
      useEffect(() => {
        const { admin, email, name, wins } = playerToEdit;
        setFormData({
          email,
          name,
          wins: parseInt(wins),
        });
        setIsAdmin(admin);
      }, [playerToEdit]);
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleAdminChange = (e) => {
        setIsAdmin(e.target.checked);
      };
    
      const handleFormSubmit = (e) => {
        e.preventDefault();
        const currentDate = new Date();
        const currentDateString = currentDate.toLocaleDateString("en-US");
    
        const submissionData = {
          UID,
          date: currentDateString,
          admin: isAdmin,
          email: formData.email,
          name: formData.name,
          wins: formData.wins,
        };
        
        updateUserByUID(UID, submissionData);
        toggleEditPlayer(!isUserEditing)
        refreshPlayerData()
        verifyIsAdmin()
      };

      async function updateUserByUID(targetUID, newData) {
            const usersCollectionRef = collection(db, 'users');
            const q = query(usersCollectionRef, where('UID', '==', targetUID));
          
            try {
              const querySnapshot = await getDocs(q);
          
              if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userDocRef = doc(db, 'users', userDoc.id);
          
                await updateDoc(userDocRef, newData);
          
                console.log('User document updated successfully');
              } else {
                console.log('No user document with matching UID found.');
              }
            } catch (error) {
              console.error('Error updating user document:', error);
            }
      }
    
      return (
        <div className={`edit-tab ${isUserEditing ? 'active' : ''}`}>
          <div className='form-wrapper'>
            <form onSubmit={handleFormSubmit}>
              <div className="input-row">
                <label htmlFor="UID">UID:</label>
                <input type="text" id="UID" name="UID" value={UID} disabled />
              </div>
              <div className="input-row">
                <label htmlFor="admin">Admin:</label>
                <input type="checkbox" id="admin" name="admin" checked={isAdmin} onChange={handleAdminChange} />
              </div>
              <div className="input-row">
                <label htmlFor="email">Email:</label>
                <input type="text" id="email" name="email" value={formData.email} onChange={handleInputChange} />
              </div>
              <div className="input-row">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="input-row">
                <label htmlFor="wins">Wins:</label>
                <input type="number" id="wins" name="wins" value={formData.wins} onChange={handleInputChange} />
              </div>
              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      );
    }
    

export default AdminPage;