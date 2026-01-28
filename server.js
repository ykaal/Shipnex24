// BACKEND ONLY - Kein Frontend Code!
const express = require('express');
const cron = require('node-cron');
const axios = require('axios');
const app = express();

// CORS für Frontend Zugriff
app.use(require('cors')());
app.use(express.json());

// ========= PERPLEXITY CHAT API =========
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'de' } = req.body;
    
    const PPLX_API_KEY = process.env.PERPLEXITY_API_KEY || 'ein_dummy_key_zum_testen';
    
    const prompt = language === 'de' 
      ? `SHIPNEX24 Assistent (Fulfillment München). Preise: 4,50€ Regale, 0,25€ Lager. Ende mit "Möchten Sie ein Angebot?" Frage: ${message}`
      : `SHIPNEX24 assistant (Fulfillment Munich). Prices: €4.50 shelves, €0.25 storage. End with "Need a quote?" Question: ${message}`;

    const response = await axios.post('https://api.perplexity.ai/chat/completions', {
      model: 'sonar-small-chat',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.7
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PPLX_API_KEY}`
      }
    });

    res.json({ 
      response: response.data.choices[0].message.content 
    });

  } catch (error) {
    res.json({ 
      response: language === 'de' 
        ? 'Bitte kontaktieren Sie uns: info@shipnex24.de'
        : 'Please contact us: info@shipnex24.de'
    });
  }
});

// ========= BESTEHENDE ROUTES =========
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'automation-backend' });
});

app.get('/api/run-backup', (req, res) => {
  res.json({ message: 'Backup started' });
});

// ========= CRON JOBS =========
cron.schedule('0 3 * * *', () => {
  console.log('Running daily automation...');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend mit Perplexity Chat auf Port ${PORT}`);
});
