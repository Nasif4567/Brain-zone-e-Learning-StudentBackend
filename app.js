require("dotenv").config();
const Login = require("./Routes/Login.js");
const Register = require("./Routes/Registration.js");
const SaveInterest = require("./Routes/SaveInterest.js")
const cors = require('cors');

const express = require('express');
const app = express();
const port = 3001;

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Use the Login route as middleware
// Uncomment this line if you want to use Login as middleware
// app.use("/login", Login);

// Define a route to login f
app.post('/login', (req, res) => {
  // Assuming Login function is modified to accept req, res, and next parameters
  Login(req, res);
});

//Route to register users
app.post('/Register',(req,res)=>{
    Register(req,res);
});

// Save to save the interest of the users 
app.post('/SaveInterst', (req, res)=>{
  SaveInterest(req,res)
})

// Define routes and functionality here
// Sample route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app
