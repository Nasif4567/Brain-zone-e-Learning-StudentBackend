const connect = require('../Utils/Db.js');
const { JWTGenerate, JWTVerify } = require('./jwt.js');

async function updateRating(req, res) {
    let db;
    let UserID
    try {
        const { courseId, rating, feedback } = req.body;
        // const userID = req.session.userID; // Assuming you have user ID stored in session
        const token = req.cookies.token
        if(token){
            UserID = JWTVerify(token)
        }

        // Connect to the database
        db = await connect();

        // Check if the rating already exists for the given course and user
        const checkRatingQuery = `
            SELECT * 
            FROM Rating
            WHERE courseID = ? AND UserID = ?`;
        const [existingRatingRows] = await db.promise().query(checkRatingQuery, [courseId, UserID.userID]);

        if (existingRatingRows.length === 0) {
            // Insert a new rating if the combination of courseID and userID doesn't exist
            const insertRatingQuery = `
                INSERT INTO Rating (courseID, UserID, rating, feedback)
                VALUES (?, ?, ?, ?)`;
            await db.promise().query(insertRatingQuery, [courseId, UserID.userID, rating, feedback]);
        } else {
            // Update the existing rating
            const updateRatingQuery = `
                UPDATE Rating
                SET rating = ?, feedback = ?
                WHERE courseID = ? AND UserID = ?`;
            await db.promise().query(updateRatingQuery, [rating, feedback, courseId, UserID.userID]);
        }

        // Calculate the new average rating for the course
        const avgRatingQuery = `
            SELECT AVG(rating) as averageRating
            FROM Rating
            WHERE courseID = ?`;
        const [avgRatingResult] = await db.promise().query(avgRatingQuery, [courseId]);
        const averageRating = avgRatingResult[0].averageRating;

        // Update the courses table with the new average rating
        const updateCourseRatingQuery = `
            UPDATE courses
            SET courseRating = ?
            WHERE courseID = ?`;
        await db.promise().query(updateCourseRatingQuery, [averageRating, courseId]);

        // Return success response
        res.status(200).json({ success: true, message: 'Rating updated successfully' });
    } catch (error) {
        // Handle errors appropriately
        console.error('Error updating rating:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
        // Close the database connection
        if (db) {
            db.end();
        }
    }
}

module.exports = updateRating;
