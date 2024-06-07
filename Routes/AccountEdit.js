const connect = require('../Utils/Db.js');

async function AccountEdit(req, res) {
    let db;
    try {
        console.log('Request body:', req.body); // Log the request body

        // Retrieve the user ID and new data from the request body
        const { userID, newData } = req.body;

        // Connect to the database
        db = connect();
        console.log('Connected to database');

        // Construct the update query
        const queryString = `UPDATE users SET ? WHERE UserID = ?`;
        console.log('Executing query:', queryString, newData, newData.UserID);

        // Execute the update query with the new data and user ID
        await db.promise().query(queryString, [newData, newData.UserID]);

        // Send a success response
        res.status(200).json({ success: true, message: 'User data updated successfully' });
    } catch (error) {
        // Log detailed error message
        console.error('Error updating user data:', error.message);
        if (error.sqlMessage) {
            console.error('SQL Error:', error.sqlMessage);
        }
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
        // Close the database connection
        if (db) {
            db.end();
            console.log('Database connection closed');
        }
    }
}

module.exports = AccountEdit;
