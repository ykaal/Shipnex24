const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require('../utils/logger');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

/**
 * Checks if a domain is available (Simulated).
 * In a real app, this would query a registrar API like Namecheap or GoDaddy.
 */
exports.checkAvailability = async (req, res) => {
    const { domain } = req.body;

    if (!domain) {
        return res.status(400).json({ error: "Domain name is required" });
    }

    try {
        // Simulation Logic:
        // domains ending with 'x' or 'q' are "taken" to show variety in demo.
        const isTaken = domain.includes('test') || domain.endsWith('x.com') || domain.endsWith('q.com');

        const price = isTaken ? null : (Math.floor(Math.random() * 20) + 9.99).toFixed(2);

        res.json({
            domain: domain,
            available: !isTaken,
            price: isTaken ? null : `$${price}`,
            currency: 'USD',
            provider: 'ShipNex Domains'
        });

    } catch (err) {
        logger.error('Domain Check Failed', err);
        res.status(500).json({ error: 'Domain Availability Check Failed' });
    }
};

/**
 * Returns WHOIS information (Simulated).
 */
exports.getWhois = async (req, res) => {
    const { domain } = req.body;

    if (!domain) {
        return res.status(400).json({ error: "Domain name is required" });
    }

    // Mock WHOIS Data
    const mockWhois = {
        domainName: domain,
        registrar: "Best Domains LLC",
        creationDate: "2023-05-12T10:00:00Z",
        expiryDate: "2026-05-12T10:00:00Z",
        nameservers: ["ns1.shipnex24.com", "ns2.shipnex24.com"],
        status: ["clientTransferProhibited"]
    };

    res.json(mockWhois);
};

/**
 * AI Domain Name Generator.
 * Uses Gemini to generate creative domain names based on user input/niche.
 */
exports.generateIdeas = async (req, res) => {
    const { keyword, niche, tld = 'com' } = req.body;

    try {
        const prompt = `
            Act as a creative naming expert. Generate 10 catchy, available, and brandable domain name ideas for the following niche:
            
            Keyword: ${keyword || 'Business'}
            Niche: ${niche || 'General'}
            Preferred TLD: .${tld}
            
            Rules:
            1. Response must be a JSON array of strings.
            2. Names should be short (under 15 chars).
            3. Include a mix of abstract names and keyword-rich names.
            4. Do not include markdown formatting, just the raw JSON.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Clean up markdown if Gemini includes it
        const cleanedText = text.replace(/```json|```/g, '').trim();
        const domains = JSON.parse(cleanedText);

        res.json({
            suggestions: domains
        });

    } catch (err) {
        logger.error('Domain Idea Gen Failed', err);
        res.status(500).json({
            error: 'AI Domain Generation Failed',
            fallback: [`try${keyword}.com`, `get${keyword}.com`, `${keyword}hq.com`, `my${keyword}.net`]
        });
    }
};
