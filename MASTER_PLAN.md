# ShipNex24 - Master Plan & Technical Roadmap

Dieses Dokument dient als zentrale Wissensbasis für zukünftige Entwickler oder KI-Assistenten. Es beschreibt die Architektur, den aktuellen Stand und die geplanten Erweiterungen.

## 1. System-Architektur
ShipNex24 ist modular aufgebaut, um maximale Skalierbarkeit zu gewährleisten:

- **Backend (Node.js/Express)**: Standort: `/` (Root). Bedient die Domain `api.shipnex24.com`. Zuständig für Automatisierung, Webhooks und AI-Logik.
- **Frontend (React/Vite)**: Standort: `/dashboard`. Bedient die Domain `login.shipnex24.com`. Premium Dashboard mit Glassmorphism-Design.
- **Database & Auth (Supabase)**: Cloud-basiert. Verwaltet User-Profile, Shop-Daten und Authentifizierung.
- **Infrastructure (Hostinger)**: Node.js Hosting für das Backend, Static Hosting für das Frontend.

## 2. Der "Rote Faden" (Automatisierung)
1.  **Trigger**: Stripe Webhook empfängt `checkout.session.completed`.
2.  **Creation**: `shopCreation.js` startet den Prozess:
    - Datenbank-Eintrag in `client_shops`.
    - WordPress Installation via Template-Kloning.
    - Postfächer via `hostingerService.js` anlegen.
3.  **Onboarding**: Automatisierte E-Mail an den Kunden mit Zugangsdaten.

## 3. Dokumentierte Komponenten
- **Auth**: Supabase Auth (Email/Passwort). JWT für interne Sicherheit.
- **AI Assistant**: `aiController.js` (Backend) & `AIAssistant.jsx` (Frontend). Aktuell Mock-Daten, bereit für Gemini/OpenAI Integration.
- **Billing**: Stripe Billing Portal Integration via `billingController.js`.
- **Mailing**: `hostingerService.js` (Simuliert). Nächster Schritt: Echte API-Anbindung.

## 4. Roadmap für die nächste KI (Next Steps)
Falls du dieses Projekt übernimmst, hier sind die Prioritäten:

### Phase 1: Produktionsreife
- [ ] **Hostinger API**: Die Funktionen in `src/services/hostingerService.js` von Simulation auf echte API-Requests umstellen.
- [ ] **AI Model**: In `src/controllers/aiController.js` einen echten API-Key für Gemini oder OpenAI hinterlegen.
- [ ] **Error Handling**: Zusätzliche Retries für die WordPress-Installation einbauen.

### Phase 2: Features
- [ ] **Shop-Vorlagen**: Auswahl verschiedener WordPress-Templates im Checkout ermöglichen.
- [ ] **Statistiken**: Umsatz-Charts im Dashboard via Stripe API anzeigen.
- [ ] **Domain-Anbindung**: Automatisierte DNS-Prüfung für Kunden-Domains.

## 5. Wichtige Befehle
- `npm start`: Startet das Backend (Produktion).
- `cd dashboard && npm run dev`: Startet das Dashboard (Entwicklung).
- `cd dashboard && npm run build`: Erstellt das Produktions-Paket für das Dashboard.

---
*Dokument erstellt am 30.01.2026 von Antigravity.*
