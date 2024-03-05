import { describe, test, expect } from 'vitest';

describe('Login Route', async () => {
  // Test 1
  test('should return a success message on valid login', async () => {
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: 'Nasif.nasif',
        username: 'Nasif_123',
      }),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Login Success');
  });

  // Test 2
  test('should return an error message on invalid login with missing credentials', async () => {
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Missing username and password
      }),
    });

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Username and Password are required');
  });

  // Test 3
  test('should return an error message on invalid login with incorrect credentials', async () => {
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'invaliduser',
        password: 'invalidpassword',
      }),
    });

    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Invalid username or password');
  });
});
