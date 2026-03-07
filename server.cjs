const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const distDir = path.join(__dirname, 'dist');
const indexFile = path.join(distDir, 'index.html');

app.use(express.static(distDir));

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// SPA fallback for React Router.
app.use((req, res) => {
  if (!fs.existsSync(indexFile)) {
    return res.status(500).send('Missing dist/index.html. Run build/package first.');
  }
  return res.sendFile(indexFile);
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  const url = `http://127.0.0.1:${port}`;
  console.log(`Kabo FichesGen server running on port ${port}`);

  // Open the web UI automatically when launched as a packaged app.
  if (process.env.NO_BROWSER !== '1') {
    if (process.platform === 'win32') exec(`start "" "${url}"`);
    else if (process.platform === 'darwin') exec(`open "${url}"`);
    else exec(`xdg-open "${url}"`);
  }
});
