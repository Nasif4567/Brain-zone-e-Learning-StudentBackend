const connect = require('../Utils/Db.js');

async function LearningMaterials(req, res) { // Adjust the order of parameters
    let db; // Declare db outside the try block to ensure it's accessible in the finally block
    try {
        const { courseID } = req.body;

        const query = "SELECT * FROM coursecontent WHERE courseID=?"; // Corrected query syntax

        db = connect();
        const result = await db.promise().query(query, [courseID]);

        res.status(200).json({ data: result[0] });

    } catch (error) {
        // Handle errors appropriately
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });

    } finally {
        // Close the database connection
        if (db) {
            db.end();
        }
    }
}

module.exports = LearningMaterials;
