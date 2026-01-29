const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const stripeWebhook = require('./src/controllers/stripeWebhook');
const logger = require('./src/utils/logger');
require('dotenv').config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({ origin: ['https://shipnex24.com', 'http://localhost:3000'] }));
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
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'shipnex24-backend' });
});

// app.use('/api/internal/create-shop', require('./src/controllers/shopCreation'));

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 ShipNex24 Automator running on port ${PORT}`);
});
