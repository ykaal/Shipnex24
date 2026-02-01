const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require('../utils/logger');

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.getAIResponse = async (req, res) => {
    const { message, context } = req.body;

    try {
        logger.info(`AI Assistant processing message with Gemini: ${message}`);

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is missing in .env");
        }

        const prompt = `
            Du bist ein hilfreicher KI-Assistent für das Projekt "ShipNex24". 
            ShipNex24 hilft Kunden dabei, automatisierte Shopify/WordPress-Shops zu erstellen und zu verwalten.
            Deine Aufgabe ist es, Fragen zum System, zur Abrechnung oder zur Shop-Verwaltung freundlich zu beantworten.
            
            Kontext: ${JSON.stringify(context || {})}
            Benutzer-Nachricht: ${message}
            
            Antworte kurz und prägnant auf Deutsch. Gib am Ende eine kurze "suggestion" für die nächste Frage (max 5 Wörter).
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Extrahiere Suggestion falls vorhanden oder generiere eine einfache
        const reply = responseText.split('Suggestion:')[0].trim();
        const suggestion = responseText.includes('Suggestion:')
            ? responseText.split('Suggestion:')[1].trim()
            : "Wie starte ich meinen Shop?";

        res.json({
            reply: reply,
            suggestion: suggestion
        });
    } catch (err) {
        logger.error('Gemini AI Assistant Error', err);
        res.status(500).json({
            error: 'Assistant is currently resting.',
            details: err.message,
            tip: "Falls der Fehler 'API Key not found' ist, prüfe ob der Key in der .env gespeichert wurde."
        });
    }
};
