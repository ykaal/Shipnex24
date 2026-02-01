const axios = require('axios');
require('dotenv').config();

async function listAllModels() {
    const key = process.env.GEMINI_API_KEY;
    console.log(`Auditing key: ${key}`);

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
        const response = await axios.get(url);
        console.log("✅ Models found:", response.data.models.map(m => m.name));
    } catch (err) {
        if (err.response) {
            console.error("❌ REST API Error:", err.response.status, err.response.data);
        } else {
            console.error("❌ Error:", err.message);
        }
    }
}

listAllModels();
