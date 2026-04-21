const axios = require('axios');
(async ()=>{
  try {
    const tok = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWExOGI1OWNhNjNiY2JjYWNmZjBlNmMiLCJpYXQiOjE3NzIxOTQ2NjgsImV4cCI6MTc3MjI4MTA2OH0.d61Lho97d2-qkwZaEKyM1JrGLAvpgjUxlW8G7KzXP0k';
    const res = await axios.delete('http://localhost:5000/api/expenses/69a2c405ca63bcbcacff0e81',{
      headers:{Authorization:`Bearer ${tok}`}
    });
    console.log('deleted',res.data);
  } catch(err) {
    console.error('axios error', err.response?.status, err.response?.data, err.message);
  }
})();