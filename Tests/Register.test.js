import { describe, test, expect } from 'vitest';

test('should return success on a valid registration', async () => {
  const response = await fetch('http://localhost:3001/Register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Set the content type to JSON
    },
    body: JSON.stringify({
      Name: 'John Doe',
      Username: 'john_doe',
      Email: 'john@example.com',
      Role: 'user',
      Password: 'strongPassword',
    }),
  });

  const data = await response.json();
  console.log(data);

  expect(response.status).toBe(201); 
  expect(data.success).toBe('User registered successfully!');
});
