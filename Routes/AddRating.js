const connect = require('../Utils/Db.js');

async function AddRating(courseId) {
    let db;
    try {
        // Connect to the database
        db = connect();

        // Get the average rating for the specified course ID from the ratings table
        const getAverageRatingQuery = `
            SELECT AVG(rating) AS averageRating 
            FROM ratings 
            WHERE courseID = ?`;
        const [result] = await db.promise().query(getAverageRatingQuery, [courseId]);

        // Extract the average rating from the result
        const { averageRating } = result[0];

        // Update the average rating for the course in the courses table
        const updateCourseRatingQuery = `
            UPDATE courses 
            SET averageRating = ? 
            WHERE courseID = ?`;
        await db.promise().query(updateCourseRatingQuery, [averageRating, courseId]);

        // Return the updated average rating
        return averageRating;
    } catch (error) {
        // Handle errors appropriately
        console.error('Error updating course rating:', error);
        throw new Error('Error updating course rating');
    } finally {
        // Close the database connection
        if (db) {
            db.end();
        }
    }
}

module.exports = updateCourseRating;
