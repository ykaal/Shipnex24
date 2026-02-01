const dns = require('dns').promises;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require('../utils/logger');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

class DomainService {
    /**
     * Checks if a domain is registered via DNS lookup.
     * Note: This is a basic check. 'ENOTFOUND' often means available, but not always.
     */
    async checkAvailability(domain) {
        try {
            await dns.resolve(domain);
            return { domain, startus: 'taken', details: 'DNS Record found' };
        } catch (err) {
            if (err.code === 'ENOTFOUND') {
                return { domain, status: 'available', details: 'No DNS record (Likely available)' };
            }
            throw err;
        }
    }

    /**
     * Generates domain ideas based on keywords using AI.
     */
    async generateIdeas(keywords) {
        try {
            const prompt = `Generate 5 creative, available-sounding .com domain names for a business about: "${keywords}". Return JSON array only: ["example.com", "foo.com"]`;
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const cleanText = text.replace(/```json|```/g, '').trim();
            return JSON.parse(cleanText);
        } catch (err) {
            logger.error('Domain Idea Gen Failed', err);
            return ['error-gen.com'];
        }
    }
}

module.exports = new DomainService();
