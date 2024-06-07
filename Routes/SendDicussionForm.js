const connect = require('../Utils/Db.js');
const {JWTGenerate,JWTVerify} = require("./jwt.js");

async function SendDiscussionForm(req, res) {
    let db;
    let UserID;
    try { 
    
        const { question, body ,image ,courseId} = req.body;
        const token = req.cookies.token
        if(token){
            UserID = JWTVerify(token)
        }
      

        if (!question || !body) {
            return res.status(400).json({ error: "Please add a question with body" });
        }

        // Connect to the database
        db = await connect();

        // Start a transaction
        await db.promise().beginTransaction();

        // Write the query for discussions table
        const discussionQuery = "INSERT INTO discussions (Question, created_by, courseID) VALUES (?, ?, ?)";

        // Execute the discussions query
        const [discussionResults] = await db.promise().query(discussionQuery, [question, UserID.UserID, courseId]);

        // Check if the discussions query was successful
        if (discussionResults && discussionResults.affectedRows > 0) {
            // Write the query for messages table
            const messageQuery = "INSERT INTO messages (discussion_id, user_id, content, created_at ,image) VALUES (?, ?, ?, NOW(), ?)";

            // Execute the messages query
            const [messageResults] = await db.promise().query(messageQuery, [discussionResults.insertId, UserID.UserID, body, image]);

            // Check if the messages query was successful
            if (messageResults && messageResults.affectedRows > 0) {
                // Commit the transaction if both queries are successful
                await db.promise().commit();
                return res.status(201).json({ success: 'Message sent!' });
            } else {
                // Rollback the transaction if messages query fails
                await db.promise().rollback();
                console.error('No rows affected in messages:', messageResults);
                return res.status(500).json({ error: 'Failed to send message.' });
            }
        } else {
            // Rollback the transaction if discussions query fails
            await db.promise().rollback();
            console.error('No rows affected in discussions:', discussionResults);
            return res.status(500).json({ error: 'Failed to send message.' });
        }
    } catch (error) {
        // Rollback the transaction on error
        if (db) {
            await db.promise().rollback();
        }
        // Handle errors appropriately
        console.error('Error sending message:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        // Close the database connection in the finally block
        if (db) {
            db.end();
        }
    }
}

module.exports = SendDiscussionForm;
