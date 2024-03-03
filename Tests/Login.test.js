
const app = require('../app');
import { describe, test,expect } from 'vitest'

// test 1
describe('Login Route', async () => {
  test('should return a success message on valid login', async () => {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: 'Nasif.nasif',
        username: 'Nasif_123',
      }),
          
     
  });

  console.log(response);

    expect(response.status).toBe(200);
    expect(response.message).toBe('Login Success');
  });

  //Test 2
 /* test('should return an error message on invalid login with missing credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        // Missing username and password
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Username and Password are required');
  });
  
  // Test 3
  test('should return an error message on invalid login with incorrect credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        username: 'invaliduser',
        password: 'invalidpassword',
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid username or password');
  });
   
  //test 4
  test('should return an error message on internal server error', async () => {
    // Mocking a situation where the database connection fails
    jest.spyOn(require('../Utils/Db.js'), 'query').mockImplementationOnce((query, params, callback) => {
      callback(new Error('Database connection error'), null);
    });

    const response = await request(app)
      .post('/login')
      .send({
        username: 'Nasif_123',
        password: 'Nasif.nasif',
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal Server Error');
  });

  */

  
}); 
