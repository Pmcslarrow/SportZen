const express = require('express');
const app = express();
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Fake authentication right now. Will implement database later!!!!!
app.post('/auth', (req, res) => {
      res.json({ isAuthenticated : true });
});