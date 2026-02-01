const axios = require('axios');

const API_TOKEN = 'CoxmtpObbvioP6NoGaZFTTHr8dYeE1X2gTgNvMKY6b5154fb';
const BASE_URL = 'https://api.hostinger.com';

async function listWebsites() {
    try {
        console.log('🔍 Fetching websites...');
        const response = await axios.get(`${BASE_URL}/v1/websites`, {
            headers: { 'Authorization': `Bearer ${API_TOKEN}` }
        });
        console.log('✅ Websites:', JSON.stringify(response.data, null, 2));
    } catch (err) {
        if (err.response) {
            console.error('❌ API Error:', err.response.status, err.response.data);
        } else {
            console.error('❌ Error:', err.message);
        }
    }
}

listWebsites();
