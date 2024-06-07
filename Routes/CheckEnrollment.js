const connect = require('../Utils/Db.js');
const {JWTGenerate,JWTVerify} = require("./jwt.js");

async function CheckEnrollment(req, res) {
    let db;
    let UserID
    try {
        const { courseID } = req.body;
        const token = req.cookies.token;
        console.log(token)
        if(token){
            UserID = JWTVerify(token);
        }
        console.log("This is token"+UserID)

        db = connect();

        // Query to check if the user is enrolled in the specified course
        const queryString = `SELECT * FROM enrollments WHERE courseID = ? AND userID = ?`;
        const [enrollmentResult] = await db.promise().query(queryString, [courseID, UserID.UserID]);

        // If the enrollmentResult array has at least one row, the user is enrolled
        const isEnrolled = enrollmentResult.length > 0;

        // Now you can fetch course details and send the response based on enrollment status
        if (isEnrolled) {
            res.status(200).json({ success: true, enrolled: true});
        } else {
            // User is not enrolled
            res.status(200).json({ success: true, enrolled: false });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal Server Error' });
        console.log(error)
    } finally {
        if (db) {
            db.end();
        }
    }
}

module.exports = CheckEnrollment;
