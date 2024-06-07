const connect = require('../Utils/Db.js');
const {JWTGenerat,JWTVerify} = require("./jwt.js");

async function SaveInterest(req, res) {
  let con;
  let UserID;

  try {
    const { SelectedOptions } = req.body;
    const token = req.cookies.token;
    if (token){
      UserID = JWTVerify(token)
    }


    if (!SelectedOptions || SelectedOptions.length === 0) {
      return res.status(400).json({ error: 'Please add Interest so that we can recommend you courses' });
    }

    const query = "INSERT INTO studentinterest(StudentID, interests) VALUES (?,?)";

    con = await connect();
    const [result] = await con.promise().query(query, [UserID.UserID, JSON.stringify(SelectedOptions)]);

    // Check if the query was successful
    if (result.affectedRows > 0) {
      res.status(201).json({ success: 'User interest saved ' });
    } else {
      res.status(500).json({ error: 'Failed to save user interest.' });
    }

  } catch (error) {
    console.error('Error saving user interest:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (con) {
      con.end();
    }
  }
}

module.exports = SaveInterest;
