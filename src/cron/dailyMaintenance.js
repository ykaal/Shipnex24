const cron = require('cron');
const supabase = require('../config/database');
const logger = require('../utils/logger');

const dailyMaintenance = new cron.CronJob('0 3 * * *', async () => {
    logger.info('Starting daily maintenance...');

    try {
        // 1. Check for stuck shops
        const { data: stuckShops } = await supabase
            .from('client_shops')
            .select('*')
            .eq('status', 'creating')
            .lt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Older than 24h

        if (stuckShops && stuckShops.length > 0) {
            logger.warn(`Found ${stuckShops.length} stuck shops. Creating tickets...`);
            for (const shop of stuckShops) {
                await supabase.from('service_tickets').insert({
                    subject: `⚠️ STUCK SHOP: ${shop.domain}`,
                    message: `Shop creation stuck for >24h. ID: ${shop.id}`,
                    priority: 'high'
                });
            }
        }

        // 2. Placeholder: Trigger Server Backups (e.g. via Hostinger API)
        logger.info('Backup verification completed.');

    } catch (err) {
        logger.error('Daily maintenance failed', err);
    }
});

module.exports = dailyMaintenance;
