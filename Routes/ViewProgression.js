const connect = require('../Utils/Db.js');
const {JWTGenerate,JWTVerify} = require('./jwt.js');

async function ViewProgress(req, res) {
  let connection;
  let UserID;
  try {
    const token = req.cookies.token
        if(token){
            UserID = JWTVerify(token)
        }

    // Using async/await with the promise wrapper
    connection = await connect(); // Assuming connect() returns a promise-based database connection

    // Query the Progression table to retrieve the progress for the specified user and course
    const [progressRows] = await connection.promise().query(
      'SELECT * FROM progression WHERE UserID = ?',
      [UserID.UserID]
    );
      // If progress data found, return it
      res.status(200).json({ data: progressRows });
    
  } catch (error) {
    console.error('Error retrieving progression data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

module.exports = ViewProgress;

