
const connect = require('../Utils/Db.js');

async function SearchBarRecommedation(req, res) {
    let db;
    try {
        const keyword = req.body.keyword;

        if (!keyword) {
            res.status(400).json({ error: "Need keyword" });
            return; // Return to avoid further execution
        }
        

        const query = `
            SELECT courseCategory, courseName, courseLanguage
            FROM courses 
            WHERE courseCategory LIKE '%${keyword}%' OR courseName LIKE '%${keyword}%' 
            OR courseLanguage LIKE '%${keyword}%'
            LIMIT 10
        `;

        db = connect();
        const [result] = await db.promise().query(query);

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

module.exports = SearchBarRecommedation;
