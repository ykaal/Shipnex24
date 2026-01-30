# ShipNex24 - Final Handover & Launch Guide

Dieses Dokument enthält alle wichtigen Informationen für dein Projekt. Bewahre es an einem sicheren Ort auf.

## 1. Domain-Übersicht
| Bereich | URL | Zweck |
| :--- | :--- | :--- |
| **Hauptseite** | `https://shipnex24.com` | Marketing, Verkauf, Landingpage. |
| **Kunden-Login** | `https://login.shipnex24.com` | Das Dashboard (React), in dem Kunden alles verwalten. |
| **Backend / API** | `https://api.shipnex24.com` | Das "Gehirn" (Node.js), das alles automatisiert. |

## 2. Deine Accounts & Zugänge
*   **Datenbank:** Supabase (PostgreSQL)
*   **Payments:** Stripe (Abrechnung & Customer Portal)
*   **Mailboxen:** Hostinger API (Automatisierung von bis zu 5 Postfächern pro Shop)
*   **Login-System:** Supabase Auth (E-Mail & Passwort)

## 3. Funktionen für deine Kunden
- **Dashboard**: Automatisierte Shop-Auflistung.
- **WP-Login**: Direkter Button zum WordPress-Admin.
- **AI Assistent**: Integrierte KI-Hilfe direkt im Dashboard.
- **Self-Service**: Kunden können ihre Abos und Mails selbst verwalten.

## 4. Wichtige Dateien für den Upload
1.  **Dashboard (Login-Seite)**:
    - Inhalt des Ordners `dashboard/dist/`
    - Die Datei `.htaccess` (wichtig für das Routing!)
2.  **Server (Backend)**:
    - Alle Dateien im Hauptverzeichnis (außer `dashboard/`, `node_modules/` und `.git/`).
    - Deine `.env` Datei muss im hPanel unter "Environment Variables" eingetragen werden.

## 5. Nächste Schritte für dich (Voraussetzungen)
- [ ] **Supabase**: Stelle sicher, dass in den Supabase Settings unter "Auth" das Login per E-Mail/Passwort aktiviert ist.
- [ ] **Stripe**: Trage die Webhook-URL `https://api.shipnex24.com/api/webhooks/stripe` in deinem Stripe Dashboard ein.
- [ ] **Hostinger API**: Falls noch nicht geschehen, trage deinen Hostinger API Key in die `.env` / Environment Variables ein.

---
Viel Erfolg beim Launch von ShipNex24! Das System ist jetzt auf High-End Niveau und bereit für deine ersten Kunden.
