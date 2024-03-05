const connect = require('../Utils/Db.js');

async function Login(req, res) {
    try {
        
    const { username, password } = req.body;

    // Handle empty user!
    if (!username || !password) {
        console.error('Username and password not found');
        return res.status(400).json({ error: 'Username and Password are required' });
    }

    const db = connect();
    const query = 'SELECT * FROM users WHERE Username = ?';

        // execute the query
        const results = await new Promise((resolve, reject) => {
            db.query(query, [username], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        // Close the database connection
        db.end();

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = results[0];

        if (password === user.Password) {
            return res.status(200).json({ message: 'Login Success' });
        } else {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = Login;
