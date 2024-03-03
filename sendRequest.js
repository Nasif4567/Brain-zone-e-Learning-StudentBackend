const axios = require('axios');

const data = {
  username: 'Nasif_123',
  password: 'Nasif.nasif',
};

axios.post('http://localhost:5000/login', data)
  .then(response => {
    // Log the JSON message from the response for a successful request
    console.log(response.data);
  })
  .catch(error => {
    // Log the error message from the server response
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  });

