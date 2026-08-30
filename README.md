# Personal Portfolio — Azure Launchpad

A personal portfolio site with a static frontend and a small API backend,
built for the "Azure Portfolio Launchpad" assignment.

```
portfolio/
├── frontend/          → deploy to Azure Static Web Apps
│   ├── index.html      (profile, education, skills, projects, resume, contact)
│   ├── style.css
│   └── script.js        (calls the backend API; falls back to static content if unreachable)
├── backend/           → deploy to Azure App Service
│   ├── server.js        (Express API: /api/profile, /skills, /projects, /contact, /health)
│   └── package.json
├── DEPLOYMENT_GUIDE.md → step-by-step Azure deployment instructions
└── README.md
```

## Before deploying — personalize it

1. **frontend/index.html** — replace the placeholder name (Jordan Reyes),
   tagline, education timeline, contact details, and add your own `resume.pdf`
   into the `frontend/` folder.
2. **backend/server.js** — update the `profile`, `skills`, and `projects`
   arrays with your real information.
3. **frontend/script.js** — after deploying the backend, update `API_BASE`
   with your real Azure App Service URL.

## Run it locally first (recommended)

```bash
# Terminal 1 — backend
cd backend
npm install
npm start          # http://localhost:3000

# Terminal 2 — frontend
cd frontend
npx serve .         # or just open index.html in a browser
```

The frontend auto-detects `localhost` and points at `http://localhost:3000/api`,
so both pieces talk to each other with no config changes needed locally.

## Deploying to Azure

See **DEPLOYMENT_GUIDE.md** for the full walkthrough (Azure for Students
account → App Service for the backend → Static Web Apps for the frontend).
