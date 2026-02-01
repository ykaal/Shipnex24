const axios = require('axios');

async function testChat() {
    try {
        console.log('Testing Chat API...');
        const response = await axios.post('http://localhost:3000/api/ai/chat', {
            message: 'Hallo, wer bist du?'
        });
        console.log('✅ Response:', response.data);
    } catch (err) {
        console.error('❌ Error:', err.response ? err.response.data : err.message);
    }
}

testChat();
