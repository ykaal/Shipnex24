# Deployment Guide (Subdomain Strategy)

Die beste Lösung für ShipNex24 ist eine saubere Trennung der Bereiche. Das ist sicher, professionell und einfach zu skalieren.

## Ziel-Architektur
- **`shipnex24.com`**: Deine Hauptseite (WordPress/Landingpage).
- **`api.shipnex24.com`**: Das Backend (Node.js Server).
- **`login.shipnex24.com`**: Das Kunden-Dashboard (React App).

---

## 1. Backend Deployment (api.shipnex24.com)
1. **Hostinger Setup**: Website als **Node.js** App unter dem Subdomain `api.shipnex24.com` anlegen.
2. **Environment**: Alle Variablen aus der `.env` im hPanel unter "Environment Variables" eintragen.
3. **Entry Point**: `server.js`.

## 2. Dashboard Deployment (login.shipnex24.com)
Das Dashboard ist eine React-App und wird "gebuildet", bevor es hochgeladen wird.
1. **Build lokal erstellen**:
   ```bash
   cd dashboard
   npm run build
   ```
2. **Upload**: Den Inhalt des neu erstellten `dashboard/dist` Ordners per FTP/File Manager in das Verzeichnis von `login.shipnex24.com` (meist `public_html`) hochladen.
3. **.htaccess**: Sicherstellen, dass die `.htaccess` Datei vorhanden ist, damit React-Routing funktioniert.

## 3. Verlinkung
- In der Hauptseite (WordPress) verlinkst du den Login-Button auf `https://login.shipnex24.com/login`.
- Im Dashboard sind die API-Requests bereits auf `api.shipnex24.com` gerichtet.

---

## Nächste Schritte
1. [ ] Subdomains im Hostinger hPanel anlegen.
2. [ ] Backend-Dateien hochladen.
3. [ ] Dashboard builden und hochladen.
