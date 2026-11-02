# Deploying ToolKenzon to Hostinger

## Option A — Node.js Web App (recommended, auto-deploy from GitHub)

Requires a Hostinger plan with **Node.js Web Apps** (Business or Cloud hosting).

1. Push this project to a GitHub repository (see below).
2. hPanel → **Websites** → **Add Website** → **Node.js Web App**.
3. **Import Git repository** → **Connect with GitHub** → allow access to the repo.
4. Build settings (Hostinger usually detects these; framework = *Express/Other*):
   - Node version: **20** or **22**
   - Install command: `npm install` (there are no dependencies — this is instant)
   - Build command: *(leave empty)*
   - Start command: `npm start`  ·  Entry file: `server.js`
5. Environment variables (optional):
   - `NODE_ENV=production` (enables page caching)
   - `SITE_URL=https://toolkenzon.com`
   - `GA_ID=G-XXXXXXX` (Google Analytics 4)
6. Click **Deploy**, then connect the domain **toolkenzon.com** in the website's dashboard and enable SSL.

Every `git push` to the connected branch redeploys automatically.

> Note: files in `storage/` (newsletter/contact submissions) may be reset on redeploy. Connect the newsletter form to your email platform's API for permanent storage.

## Option B — Static site on any shared hosting plan

1. Run `npm run build` → creates `dist/`.
2. hPanel → **File Manager** → `public_html` → upload the **contents** of `dist/` (including `.htaccess`).
3. Pages, reviews, comparisons and redirects all work. The newsletter/contact forms need Option A, or swap them for a form service.

## Pushing to GitHub

```bash
git remote add origin https://github.com/<your-username>/toolnexa.git
git push -u origin main
```

## After launch

- Submit `https://toolkenzon.com/sitemap.xml` in Google Search Console.
- Replace official URLs with your affiliate links in `src/data/tools.js` (`affiliateUrl`).
- Re-check prices monthly and update `PRICING_CHECKED`.
