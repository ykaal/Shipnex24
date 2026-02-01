const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:3000/api/marketing';

async function testMarketingSuite() {
    console.log('🚀 Starting Marketing Engine Tests...\n');

    // 1. Lead Generation (Apollo Style)
    let leads = [];
    try {
        console.log('👉 Testing Lead Gen (Tech Startups in Berlin)...');
        const res1 = await axios.post(`${API_URL}/leads`, {
            industry: 'SaaS',
            location: 'Berlin, Germany',
            jobTitle: 'CEO'
        });
        console.log('✅ Found Leads:', res1.data.leads.length);
        console.log('Example Lead:', res1.data.leads[0]);
        leads = res1.data.leads;
    } catch (err) {
        console.error('❌ Lead Gen Failed:', err.response?.data || err.message);
    }

    // 2. Campaign Creation
    if (leads.length > 0) {
        try {
            console.log('\n👉 Testing Campaign Creation (Cold Outreach)...');
            const res2 = await axios.post(`${API_URL}/campaign`, {
                campaignName: 'Q1 Outreach',
                subject: 'Partnership Opportunity',
                body: 'Hello, check out ShipNex24...',
                leads: leads
            });
            console.log('✅ Campaign Status:', res2.data);
        } catch (err) {
            console.error('❌ Campaign Failed:', err.response?.data || err.message);
        }
    }

    // 3. Competitor Analysis
    try {
        console.log('\n👉 Testing Competitor Spy (shopify.com)...');
        const res3 = await axios.post(`${API_URL}/competitor`, { url: 'shopify.com' });
        console.log('✅ Analysis:', res3.data);
    } catch (err) {
        console.error('❌ Competitor Spy Failed:', err.response?.data || err.message);
    }
}

testMarketingSuite();
