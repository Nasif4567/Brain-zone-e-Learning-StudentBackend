const connect = require('../Utils/Db.js');
const {JWTGenerate,JWTVerify} = require("./jwt.js");

async function TopTenCoursesEnrolledSelectByCatagory(req, res ,categories) {
    let db;
    try {
         db = connect();

        if (!categories || !Array.isArray(categories) || categories.length === 0) {
            return res.status(400).json({ success: false, error: 'Invalid or missing categories' });
        }
        
        //console.log(categories);
        const placeholders = categories.map(item => `'${item}'`);
        
        const queryString = `
            SELECT courses.courseId, courses.courseName, courses.courseCategory, courses.courseImage, courses.courseRating, courses.studentEnrolled
            FROM courses
            WHERE courseCategory IN (${placeholders.join(',')})
            GROUP BY courses.courseId, courses.courseCategory
            ORDER BY courses.studentEnrolled DESC
            LIMIT 10
        `;
        
        // You can also use query parameters to prevent SQL injection
        const result = await db.promise().query(queryString);

        // Assuming you have a response object, you can send the result back
        res.status(200).json({ success: true, data: result });

    } catch (error) {
        // Handle errors appropriately
        console.error('Error in TopTenCoursesEnrolledSelectByCatagory:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
         // Close the database connection
        if (db) {
        db.end();
    }
    }
}



async function GetInterest(req,res){
    let db;
    let studentid;

    try {
    const token = req.cookies.token;
    if(token){
        console.log(token)
        studentid = JWTVerify(token)
    }
    console.log(studentid)

      db = await connect();
      const query = "SELECT studentinterest.interests FROM studentinterest WHERE StudentID = ?";

      const result = await db.promise().query(query, [studentid.UserID]);

      const categories = result[0].map(item => item.interests);
      const flattenedCategories = categories.flat();
    

     TopTenCoursesEnrolledSelectByCatagory(req, res, flattenedCategories,db);
      
  } catch (error) {
      console.error('Error in to load the student interst:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
  } finally {
    if (db) {
        db.end();
    }
  }
}

module.exports =  {GetInterest} ;



