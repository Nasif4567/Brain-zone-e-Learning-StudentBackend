const connect = require('../Utils/Db.js');

async function ModuleShow(req, res) {
    let db;
    try {
        const courseID = req.body.courseID;
        db = connect(); 
        
        // Specify the columns you want to select from the courses table
        const queryString = `SELECT * FROM courses WHERE courseID = ?`; 
        const [result] = await db.promise().query(queryString, [courseID]);

        // Check if a course with the provided courseID was found
        if (result.length === 0) {
            return res.status(404).json({ success: false, error: 'Course not found' });
        }

        // Send the course data back as a response
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching course details:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
        // Close the database connection
        if (db) {
            db.end();
        }
    }
}

module.exports = ModuleShow;
