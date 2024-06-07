const connect = require('../Utils/Db.js');

async function ViewReply(req, res) {
    let db;
    const {discussion_id} = req.body;
    try {
        const query = "SELECT * FROM messages WHERE discussion_id = ?";
        db = connect();
        const [result] = await db.promise().query(query,[discussion_id] );
        // Send the result as a JSON response
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        // Handle errors appropriately
        console.error('Error in View Reply:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
        // Close the database connection in the finally block
        if (db) {
            db.end();
        }
    }
}

module.exports = ViewReply;

