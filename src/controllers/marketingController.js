const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require('../utils/logger');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

/**
 * Apollo-style Lead Generation (Simulated/AI).
 * Finds B2B contacts based on criteria.
 */
exports.getLeads = async (req, res) => {
    const { industry, location, jobTitle } = req.body;

    try {
        // In a real app, this would query Apollo/Seamless.ai API.
        // Here we simulate realistic leads using AI to generate the data structure.

        const prompt = `
            Generate 5 realistic B2B lead profiles for:
            Industry: ${industry}
            Location: ${location}
            Job Title: ${jobTitle}
            
            Return a JSON array of objects. Each object must have:
            - firstName, lastName
            - company
            - email (use realistic patterns like first.last@company.com)
            - linkedinUrl (dummy)
            - phone (dummy)
            
            Make them look professional and varied.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const json = JSON.parse(text.replace(/```json|```/g, '').trim());

        // Augment with "verification status" to look like Apollo
        const leads = json.map(lead => ({
            ...lead,
            status: Math.random() > 0.3 ? 'verified' : 'questionable',
            dataSource: 'Apollo (Simulated)'
        }));

        res.json({ leads });

    } catch (err) {
        logger.error('Lead Gen Failed', err);
        res.status(500).json({ error: 'Lead Generation Failed' });
    }
};

/**
 * Creates/Sends an Email Campaign.
 */
exports.createCampaign = async (req, res) => {
    const { campaignName, subject, body, leads } = req.body;

    if (!leads || leads.length === 0) {
        return res.status(400).json({ error: 'No leads selected for campaign' });
    }

    // Mock Sending Process
    logger.info(`Starting Campaign: ${campaignName} (Subject: ${subject})`);

    // Simulate sending time
    const successfulSends = leads.length; // Assume 100% success for mock

    res.json({
        status: 'scheduled',
        campaignId: 'cmp_' + Math.floor(Math.random() * 100000),
        recipientCount: leads.length,
        estimatedDelivery: 'Immediate'
    });
};

/**
 * Competitor Analysis Spy Tool.
 */
exports.analyzeCompetitor = async (req, res) => {
    const { url } = req.body;

    try {
        const prompt = `
            Analyze the business website: ${url}.
            Identify 3 strengths and 3 weaknesses in their marketing/design strategy based on general knowledge of such sites.
            
            Return JSON:
            {
              "competitor": "${url}",
              "strengths": ["...", "..."],
              "weaknesses": ["...", "..."],
              "opportunity": "One major opportunity to beat them is..."
            }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        logger.info(`AI Response for Competitor Analysis: ${text}`); // Debug Log

        let json;
        try {
            json = JSON.parse(text.replace(/```json|```/g, '').trim());
        } catch (e) {
            logger.error('JSON Parse Error', e);
            throw new Error('Invalid JSON from AI');
        }

        res.json(json);

    } catch (err) {
        logger.error('Competitor Analysis Failed', err);
        res.status(500).json({ error: 'Analysis Failed' });
    }
};
