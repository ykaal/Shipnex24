const supabase = require('../config/database');
const logger = require('../utils/logger');
const axios = require('axios');

/**
 * Admin Controller for platform management
 */

// Get all shops (Global Overview)
exports.getAllShops = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('client_shops')
            .select(`
                *,
                profiles (
                    full_name,
                    email
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        logger.error('Admin: Failed to fetch all shops', err);
        res.status(500).json({ error: 'Failed to fetch global shop overview', details: err.message });
    }
};

// Simulate Payment / Trigger Shop Creation
exports.simulateShopCreation = async (req, res) => {
    const { email, domain, packageType } = req.body;

    try {
        logger.info(`Admin: Triggering manual simulation for ${email}`);

        // This simulates the internal API call that would normally come from the simulation script
        // but now triggered directly from the UI.
        const response = await axios.post(`http://localhost:${process.env.PORT || 3000}/api/internal/create-shop`, {
            email,
            domainRequest: domain,
            packageType: packageType || 'business'
        }, {
            headers: {
                'x-internal-secret': process.env.INTERNAL_API_SECRET,
                'Content-Type': 'application/json'
            }
        });

        res.json({ success: true, message: 'Simulation triggered', data: response.data });
    } catch (err) {
        logger.error('Admin: Simulation failed', err.response ? err.response.data : err.message);
        res.status(500).json({
            error: 'Simulation failed',
            details: err.response ? err.response.data : err.message,
            tip: 'Check if INTERNAL_API_SECRET matches in .env'
        });
    }
};

// Get Platform Health
exports.getPlatformHealth = async (req, res) => {
    try {
        const { data, error } = await supabase.from('client_shops').select('count', { count: 'exact', head: true });

        res.json({
            status: 'online',
            database: error ? 'error' : 'connected',
            timestamp: new Date().toISOString(),
            details: error ? error.message : null
        });
    } catch (err) {
        res.status(500).json({ status: 'offline', details: err.message });
    }
};
