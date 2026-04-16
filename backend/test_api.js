// Node 18+ has global fetch — use it to avoid adding dependencies
(async () => {
  try {
    let token;

    // try signup, fallback to login if user exists
    try {
      const s = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test+bot@example.com', password: 'password123' }),
      });
      if (!s.ok) throw new Error('signup failed');
      const sd = await s.json();
      token = sd.token;
      console.log('Signed up, token length:', token ? token.length : 0);
    } catch (e) {
      const l = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test+bot@example.com', password: 'password123' }),
      });
      if (!l.ok) throw new Error('login failed');
      const ld = await l.json();
      token = ld.token;
      console.log('Logged in, token length:', token ? token.length : 0);
    }

    const createdRes = await fetch('http://localhost:5000/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: 'Test Expense', amount: 123 }),
    });
    const created = await createdRes.json();
    console.log('Created:', created);

    const listRes = await fetch('http://localhost:5000/api/expenses', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const list = await listRes.json();
    console.log('List length:', Array.isArray(list) ? list.length : 'N/A');
    console.log(list);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
})();