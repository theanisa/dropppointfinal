import axios from 'axios';

(async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      studentId: 'test1234',
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    console.log('OK', res.data);
  } catch (err) {
    console.error('ERR', err.response ? err.response.data : err.message);
    process.exit(1);
  }
})();
