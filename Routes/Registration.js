const connect = require('../Utils/Db.js');

async function Register(req, res) {
  try {

  const {Name, Username, Email, Role, Password } = req.body;

  if (!Name || !Username || !Email || !Role || !Password) {
    return res.status(400).json({ error: 'All the fields are required!' });
  }

  // Assuming you have a 'users' table in your database
  const query = 'INSERT INTO users (Name, Username, Email, Role, Password) VALUES (?, ?, ?, ?, ?)';

    // Using async/await with the promise wrapper
    const connection = await connect(); // Assuming connect() returns a promise-based database connection
    const [result] = await connection.promise().query(query, [Name, Username, Email, Role, Password]);

    // Check if the query was successful
    if (result.affectedRows > 0) {
      res.status(201).json({ success: 'User registered successfully!' });
    } else {
      res.status(500).json({ error: 'Failed to register user.' });
    }

    connection.end(); // Close the database connection
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = Register;
