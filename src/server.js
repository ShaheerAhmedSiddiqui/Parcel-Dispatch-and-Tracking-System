// src/server.js - starts the HTTP server (kept separate so tests can import app.js)
const app = require('./app');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});