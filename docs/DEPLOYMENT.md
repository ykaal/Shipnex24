# Deployment Guide (Subdomain Strategy)

Die beste Lösung für ShipNex24 ist eine saubere Trennung der Bereiche. Das ist sicher, professionell und einfach zu skalieren.

## Ziel-Architektur
- **`shipnex24.com`**: Deine Hauptseite (WordPress/Landingpage).
- **`api.shipnex24.com`**: Das Backend (Node.js Server).
- **`login.shipnex24.com`**: Das Kunden-Dashboard (React App).

---

## 2. Jede Subdomain als eigene "Webseite" anlegen
Da du jetzt für `login.shipnex24.com` ein eigenes Projekt im hPanel siehst, hast du Schritt 1 für das Dashboard fast fertig.

**WICHTIG:** Du musst diesen Vorgang für `api.shipnex24.com` exakt so wiederholen.

### Aktion für `login.shipnex24.com`:
1. Klicke im hPanel bei der Webseite `login.shipnex24.com` auf **"Verwalten"**.
2. Scrolle runter zu **Erweitert -> Git**.
3. Repository URL: `https://github.com/ykaal/Shipnex24.git`
4. Zweig (Branch): `main`
5. Klicke auf **"Installieren"** (oder Deploy). 
   *(Da ich die Dashboard-Dateien direkt in den Hauptordner geschoben habe, wird Hostinger sie jetzt finden).*

### Aktion für `api.shipnex24.com`:
1. Erstelle eine **zweite neue Webseite** im hPanel für `api.shipnex24.com`.
2. Verbinde sie ebenfalls mit dem gleichen GitHub-Repo.
3. Gehe bei diesem Projekt auf **Node.js** (falls verfügbar/nötig) und setze `server.js` als Startdatei.

---

## 2. Backend Deployment (api.shipnex24.com)
1. **Hostinger Setup**: Die eben erstellte Webseite `api.shipnex24.com` als **Node.js** App konfigurieren.

## 2. Dashboard Deployment (login.shipnex24.com)
Das Dashboard ist eine React-App und wird "gebuildet", bevor es hochgeladen wird.
1. **Build lokal erstellen**:
   ```bash
   cd dashboard
   npm run build
   ```
2. **Upload**: Den Inhalt des neu erstellten `dashboard/dist` Ordners per FTP/File Manager in das Verzeichnis von `login.shipnex24.com` (meist `public_html`) hochladen.
3. **.htaccess**: Sicherstellen, dass die `.htaccess` Datei vorhanden ist, damit React-Routing funktioniert.

## 3. SSL Aktivierung (WICHTIG)
Der Fehler `ERR_SSL_PROTOCOL_ERROR` bedeutet, dass das SSL-Zertifikat noch nicht aktiv ist.
1. Im Hostinger hPanel nach **"SSL"** suchen.
2. Prüfen, ob für `login.shipnex24.com` und `api.shipnex24.com` ein Zertifikat installiert ist.
3. Falls nicht: Auf **"Install SSL"** klicken und die Subdomains auswählen. (Hostinger bietet oft kostenlose Let's Encrypt Zertifikate an).
4. **Wichtig**: Es kann einige Minuten dauern, bis das Zertifikat nach der Installation aktiv ist.

## 4. Verlinkung
- In der Hauptseite (WordPress) verlinkst du den Login-Button auf `https://login.shipnex24.com/login`.
- Im Dashboard sind die API-Requests bereits auf `api.shipnex24.com` gerichtet.

---

## Nächste Schritte
1. [x] Subdomains im Hostinger hPanel anlegen.
2. [ ] SSL für beide Subdomains aktivieren.
3. [ ] Backend-Dateien hochladen.
4. [ ] Dashboard builden und hochladen.
