const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const supabase = require('../config/database');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');
// const shopCreationService = require('../services/shopCreationService'); // Will be implemented next

exports.handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        logger.error('Webhook signature verification failed', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        logger.info(`Payment received for session ${session.id}`);

        try {
            // 1. Extract Customer Data
            const customerEmail = session.customer_details.email;
            const customerName = session.customer_details.name;
            const packageType = session.metadata?.package || 'business';

            // 2. Create/Get User in Supabase (Simplified: In real app, rely on Auth UID or create dummy)
            // For this automation, we assume we might need to create a profile even if Auth user doesn't exist yet, 
            // or we use the email to match.
            // Here we simulate creating a ticket directly.

            const { data: user, error: userError } = await supabase
                .from('profiles')
                .select('id')
                .eq('stripe_customer_id', session.customer)
                .single();

            // If no user found, we might log critical error or create a 'pending' ticket without user_id

            // 3. Create Service Ticket
            const { error: ticketError } = await supabase.from('service_tickets').insert({
                subject: `🛍️ Neuer ${packageType}-Shop für ${customerEmail}`,
                message: `Kunde hat bezahlt. Bitte Shop erstellen.\n\nPaket: ${packageType}\nEmail: ${customerEmail}\nName: ${customerName}`,
                status: 'new'
            });

            if (ticketError) logger.error('Failed to create ticket', ticketError);

            // 4. Send Welcome Email
            await emailService.sendWelcomeEmail(customerEmail, customerName, 'https://shipnex24.com/dashboard');

            // 5. Trigger Shop Creation (Async)
            // shopCreationService.startProcess({ email: customerEmail, ... });
            logger.info('Shop creation process would trigger here.');

        } catch (err) {
            logger.error('Error processing checkout session', err);
        }
    }

    res.json({ received: true });
};
