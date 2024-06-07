const connect = require('../Utils/Db.js');

async function SearchView(req, res) {
    let db;
    try {
        const keyword = req.body.keyword;

        // Split the keyword into individual words
        const keywords = keyword.split(' ');

        // Create an array to store the WHERE clauses for each keyword
        const whereClauses = keywords.map(kw => `
            (courseName LIKE '%${kw}%'
            OR courseCategory LIKE '%${kw}%'
            OR courseDescription LIKE '%${kw}%')
        `);

        // Join the WHERE clauses with OR to form the final WHERE condition
        const whereCondition = whereClauses.join(' OR ');

        const query = `
            SELECT *,
                CASE
                    WHEN courseName LIKE '%${keyword}%' THEN 1
                    WHEN courseCategory LIKE '%${keyword}%' THEN 2
                    WHEN courseDescription LIKE '%${keyword}%' THEN 3
                    ELSE 4 -- Default priority if no match
                END AS priority
            FROM courses
            WHERE ${whereCondition}
            ORDER BY priority ASC, studentEnrolled DESC;
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

module.exports = SearchView;
