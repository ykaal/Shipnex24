const axios = require('axios');

async function testSimulation() {
    try {
        console.log('Testing Shop Simulation on LIVE server...');
        const response = await axios.post('https://login.shipnex24.com/api/admin/simulate', {
            email: 'test-deploy@example.com',
            domain: 'test-shipnex-deploy.com',
            packageType: 'starter'
        });
        console.log('✅ Status:', response.status);
        console.log('✅ Simulation Result:', JSON.stringify(response.data, null, 2));
    } catch (err) {
        console.error('❌ Error:', err.response ? err.response.data : err.message);
    }
}

testSimulation();
