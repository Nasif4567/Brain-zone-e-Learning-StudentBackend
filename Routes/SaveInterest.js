const connect = require('../Utils/Db.js');

async function SaveInterest(req,res){
    try {
    const { SelectedOptions } = req.body; // intest should be accepted as array 
    const userID = 1; // hardcoded user name 
    console.log(SelectedOptions);

    // get the session and after login through that session it can be save in inside the interest field 
    // The form session user ID can be retrived  
    
    if (SelectedOptions && SelectedOptions.length === 0) {
        throw new Error('Add Interest so that we can recommend you courses');
      }

    const query = "INSERT INTO studentinterest(StudentID,interests) VALUES (?,?)";

    const con = await connect();
    const [result] = await con.promise().query(query, [userID,JSON.stringify(SelectedOptions)]);

    // Check if the query was successful
    if (result.affectedRows > 0) {
        res.status(201).json({ success: 'User interest saved ' });
      } else {
        res.status(500).json({ error: 'Failed to save user interest.' });
      }
     
      con.end();

    } catch (error) {
        console.error('Error saving user interest:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

module.exports = SaveInterest