const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const PORT = 4000;

// Middleware
app.use(bodyParser.json());
app.use(cors());




// Authentication
app.post('/auth', (req, res) => {
  res.json({ isAuthenticated : true });
});

// POST http:localhost:4000/submit
app.post('/submit', (req, res) => {
  //const username = req.body.username;
  const username = "paul"
  const sleephours = req.body.sleepHours;
  const sleepquality = req.body.sleepQuality;
  const mentalhealth = req.body.mentalHealth;
  const physicalhealth = req.body.physicalHealth;
  const numworkouts = req.body.numWorkouts;
  const other = req.body.otherInformation;

  console.log("something /submit")
});




// Listening
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});