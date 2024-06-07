const connect = require('../Utils/Db.js');

async function Test(req, res) {
    let db;
    try {
        const { courseId } = req.body; 
        db = connect();
        const query = "SELECT * FROM assessment WHERE courseID = ?"; // Correct SQL syntax
        const [result] = await db.promise().query(query, [courseId]);
        if (result.length === 0) {
            res.status(404).json({ error: 'No Data Found for assessment' });
        } else {
            res.status(200).json({ data: result });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', message: error.message });
    } finally {
        if (db) {
            db.end(); // Close database connection
        }
    }
}

module.exports = Test;
