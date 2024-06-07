const connect = require('../Utils/Db.js');

async function getUserCourseRating(req, res) {
    let db;
    try {
        const { courseId } = req.params; // Assuming courseId is passed as a URL parameter
        // const userID = req.session.userID; // Assuming you have user ID stored in session
        const userID = 1; // Hardcoded userID for testing

        // Connect to the database
        db = connect();

        // Query to retrieve the rating and feedback given by the user for the course
        const userRatingQuery = `
            SELECT rating, feedback
            FROM Rating
            WHERE courseID = ? AND UserID = ?`;

        // Execute the query
        const [ratingRows] = await db.promise().query(userRatingQuery, [courseId, userID]);

        // If the user has not rated the course, return a response indicating that
        if (ratingRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Rating not found for the user in this course' });
        }

        // Extract rating and feedback
        const { rating, feedback } = ratingRows[0];

        // Return the response
        res.status(200).json({
            success: true,
            rating,
            feedback
        });
    } catch (error) {
        // Handle errors appropriately
        console.error('Error retrieving user course rating:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
        // Close the database connection
        if (db) {
            db.end();
        }
    }
}

module.exports = getUserCourseRating;
