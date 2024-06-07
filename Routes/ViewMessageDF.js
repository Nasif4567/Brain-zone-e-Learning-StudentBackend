const connect = require('../Utils/Db.js');

async function ViewMessageDF(req, res) {
    let db;
    try {
        const { courseID } = req.body;
        
        if (!courseID) {
            return res.status(400).json({ success: false, error: 'courseID is required' });
        }
        console.log(courseID)

        const query = "SELECT * FROM discussions WHERE courseID = ?";
        db = connect();
        const [result] = await db.promise().query(query, [courseID]);

        // Send the result as a JSON response
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        // Handle errors appropriately
        console.error('Error in ViewMessageDF:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
        // Close the database connection in the finally block
        if (db) {
            db.end();
        }
    }
}

module.exports = ViewMessageDF;
