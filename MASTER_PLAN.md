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

## 3. Business Suite (The Mega-Upgrade)
Wir erweitern die Plattform zur ultimativen All-in-One Business Lösung.

### A. Domain Intelligence Module
- **AI Domain Generator**: Kreative Namensfindung basierend auf Nische (powered by Gemini).
- **Availability Checker**: Echtzeit-Prüfung (Simuliert/API).
- **WHOIS Lookup**: Inhaber-Daten und Expiry-Dates.

### B. SEO Suite (AI-Powered)
- **Meta-Tag Generator**: Erstellt perfekte Title/Descriptions.
- **Content Audit**: Analysiert Texte auf Lesbarkeit und Keywords.
- **Keyword Research**: Findet "Low Hanging Fruits" Keywords für Kunden.

### C. Marketing Engine (The "Money Maker")
- **Lead Generator**: "Apollo-Style" Datenbank-Suche (AI-Simuliert) nach B2B Kontakten.
- **Cold Email System**: Erstellen und Versenden von Kampagnen.
- **Competitor Spy**: Analysiert Konkurrenz-Webseiten auf Schwachstellen.

## 4. Roadmap & Status

### Phase 1: Foundation (Live)
- [x] Hostinger Deployment
- [x] Stripe Integration
- [x] Basic AI Chatbot

### Phase 2: Business Suite Implementation (Current Focus)
- [/] **Planung**: Architektur definiert (Files: `domainController.js`, `seoController.js`, `marketingController.js`).
- [ ] **Backend Core**: Implementation der Controller und Routen.
- [ ] **Frontend UI**: Bau der "Glassmorphism" Interfaces für die neuen Tools.
- [ ] **Launch**: Integration in das User-Dashboard.

## 5. Wichtige Befehle
- `npm start`: Startet das Backend (Produktion).
- `cd dashboard && npm run dev`: Startet das Dashboard (Entwicklung).
- `node scripts/test-business-suite.js`: Testet die neuen Business-Funktionen (WIP).

---
*Dokument aktualisiert am 01.02.2026 für Mega-Upgrade.*
