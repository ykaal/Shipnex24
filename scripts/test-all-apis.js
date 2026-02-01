const axios = require('axios');

async function testAll() {
    console.log('🧪 Testing Live API Endpoints...\n');

    // Test 1: Health Check
    try {
        console.log('1️⃣ Testing /api/health...');
        const health = await axios.get('https://login.shipnex24.com/api/health');
        console.log('✅ Health:', JSON.stringify(health.data, null, 2));
    } catch (err) {
        console.error('❌ Health failed:', err.response ? err.response.status : err.message);
    }

    console.log('\n');

    // Test 2: AI Chat
    try {
        console.log('2️⃣ Testing /api/ai/chat...');
        const chat = await axios.post('https://login.shipnex24.com/api/ai/chat', {
            message: 'Hallo, wer bist du?'
        });
        console.log('✅ AI Response:', JSON.stringify(chat.data, null, 2));
    } catch (err) {
        console.error('❌ Chat failed:', err.response ? err.response.status + ' - ' + err.response.statusText : err.message);
    }

    console.log('\n');

    // Test 3: Admin Shops
    try {
        console.log('3️⃣ Testing /api/admin/shops...');
        const shops = await axios.get('https://login.shipnex24.com/api/admin/shops');
        console.log('✅ Shops:', JSON.stringify(shops.data, null, 2));
    } catch (err) {
        console.error('❌ Shops failed:', err.response ? err.response.status + ' - ' + err.response.statusText : err.message);
    }
}

testAll();
