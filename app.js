require("dotenv").config();
const Login = require("./Routes/Login.js");
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the Login route as middleware
// Uncomment this line if you want to use Login as middleware
// app.use("/login", Login);

// Define a route to fetch data from the database
app.post('/login', (req, res) => {
  // Assuming Login function is modified to accept req, res, and next parameters
  Login(req, res);
});

// Define routes and functionality here
// Sample route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app
