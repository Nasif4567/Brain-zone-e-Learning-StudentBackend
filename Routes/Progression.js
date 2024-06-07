const connect = require('../Utils/Db.js');
const {JWTGenerate,JWTVerify} = require("./jwt.js");

async function InsertProgress(req, res) {
  let connection;
  let UserID
  try {
    // Destructuring request body to extract data
    const { CourseName, contentID, Progress, courseID } = req.body;
    const token = req.cookies.token;
        if(token){
        UserID = JWTVerify(token);
        }

        console.log("Tag"+ UserID.UserID)

    // Using async/await with the promise wrapper
    connection = await connect(); // Assuming connect() returns a promise-based database connection

    // Check if a record with the same UserID, CourseName, and contentID exists
    const [existingRows] = await connection.promise().query(
      'SELECT * FROM Progression WHERE UserID = ? AND courseID = ?',
      [UserID.UserID, courseID]
    );

    if (existingRows.length > 0) {
      // If record exists, update the existing record
      const updateResult = await connection.promise().query(
        'UPDATE Progression SET Progress = ?, CourseName = ?, contentID = ? WHERE UserID = ? AND courseID = ?',
        [Progress, CourseName, contentID, UserID.UserID, courseID]
      );

      if (updateResult.affectedRows > 0) {
        res.status(200).json({ success: 'Progression data updated successfully!' });
      } else {
        res.status(500).json({ error: 'Failed to update progression data.' });
      }
    } else {
      // If record doesn't exist, insert a new record
      const insertResult = await connection.promise().query(
        'INSERT INTO Progression (CourseName, UserID, Progress, contentID, courseID) VALUES (?, ?, ?, ?, ?)',
        [CourseName, UserID.UserID, Progress, contentID, courseID]
      );

      if (insertResult.affectedRows > 0) {
        res.status(201).json({ success: 'Progression data inserted successfully!' });
      } else {
        res.status(500).json({ error: 'Failed to insert progression data.' });
      }
    }
  } catch (error) {
    console.error('Error inserting/updating progression data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

module.exports = InsertProgress;
