# Adithya Tej BM — Cloud & Data Portfolio

A personal portfolio website built to demonstrate cloud deployment, backend API development, data analytics, and DevOps practices.

## 🌐 Live Portfolio

https://lively-sea-08cf84600.7.azurestaticapps.net

---

## 🏗️ Architecture

The application uses a two-tier cloud architecture:

```text
                    ┌─────────────────────────┐
                    │     User / Browser      │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ Azure Static Web Apps   │
                    │                         │
                    │ HTML / CSS / JavaScript │
                    └────────────┬────────────┘
                                 │ HTTPS / REST API
                                 ▼
                    ┌─────────────────────────┐
                    │    Azure App Service    │
                    │                         │
                    │ Node.js + Express API   │
                    └────────────┬────────────┘
                                 │
                       ┌─────────┴─────────┐
                       ▼                   ▼
                ┌─────────────┐     ┌─────────────┐
                │   Gmail     │     │ App Service │
                │ SMTP /      │     │ Logs &      │
                │ Nodemailer  │     │ Monitoring  │
                └─────────────┘     └─────────────┘