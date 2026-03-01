const express = require('express');
const path = require('path');

const app = express();

// Serve static build files
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Kabo FichesGen server running on port ${port}`);
});
