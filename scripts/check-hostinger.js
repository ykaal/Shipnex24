const axios = require('axios');

const API_TOKEN = 'CoxmtpObbvioP6NoGaZFTTHr8dYeE1X2gTgNvMKY6b5154fb';

async function checkHostinger() {
    try {
        console.log('Checking Hostinger API with token...');
        // Standard Hostinger API endpoint (example)
        const response = await axios.get('https://api.hostinger.com/v1/websites', {
            headers: { 'Authorization': `Bearer ${API_TOKEN}` }
        });
        console.log('✅ Websites found:', response.data);
    } catch (err) {
        console.error('❌ Error:', err.response ? err.response.data : err.message);
    }
}

checkHostinger();
