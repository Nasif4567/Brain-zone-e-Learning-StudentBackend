const connect = require('../Utils/Db.js');
const { JWTGenerate, JWTVerify } = require('./jwt.js');
const bcrypt = require('bcrypt');

async function Register(req, res) {
  let connection;
  try {
    const { Name, Username, Email, Role, Password } = req.body;

    if (!Name || !Username || !Email || !Role || !Password) {
      return res.status(400).json({ error: 'All the fields are required!' });
    }

    // Check if the user already exists in the database by email or username
    connection = await connect();
    const [existingUserByEmail] = await connection.promise().query('SELECT * FROM users WHERE Email = ?', [Email]);
    const [existingUserByUsername] = await connection.promise().query('SELECT * FROM users WHERE Username = ?', [Username]);

    if (existingUserByEmail.length > 0 || existingUserByUsername.length > 0) {
      return res.status(400).json({ error: 'User with the provided email or username already exists!' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    // If the user doesn't exist, proceed with user registration
    const query = 'INSERT INTO users (Name, Username, Email, Role, Password) VALUES (?, ?, ?, ?, ?)';
    const [result] = await connection.promise().query(query, [Name, Username, Email, Role, hashedPassword]);

    // Check if the query was successful
    if (result.affectedRows > 0) {
      const token = JWTGenerate(result.insertId);
      return res.status(201).json({ success: 'User registered successfully!', token: token });
    } else {
      res.status(500).json({ error: 'Failed to register user.' });
    }

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

module.exports = Register;
