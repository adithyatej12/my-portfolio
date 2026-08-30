# Deploying Your Portfolio to Azure (CA1 – Activity 1)

This guide walks through everything the assignment asks for: creating an
Azure account, deploying the **frontend** (Azure Static Web Apps) and the
**backend** (Azure App Service), and making both publicly accessible.

Total time: ~30–45 minutes.

---

## 0. Before you start

1. Put **your own** details into the project:
   - `frontend/index.html` — name, tagline, education, contact links.
   - `backend/server.js` — the `profile`, `skills`, and `projects` arrays.
   - Add a real `resume.pdf` file into `frontend/` (the "Resume" button links to it).
2. Push this whole `portfolio/` folder to a **new GitHub repository** (public or private, both work).
   ```bash
   cd portfolio
   git init
   git add .
   git commit -m "Initial portfolio"
   gh repo create my-portfolio --public --source=. --push
   # or create the repo on github.com and follow its "push an existing repo" instructions
   ```

---

## 1. Create your Azure account

1. Go to **https://azure.microsoft.com/free/students/** and sign up with your
   college email (Azure for Students gives ~$100 credit, no credit card needed).
   If you're not eligible, use the general **https://azure.microsoft.com/free/** trial instead.
2. Verify your email and sign in to **https://portal.azure.com**.

---

## 2. Deploy the backend first (Azure App Service)

The frontend calls the backend, so deploy the API first and note its URL.

1. In the Azure Portal, click **Create a resource → Web App**.
2. Fill in the basics:
   - **Resource Group**: create new, e.g. `rg-portfolio`
   - **Name**: something unique, e.g. `app-yourname-portfolio-api` (this becomes `https://app-yourname-portfolio-api.azurewebsites.net`)
   - **Publish**: Code
   - **Runtime stack**: Node 18 LTS (or newer)
   - **Operating System**: Linux
   - **Region**: pick the one closest to you (e.g. Central India)
   - **Pricing plan**: Free F1 (fine for a class project)
3. Click **Review + create → Create**. Wait for deployment to finish, then **Go to resource**.
4. Set up continuous deployment from GitHub:
   - In the Web App's left menu, open **Deployment → Deployment Center**.
   - Source: **GitHub** → authorize → pick your repo and branch.
   - **Build provider**: GitHub Actions.
   - If your repo has both `frontend/` and `backend/` folders, edit the generated
     workflow (`.github/workflows/...yml`) so the build/deploy steps use the
     `backend` folder as the app path (or simplest: put `server.js` and
     `package.json` at the repo root if you don't need the folder split).
   - Save. This triggers a build; wait for it to go green in the **Actions** tab of your GitHub repo.
5. Set the CORS environment variable so only your frontend can call the API:
   - In the Web App, go to **Settings → Environment variables → App settings**.
   - Add `ALLOWED_ORIGIN` = your future Static Web App URL (you'll fill this in
     after step 3 — you can leave it as `*` for now and tighten it later).
6. Test it: visit `https://<your-app-name>.azurewebsites.net/api/health` in a
   browser. You should see a JSON response like `{"status":"ok",...}`.

---

## 3. Deploy the frontend (Azure Static Web Apps)

1. In `frontend/script.js`, change:
   ```js
   : "https://YOUR-BACKEND-APP-NAME.azurewebsites.net/api";
   ```
   to your actual backend URL from step 2, then commit and push the change.
2. In the Azure Portal, click **Create a resource → Static Web App**.
3. Fill in the basics:
   - **Resource Group**: reuse `rg-portfolio`
   - **Name**: e.g. `swa-yourname-portfolio`
   - **Plan type**: Free
   - **Deployment details**: source = GitHub → authorize → select your repo/branch
   - **Build details**:
     - Build preset: Custom
     - **App location**: `/frontend`
     - **Api location**: leave blank (we deployed the API separately in App Service)
     - **Output location**: leave blank (static HTML/CSS/JS needs no build step)
4. Click **Review + create → Create**. Azure automatically adds a GitHub
   Actions workflow to your repo and deploys on every push.
5. Once the Actions run finishes, open the URL shown on the Static Web App's
   **Overview** page — that's your public portfolio link.
6. Go back to your **App Service** (backend) → **Environment variables** and
   set `ALLOWED_ORIGIN` to this Static Web App URL exactly (including `https://`),
   then restart the Web App so CORS is locked down properly.

---

## 4. Verify everything end-to-end

- Open your Static Web App URL in a private/incognito window.
- Check the small status pill in the top-right of the nav bar — it should say
  **"api online · azure-app-service"** once both are live.
- Scroll to **Skills** and **Projects** — if the API is reachable, these load
  from the backend; otherwise they silently fall back to the static content
  already in `index.html` (so the site never looks broken).
- Submit the contact form and confirm you see "Message sent."

---

## 5. What to submit

- Your GitHub repo link.
- The public Static Web App URL (frontend).
- The public App Service URL (backend), e.g. `.../api/health`.
- A short screenshot of the Azure Portal showing both resources running.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Frontend loads but skills/projects never change from defaults | `API_BASE` in `script.js` still points at `localhost` or the placeholder URL |
| Browser console shows a CORS error | `ALLOWED_ORIGIN` on the backend doesn't exactly match the frontend URL (check trailing slashes / http vs https) |
| GitHub Actions workflow fails on build | Wrong **App location** / **Api location** paths in the Static Web App config, or missing `package.json` in `backend/` |
| App Service shows "Application Error" | Check **Log stream** under the Web App's **Monitoring** section; usually a missing `npm install` step or wrong start command (`node server.js`) |
