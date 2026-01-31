require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const rateLimit = require('express-rate-limit');
const stripeWebhook = require('./src/controllers/stripeWebhook');
const logger = require('./src/utils/logger');

const app = express();

logger.info(`Server starting...`);
logger.info(`Current directory (__dirname): ${__dirname}`);
logger.info(`Checking index.html in ${__dirname}: ${require('fs').existsSync(path.join(__dirname, 'index.html'))}`);

// Security Middleware
app.use(helmet());
app.use(cors({ origin: ['https://shipnex24.com', 'https://login.shipnex24.com', 'http://localhost:5173'] }));
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Stripe Webhook (Must be before JSON parser because it needs raw body)
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhook.handleWebhook);

// Regular Middleware
app.use(express.json());

// Routes
app.get('/api/health', async (req, res) => {
  let dbStatus = 'waiting';
  try {
    const supabase = require('./src/config/database');
    const { data, error } = await supabase.from('client_shops').select('count', { count: 'exact', head: true });
    dbStatus = error ? 'error' : 'connected';
  } catch (e) {
    dbStatus = 'disconnected';
  }

  res.json({
    status: 'ok',
    service: 'shipnex24-backend',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/debug-files', (req, res) => {
  const fs = require('fs');
  const files = fs.readdirSync(__dirname);
  res.json({
    dirname: __dirname,
    files: files,
    existsIndex: fs.existsSync(path.join(__dirname, 'index.html'))
  });
});

app.use('/api/internal/create-shop', require('./src/controllers/shopCreation').triggerShopCreation);

// Customer Dashboard Routes
const aiController = require('./src/controllers/aiController');
const billingController = require('./src/controllers/billingController');

app.post('/api/ai/chat', aiController.getAIResponse);
app.post('/api/billing/portal', billingController.createPortalSession);

// Serve Static Frontend Files
app.use(express.static(path.join(__dirname, '.')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Explicitly serve index.html for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle React Router - Serve index.html for any non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 ShipNex24 Automator running on port ${PORT}`);
});
