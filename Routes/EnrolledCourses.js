const connect = require('../Utils/Db.js');
const { JWTGenerate, JWTVerify } = require("./jwt.js");

async function EnrolledCoursesView(req, res) {
    let db;
    let UserID;
    try {
        const token = req.cookies.token;
        if (token) {
            UserID = JWTVerify(token);
        }

        const query = `
            SELECT courses.courseID, courses.courseName, courses.courseInstructor, courses.courseImage
            FROM enrollments
            INNER JOIN courses ON enrollments.courseID = courses.courseID
            WHERE enrollments.UserID = ?
        `;

        db = connect();
        const [result] = await db.promise().query(query, [UserID.UserID]);

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
        if (db) {
            db.end();
        }
    }
}

module.exports = EnrolledCoursesView;
