const connect = require('../Utils/Db.js');
const {JWTGenerate,JWTVerify} = require("./jwt.js");

async function checkout(req, res) {
    let db;
    let UserID ;
    console.log(req.cookies)
    try {
        const { cart } = req.body;
        const token = req.cookies.token
        if(token){
        UserID = JWTVerify(token)
        console.log("Check out " + UserID.UserID)}

        db = connect();

        // Start a transaction
        await db.promise().beginTransaction();

        // Iterate over each item in the cart
        for (const item of cart) {
            const { courseID } = item;

            // Insert a new enrollment record into the enrollment table
            const enrollmentQueryString = `INSERT INTO enrollments (courseID, userID) VALUES (?, ?)`;
            await db.promise().query(enrollmentQueryString, [courseID, UserID.UserID]);

            // Update the studentEnrolled count in the courses table
            const updateCourseQueryString = `UPDATE courses SET studentEnrolled = studentEnrolled + 1 WHERE courseID = ?`;
            await db.promise().query(updateCourseQueryString, [courseID]);
        }

        // Commit the transaction
        await db.promise().commit();

        // Send success response
        res.status(200).json({ success: true, message: 'Checkout successful' });
    } catch (error) {

        console.error('Error during checkout:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
        if (db) {
            db.end();
        }
    }
}

module.exports = checkout;
