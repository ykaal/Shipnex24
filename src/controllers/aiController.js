const logger = require('../utils/logger');

exports.getAIResponse = async (req, res) => {
    const { message, context } = req.body;

    try {
        logger.info(`AI Assistant processing message: ${message}`);

        // Simulation of AI Response (e.g. Gemini or OpenAI)
        // In production: const response = await gemini.generateText(message);

        const mockResponses = [
            "Hallo! Ich bin dein ShipNex KI-Assistent. Wie kann ich dir heute helfen?",
            "Um dein WordPress-Passwort zu ändern, gehe einfach in den WordPress-Admin-Bereich unter 'Benutzer'.",
            "Du kannst bis zu 5 Postfächer pro Shop anlegen. Aktuell hast du noch 3 frei.",
            "Dein Shop wird gerade optimiert. In wenigen Minuten ist alles bereit für deine Produkte!"
        ];

        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

        res.json({
            reply: randomResponse,
            suggestion: "Möchtest du wissen, wie du Produkte importierst?"
        });
    } catch (err) {
        logger.error('AI Assistant Error', err);
        res.status(500).json({ error: 'Assistant is currently resting.' });
    }
};
