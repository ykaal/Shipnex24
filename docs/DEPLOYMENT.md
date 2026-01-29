# Deployment Guide

## 1. Hostinger Setup
1. Go to **hPanel > Websites > Add Website**.
2. Select **Node.js** as the platform.
3. Configure settings:
   - **Node Version**: 18.x
   - **Application Entry**: `server.js`
   - **Domain**: `api.shipnex24.com` (or your subdomain)

## 2. Environment Variables
In hPanel, find **Environment Variables** and add content from `.env.example`:
- `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `INTERNAL_API_SECRET`
- SMTP credentials

## 3. Deploy Code
1. SSH into your Hostinger instance.
2. Clone repo:
   ```bash
   git clone https://github.com/ykaal/Shipnex24.git ./backend_app
   ```
3. Install & Build:
   ```bash
   cd backend_app
   npm install --production
   ```
4. Start (hPanel handles restart):
   ```bash
   npm start
   ```

## 4. Stripe Webhook
- URL: `https://api.shipnex24.com/api/webhooks/stripe`
- Events: `checkout.session.completed`

## 5. Cron Jobs
- Setup cron in hPanel or rely on built-in cron (if process stays alive).
- Command: `curl -X POST https://api.shipnex24.com/api/internal/maintenance -H "x-internal-secret: ..."` (Optional alternative)
