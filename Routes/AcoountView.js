const connect = require('../Utils/Db.js');
const {JWTGenerate,JWTVerify} = require("./jwt.js");

async function AccountView(req, res) {
    let db;
    let UserID ;
    try {
        const  token  = req.cookies.token;
        if (token){
            UserID = JWTVerify(token)
        }
        
        db = connect();
        
        
        // Query to select all data from the user table
        const queryString = `SELECT * FROM users WHERE UserID=?`; 
        
        // Execute the query
        const [userData] = await db.promise().query(queryString,[UserID.UserID]);

        // Check if user data was retrieved
        if (userData.length === 0) {
            return res.status(404).json({ success: false, error: 'No users found' });
        }

        // Send the user data back as a response
        res.status(200).json({ success: true, data: userData });
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching user data:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
        // Close the database connection
        if (db) {
            db.end();
        }
    }
}

module.exports = AccountView;
