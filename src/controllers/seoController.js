const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require('../utils/logger');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

/**
 * Generates SEO Meta Tags (Title, Description, Keywords) using AI.
 */
exports.generateMetaTags = async (req, res) => {
    const { title, description, niche } = req.body;
    try {
        const prompt = `
            Act as an E-commerce SEO Expert. Generate high-converting Meta Title and Meta Description for the following page.
            
            Niche: ${niche}
            Page Name/Product: ${title}
            Context/Description: ${description}
            
            Requirements:
            - Title should be < 60 characters.
            - Description should be < 160 characters.
            - Include 5 relevant keywords.
            - Output purely valid JSON format.
            
            Return JSON: { "title": "...", "description": "...", "keywords": ["..."] }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const json = JSON.parse(text.replace(/```json|```/g, '').trim());

        res.json(json);
    } catch (err) {
        logger.error('SEO Gen Failed', err);
        res.status(500).json({ error: 'SEO Generation Failed' });
    }
};

/**
 * Audits page content for SEO best practices using AI.
 */
exports.auditContent = async (req, res) => {
    const { url, content, mainKeyword } = req.body;

    // If URL is provided, we would normally fetch it.
    // For now, we expect 'content' to be passed or we simulate an audit.
    const textToAnalyze = content || `(Simulated content for ${url})`;

    try {
        const prompt = `
            Analyze the following text for SEO optimization targeting the keyword: "${mainKeyword || 'General'}".
            
            Content Snippet:
            "${textToAnalyze.substring(0, 500)}..."
            
            Provide a score (0-100) and 3 actionable suggestions.
            Return JSON: { "score": 85, "suggestions": ["...", "...", "..."], "sentiment": "positive/neutral/negative" }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const json = JSON.parse(text.replace(/```json|```/g, '').trim());

        res.json(json);

    } catch (err) {
        logger.error('SEO Audit Failed', err);
        res.status(500).json({ error: 'SEO Audit Failed', details: err.message });
    }
};

/**
 * Generates keyword ideas with search volume estimates (Simulated via AI).
 */
exports.keywordResearch = async (req, res) => {
    const { topic } = req.body;

    try {
        const prompt = `
            Generate 10 high-potential SEO keywords related to: "${topic}".
            For each keyword, estimate a monthly search volume (realistic random number) and competition level (Low/Medium/High).
            
            Return JSON Array:
            [
              { "keyword": "...", "volume": 1200, "competition": "Low" },
              ...
            ]
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const json = JSON.parse(text.replace(/```json|```/g, '').trim());

        res.json({ keywords: json });

    } catch (err) {
        logger.error('Keyword Research Failed', err);
        res.status(500).json({ error: 'Keyword Research Failed' });
    }
};
