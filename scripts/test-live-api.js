const axios = require('axios');

async function testLive() {
    try {
        console.log('Testing LIVE Chat API at login.shipnex24.com...');
        const response = await axios.post('https://login.shipnex24.com/api/ai/chat', {
            message: 'Hallo, wer bist du?'
        });
        console.log('✅ LIVE Response:', response.data);
    } catch (err) {
        console.error('❌ LIVE Error:', err.response ? err.response.data : err.message);
    }
}

testLive();
