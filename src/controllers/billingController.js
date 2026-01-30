const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const logger = require('../utils/logger');

exports.createPortalSession = async (req, res) => {
    const { customerId } = req.body;

    if (!customerId) {
        return res.status(400).json({ error: 'Customer ID required' });
    }

    try {
        logger.info(`Creating Stripe portal session for customer ${customerId}`);

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: req.headers.origin || 'http://localhost:5173/dashboard',
        });

        res.json({ url: session.url });
    } catch (err) {
        logger.error('Stripe Portal Error', err);
        res.status(500).json({ error: 'Could not create billing portal session.' });
    }
};
