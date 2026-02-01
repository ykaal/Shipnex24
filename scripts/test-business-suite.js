const axios = require('axios');

async function testBusinessSuite() {
    try {
        console.log('🔍 Testing Domain Check (google.com - Should be taken)...');
        const res1 = await axios.get('https://login.shipnex24.com/api/tools/domain/check?domain=google.com');
        console.log('✅ Result:', res1.data);

        console.log('\n💡 Testing Domain Ideas (AI)...');
        const res2 = await axios.post('https://login.shipnex24.com/api/tools/domain/ideas', { keywords: 'sneaker shop' });
        console.log('✅ Result:', res2.data);

        console.log('\n📈 Testing SEO Gen (AI)...');
        const res3 = await axios.post('https://login.shipnex24.com/api/tools/seo/generate', {
            title: 'Wireless Headphones',
            description: 'Best headphones for running',
            niche: 'Electronics'
        });
        console.log('✅ Result:', res3.data);

    } catch (err) {
        console.error('❌ Error:', err.response ? err.response.data : err.message);
    }
}

testBusinessSuite();
