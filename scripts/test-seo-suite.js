const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:3000/api/seo';

async function testSeoSuite() {
    console.log('🚀 Starting SEO Suite Tests...\n');

    // 1. Meta Tag Generation
    try {
        console.log('👉 Testing Meta Tag Generator (Wireless Headphones)...');
        const res1 = await axios.post(`${API_URL}/generate`, {
            title: 'Wireless Pro Headphones',
            description: 'Best noise cancelling headphones 2026',
            niche: 'Electronics'
        });
        console.log('✅ Result:', res1.data);
    } catch (err) {
        console.error('❌ Meta Gen Failed:', err.response?.data || err.message);
    }

    // 2. Content Audit
    try {
        console.log('\n👉 Testing Content Audit (Sample Text)...');
        const res2 = await axios.post(`${API_URL}/audit`, {
            content: 'Buy our stuff clearly best stuff.',
            mainKeyword: 'best stuff'
        });
        console.log('✅ Result:', res2.data);
    } catch (err) {
        console.error('❌ Audit Failed:', err.response?.data || err.message);
    }

    // 3. Keyword Research
    try {
        console.log('\n👉 Testing Keyword Research (Coffee)...');
        const res3 = await axios.post(`${API_URL}/keywords`, { topic: 'Coffee Beans' });
        console.log('✅ Result:', res3.data);
    } catch (err) {
        console.error('❌ Keyword Research Failed:', err.response?.data || err.message);
    }
}

testSeoSuite();
