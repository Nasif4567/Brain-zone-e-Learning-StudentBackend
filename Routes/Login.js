const connect = require('../Utils/Db.js');
const express = require('express');
const router = express.Router();
const { JWTGenerate, JWTVerify } = require('./jwt.js');
const bcrypt = require('bcrypt');

async function Login(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            console.error('Username and password not found');
            return res.status(400).json({ error: 'Username and Password are required' });
        } else {
            const db = await connect();
            const query = 'SELECT * FROM users WHERE Username = ?';

            // Execute the query
            const results = await new Promise((resolve, reject) => {
                db.query(query, [username], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });

            db.end();

            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const user = results[0];
            console.log(user);

            // Compare the hashed password with the provided password
            const isPasswordMatch = await bcrypt.compare(password, user.Password);

            if (isPasswordMatch) {
                const token = JWTGenerate(user.UserID);
                return res.status(200).json({ message: 'Login Success', token: token });
            } else {
                return res.status(401).json({ error: 'Invalid username or password' });
            }
        }
    } catch (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = Login;
