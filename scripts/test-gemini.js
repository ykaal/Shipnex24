const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testGemini() {
    const key = process.env.GEMINI_API_KEY;
    console.log(`Testing Gemini Flash Latest with key: ${key ? key.substring(0, 10) + '...' : 'MISSING'}`);

    if (!key) return;

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent("Hi");
        console.log("✅ Response:", result.response.text());
    } catch (err) {
        console.error("❌ Error:", err.message);
    }
}

testGemini();
