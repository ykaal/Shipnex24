const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:3000';
const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET;

async function simulatePayment() {
    console.log('🚀 Starte Zahlungssimulation...');

    try {
        // Wir nutzen den internen API-Endpunkt, um die Shop-Erstellung direkt zu triggern
        // Dies umgeht die Stripe-Signatur-Prüfung für Testzwecke.
        const response = await axios.post(`${API_URL}/api/internal/create-shop`, {
            userId: 'test-user-id', // Optionaler Platzhalter
            domainRequest: `test-shop-${Math.floor(Math.random() * 1000)}.shipnex24.com`,
            packageType: 'business',
            email: 'test@beispiel.de'
        }, {
            headers: {
                'x-internal-secret': INTERNAL_SECRET,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Simulation erfolgreich!');
        console.log('Antwort:', response.data);
        console.log('\nDu kannst jetzt im Dashboard prüfen, ob der Shop in der Liste auftaucht.');
    } catch (error) {
        console.error('❌ Simulation fehlgeschlagen:', error.response ? error.response.data : error.message);
        if (!INTERNAL_SECRET) {
            console.log('Tipp: Prüfe ob INTERNAL_API_SECRET in der .env gesetzt ist.');
        }
    }
}

simulatePayment();
