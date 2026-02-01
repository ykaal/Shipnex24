const wordpressService = require('../services/wordpressService');
const productImportService = require('../services/productImport');
const emailService = require('../services/emailService');
const supabase = require('../config/database');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

exports.triggerShopCreation = async (req, res) => {
    // Security Check
    if (req.headers['x-internal-secret'] !== process.env.INTERNAL_API_SECRET) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    const { userId, domainRequest, packageType } = req.body;

    try {
        // 1. Validate input
        if (!userId) throw new Error('User ID required');

        // 2. Determine Domain
        // const finalDomain = await domainGenerator.checkAndReserve(domainRequest);
        const finalDomain = domainRequest || `shop-${uuidv4().substring(0, 8)}.shipnex24.com`;

        // 3. Create DB Entry
        const { data: shop, error } = await supabase.from('client_shops').insert({
            user_id: userId,
            domain: finalDomain,
            status: 'creating'
        }).select().single();

        if (error) throw error;

        // 4. Start Async Process (Fire & Forget Response)
        runAsyncCreation(shop.id, finalDomain, req.body.email).catch(err => {
            logger.error(`FATAL: runAsyncCreation failed unexpectedly for ${finalDomain}`, err);
        });

        res.json({ status: 'started', shopId: shop.id, domain: finalDomain });
    } catch (err) {
        logger.error('Shop creation initiation failed', err);
        res.status(500).json({ error: err.message });
    }
};

async function runAsyncCreation(shopId, domain, email) {
    try {
        logger.info(`START: Async shop creation for ${domain}`);

        // Step 1: Install WordPress
        await supabase.from('shop_activities').insert({ shop_id: shopId, action: 'install_wp', status: 'started' });
        await wordpressService.installWordPress(domain, { /* mock ftp */ });

        // Step 2: Configure & Clone DB
        // await wordpressService.setupDatabase(...);

        // Step 3: Product Import
        await supabase.from('shop_activities').insert({ shop_id: shopId, action: 'import_products', status: 'started' });
        await productImportService.importProducts(domain, 'csv');

        // Step 4: Finalize
        await supabase.from('client_shops').update({ status: 'active' }).eq('id', shopId);

        // Step 5: Notify
        await emailService.sendWelcomeEmail(email, 'Customer', `https://${domain}`);

        logger.info(`DONE: Shop creation completed for ${domain}`);

    } catch (err) {
        logger.error(`FAILED: Shop creation for ${domain}`, err);
        await supabase.from('client_shops').update({ status: 'error' }).eq('id', shopId);
        // Create Ticket for Yasin
        await supabase.from('service_tickets').insert({
            subject: `🚨 FAILED: Shop Creation ${domain}`,
            message: `Error: ${err.message}`,
            priority: 'urgent',
            status: 'new'
        });
    }
}
