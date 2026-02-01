const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:3000/api/domain';

async function testDomainSuite() {
    console.log('🚀 Starting Domain Suite Tests...\n');

    // 1. Test Availability Checker
    try {
        console.log('👉 Testing Availability Check (shipnex-test.com)...');
        const res1 = await axios.post(`${API_URL}/check`, { domain: 'shipnex-test.com' });
        console.log('✅ Result:', res1.data);
    } catch (err) {
        console.error('❌ Check Failed:', err.response?.data || err.message);
    }

    // 2. Test WHOIS Lookup
    try {
        console.log('\n👉 Testing WHOIS Lookup (google.com)...');
        const res2 = await axios.post(`${API_URL}/whois`, { domain: 'google.com' });
        console.log('✅ Result:', res2.data);
    } catch (err) {
        console.error('❌ WHOIS Failed:', err.response?.data || err.message);
    }

    // 3. Test AI Generator
    try {
        console.log('\n👉 Testing AI Domain Generator (Niche: Tech Startup)...');
        const res3 = await axios.post(`${API_URL}/generate`, {
            keyword: 'future',
            niche: 'AI Technology',
            tld: 'io'
        });
        console.log('✅ Result:', res3.data);
    } catch (err) {
        console.error('❌ Generator Failed:', err.response?.data || err.message);
    }
}

testDomainSuite();
