// BACKEND ONLY - Kein Frontend Code!
const express = require('express');
const cron = require('node-cron');
const app = express();

// KEINE Frontend Routes!
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'automation-backend' });
});

// Automation Endpoints
app.get('/api/run-backup', (req, res) => {
  // Backup-Logik hier
  res.json({ message: 'Backup started' });
});

// Cron Jobs
cron.schedule('0 3 * * *', () => {
  console.log('Running daily automation...');
});

const PORT = process.env.PORT || 3001; // Anderer Port als Frontend!
app.listen(PORT, () => {
  console.log(`🚀 Automation Backend on port ${PORT}`);
});
