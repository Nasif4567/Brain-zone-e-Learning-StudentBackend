const connect = require('../Utils/Db.js');
const {JWTGenerat,JWTVerify} = require("./jwt.js");

// Function to insert a notification
async function insertNotification(req, res) {
    let db;
    try {
        const { notiTitle, notiMessage, link } = req.body;
        const {ReplyPersonUserID} = req.body;

        // Validate input
        if (!notiTitle || !notiMessage) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        db = connect();
        const insertQuery = `INSERT INTO notification (notiTitle, notiMessage, \`read\`, UserID, link) VALUES (?, ?, ?, ?, ?)`;
        const result = await db.promise().execute(insertQuery, [notiTitle, notiMessage, false, ReplyPersonUserID, link]);

        if (result[0].affectedRows === 0) {
            return res.status(500).json({ success: false, error: 'Failed to insert notification' });
        }

        res.status(200).json({ success: true, message: 'Notification added successfully', notificationID: result[0].insertId });
    } catch (error) {
        console.error('Error inserting notification:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
        if (db) {
            db.end();
        }
    }
}

async function insertNotificationChecout(req, res) {
    let db;
    let UserID
    try {
        const { notiTitle, notiMessage, link } = req.body;
        const token = req.cookies.token;
        if(token){
        UserID = JWTVerify(token);
        }

        // Validate input
        if (!notiTitle || !notiMessage) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        db = connect();
        const insertQuery = `INSERT INTO notification (notiTitle, notiMessage, \`read\`, UserID, link) VALUES (?, ?, ?, ?, ?)`;
        const result = await db.promise().execute(insertQuery, [notiTitle, notiMessage, false, UserID.UserID, link]);

        if (result[0].affectedRows === 0) {
            return res.status(500).json({ success: false, error: 'Failed to insert notification' });
        }

        res.status(200).json({ success: true, message: 'Notification added successfully', notificationID: result[0].insertId });
    } catch (error) {
        console.error('Error inserting notification:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
        if (db) {
            db.end();
        }
    }
}

async function getAllNotifications(req, res) {
    let db;
    let UserID
    console.log("tag")
    console.log(req.cookies)
    try {
        const token = req.cookies.token
        if(token){
        UserID = JWTVerify(token);
        }
        db = connect();
        const selectQuery = 'SELECT * FROM notification WHERE UserID =?';
        const [rows] = await db.promise().query(selectQuery, [UserID.UserID]);
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
        if (db) {
            db.end();
        }
    }
}

// Function to update the 'read' status of a notification
async function updateNotificationReadStatus(req, res) {
    let db;
    try {
        const { notificationID } = req.body;

        if (!notificationID) {
            return res.status(400).json({ success: false, error: 'Missing notificationID' });
        }

        db = connect();
        const updateQuery = `UPDATE notification SET \`read\` = ? WHERE notificationID = ?`;
        const [result] = await db.promise().execute(updateQuery, [true, notificationID]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        res.status(200).json({ success: true, message: 'Notification read status updated successfully' });
    } catch (error) {
        console.error('Error updating notification read status:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
        if (db) {
            db.end();
        }
    }
}

module.exports = {
    insertNotification,
    getAllNotifications,
    updateNotificationReadStatus,
    insertNotificationChecout
};
