require('dotenv').config();
const logger = require('./src/utils/logger');

// Global Error Handlers
process.on('uncaughtException', (err) => {
  logger.error('CRITICAL: Uncaught Exception:', err);
  setTimeout(() => process.exit(1), 1000);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const stripeWebhook = require('./src/controllers/stripeWebhook');
const path = require('path');

const app = express();

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

app.use('/api/internal/create-shop', require('./src/controllers/shopCreation').triggerShopCreation);

// Customer Dashboard Routes
const aiController = require('./src/controllers/aiController');
const billingController = require('./src/controllers/billingController');

app.post('/api/ai/chat', aiController.getAIResponse);
app.post('/api/billing/portal', billingController.createPortalSession);

// Serve Static Frontend Files
const rootDir = path.resolve(__dirname);
app.use(express.static(rootDir));
app.use('/assets', express.static(path.join(rootDir, 'assets')));

// Handle React Router - Serve index.html for any non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(rootDir, 'index.html'));
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
