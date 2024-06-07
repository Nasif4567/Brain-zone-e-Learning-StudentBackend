const connect = require('../Utils/Db.js');
const {JWTGenerate,JWTVerify} = require("./jwt.js");

async function SendReply(req, res) {
  let connection;
  let UserID;
  try {
    // Extracting data from the request body
    const { discussion_id,content } = req.body;
    const token = req.cookies.token
        if(token){
            UserID = JWTVerify(token)
        }

    // Checking if required fields are provided
    if (!discussion_id || !content) {
      return res.status(400).json({ error: 'Discussion ID and content are required fields.' });
    }

    // SQL query to insert the reply into the database
    const query = 'INSERT INTO messages (discussion_id,user_id,content,image) VALUES (?, ?,?,?)';

    // Establishing a database connection
    connection = await connect(); // Assuming connect() returns a promise-based database connection

    // Executing the query to insert the reply
    const [result] = await connection.promise().query(query, [discussion_id,UserID.UserID, content,null]);

    // Checking if the query was successful
    if (result.affectedRows > 0) {
      const messageId = result.insertId;
      console.log(messageId)
      return res.status(201).json({ success: 'Reply sent successfully.', messageId });
    } else {
      return res.status(500).json({ error: 'Failed to send reply.' });
    }
  } catch (error) {
    console.error('Error sending reply:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

module.exports = SendReply;
