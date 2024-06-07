require("dotenv").config();
const Login = require("./Routes/Login.js");
const Register = require("./Routes/Registration.js");
const SaveInterest = require("./Routes/SaveInterest.js")
const cors = require('cors');
const {GetInterest} =  require("./Routes/BrowseCourse.js");
const SendDicussionForm = require("./Routes/SendDicussionForm.js");
const ViewMessageDF=  require("./Routes/ViewMessageDF.js");
const LearningMaterials = require("./Routes/LearningMaterial.js")
const EnrolledCoursesView = require("./Routes/EnrolledCourses.js")
const SearchView = require("./Routes/SearchView.js")
const SearchBarRecommedation = require("./Routes/SearchBarRecommend.js")
const CheckEnrollment = require("./Routes/CheckEnrollment.js");
const ModuleShow = require("./Routes/ModuleShow.js");
const checkout = require("./Routes/CheckOut.js");
const AccountEdit = require("./Routes/AccountEdit.js");
const ViewReply = require("./Routes/ViewReply.js");
const InsertProgress = require("./Routes/Progression.js");
const ViewProgress = require("./Routes/ViewProgression.js")
const submitFeeback = require("./Routes/UpdateRating.js")
const getRating = require("./Routes/RetriveRating.js")
const {JWTGenerate,JWTVerify} = require("./Routes/jwt.js");
const connect = require('./Utils/Db.js');
const cookieParser = require('cookie-parser')
const path = require('path');

const express = require('express');
const SendReply = require("./Routes/SendReply.js");
const AccountView = require("./Routes/AcoountView.js");
const app = express();
const port = 3001;

app.use(cookieParser());

app.use('/content/videos', express.static(path.join('C:', 'Users', 'Lenovo', 'Desktop', 'Developement Project', 'Student-Fontend', 'public', 'content', 'videos')));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//------------------------------------------------authentication route-----------------------------------------
// Define a route to login f
app.post('/login', (req, res) => {
  // Assuming Login function is modified to accept req, res, and next parameters
  Login(req, res);
});

//Route to register users
app.post('/Register',(req,res)=>{
    Register(req,res);
});

//------------------------------------------------------------------------------------
// These are Recommedation routes 

// Save to save the interest of the users 
app.post('/SaveInterst', (req, res)=>{
  SaveInterest(req,res)
})

app.post("/TopTenEnrollementCourses",(req, res)=>{
    GetInterest(req,res)
  })  


  //----------------------------------------------------Enrolled Courses routes ---------------------------
  app.post("/EnrolledCoursesView", (req,res)=>{
      EnrolledCoursesView(req,res);
  });

  app.post("/LearningMaterials",(res,req)=>{
    LearningMaterials(res,req);
  })

//--------------------------------------------------Discussion Forum--------------------------------------

// Dicussion from routes 
// Route to send discussion form
app.post('/sendDiscussionForm', (req, res)=>{
  SendDicussionForm(req,res)
});

// Route to view discussion messages
app.post('/viewMessageDF', (req, res)=>{
  ViewMessageDF(req,res)
});

app.post('/reply', (req, res)=>{
  SendReply(req,res)
});


app.post('/viewReply', (req, res)=>{
  ViewReply(req,res)
});


//------------------------------------Search Results---------------------------------------------------------
app.post('/Search', (req, res)=>{
  SearchView(req,res)
});

app.post('/SearchBarRecom', (req, res)=>{
  SearchBarRecommedation(req,res)
});

//-----------------------Enrollment routes--------------------------
app.post('/CheckEnrollment',(req, res)=>{
  CheckEnrollment(req,res)
})

app.post('/ModuleShow',(req, res)=>{
  ModuleShow(req,res)
})

app.post('/Checkout',(req, res)=>{
  checkout(req,res)
})
//-------------------------------------------------------------------

//--------------------------------------------Account------------------
app.post('/AccountView',(req, res)=>{
  AccountView(req,res)
})

app.post('/AccountEdit',(req, res)=>{
  AccountEdit(req,res)
})

//------------------------------------------------Rating--------------------------------
app.post('/submitRating',(req, res)=>{
  submitFeeback(req,res)
})

app.post('/ViewRatings',(req, res)=>{
  getRating(req,res)
})

//------------------------------------------Notification-----------------------------------
const { insertNotification, getAllNotifications, updateNotificationReadStatus,insertNotificationChecout } = require("./Routes/notification.js");

// Endpoint to insert a notification
app.post('/notificationInsert', (req, res) => {
    insertNotification(req, res);
});

app.post('/notificationInsertCheckout', (req, res) => {
  insertNotificationChecout(req, res);
});

// Endpoint to get all notifications
app.post('/notifications', (req, res) => {
    getAllNotifications(req, res);
});

// Endpoint to update notification read status
app.put('/notificationReadStatus', (req, res) => {
    updateNotificationReadStatus(req, res);
});

//-------------------------------------------------Progrssion-----------------------
app.post('/InsertProgress',(req, res)=>{
  InsertProgress(req,res)
})

app.post('/ViewModuleProgress',(req, res)=>{
  ViewProgress(req,res)
})

//------------------------------------------Test Route---------------------------------------------------
const Test = require("./Routes/Test.js");
app.post('/getTest', (req, res)=>{
  Test(req,res)
})

//-----------------------------------------auhthentication------------------------------------------

app.get('/checkauth', async (req, res) => {
  try {
      const token = req.cookies.token
      let UserID;
      if (token){
        UserID  = JWTVerify(token);
      }
      if (UserID) {
          const db = connect();
          const query = 'SELECT * FROM users WHERE UserID = ?';

          // Execute the query
          const results = await new Promise((resolve, reject) => {
              db.query(query, [UserID.UserID], (err, results) => {
                  if (err) {
                      reject(err);
                  } else {
                      resolve(results);
                  }
              });
          });

          db.end();

          if (results.length === 0) {
              return res.status(401).json({ error: 'Unauthorized' });
          }

          const user = results[0];
          res.status(200).json({ message: 'Success user found' });

      } else {
          return res.status(401).json({ error: 'Unauthorized' });
      }
  } catch (error) {
      console.error('Error in checkauth:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Define routes and functionality here
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app
