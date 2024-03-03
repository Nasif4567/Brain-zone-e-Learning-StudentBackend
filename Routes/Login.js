const connect = require('../Utils/Db.js');

function Login(req, res) {
    const { username, password } = req.body;

    // Handle empty user!
    if (!username || !password) {
        console.error('Username and password not found');
        return res.status(400).json({ error: 'Username and Password are required' });
    }

    const db = connect();
    const query = 'SELECT * FROM users WHERE Username = ?';

    // execute the query
    db.query(query, [username], async (err, results) => {
        // Close the database connection first
        db.end();

        // Shows error if there is some internet server error caught in the connection
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // This handles the username and password, checks if the username and password are invalid or not.
        if (results.length === 0) {
            //console.error('Invalid username or password');
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // This code will return the first value of result explanation: because based on the retrieval from the username, there
        // should be only one user as the username is always unique
        const user = results[0];

        if (password === user.password) {
            //console.log('Login Success');
            return res.json({ message: 'Login Success' });
        } else {
            //console.error('Invalid username or password');
            return res.status(401).json({ error: 'Invalid username or password' });
        }
    });
}

module.exports = Login;
