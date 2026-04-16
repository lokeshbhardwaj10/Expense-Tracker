require('dotenv').config();
const axios = require('axios');

const token = process.env.TEST_TOKEN;
if (!token) {
  console.error('Missing TEST_TOKEN in environment. Please set TEST_TOKEN in your .env file.');
  process.exit(1);
}

async function run() {
  try {
    console.log('deleting');
    const res = await axios.delete('http://localhost:5000/api/expenses/69a2c405ca63bcbcacff0e81', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('deleted', res.data);
  } catch (err) {
    console.error('axios error', err.response?.status, err.response?.data, err.message);
  }
}

run();