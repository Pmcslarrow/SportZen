const express = require("express");
const app = express()
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

/* GET */
app.get("/", (req, res) => {
      res.redirect("/login")
})


app.get("/login", (req, res) => {
      res.render("login.ejs")
})




/* POST */

app.post('/auth', (req, res) => {
      const name = req.body.name;
      const username = req.body.username;
      const password = req.body.password;

      // Verify with regex that it matches password strength and username strength
      // If it passes the tests, it should then go through the Auth0 client to verify
      res.send('Form submitted successfully');
});







app.listen(3000, () => {
      console.log("Running on port 3000");
})