// Simple portfolio backend API — Express on Node.js
// Designed to deploy as-is to Azure App Service (Linux, Node runtime).

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------

const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

app.use(cors({
  origin: allowedOrigin
}));

app.use(express.json());

// ---------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------

const profile = {
  name: "Adithya Tej BM",
  tagline: "Data & Cloud Analytics",
  location: "Bengaluru, India",
  email: "adithyatej2002@gmail.com",
  phone: "+91-8150894596"
};

// ---------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------

const skills = [
  {
    name: "Python (Pandas, NumPy, Scikit-learn)",
    level: 85
  },
  {
    name: "SQL (MySQL)",
    level: 80
  },
  {
    name: "Tableau / Power BI",
    level: 80
  },
  {
    name: "Machine Learning",
    level: 75
  },
  {
    name: "Excel (Advanced) / Dashboards",
    level: 75
  },
  {
    name: "Databricks / ETL Pipelines",
    level: 70
  },
  {
    name: "R",
    level: 65
  },
  {
    name: "AWS / Azure / GCP",
    level: 60
  },
  {
    name: "MongoDB",
    level: 55
  }
];

// ---------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------

const projects = [
  {
    title: "Deep Reinforcement Learning for Board Games",
    description:
      "Implementing DRL algorithms with PyTorch to train agents that play classic board games.",
    tags: ["Python", "PyTorch", "Deep Learning"],
    status: "building",
    demoUrl: "",
    repoUrl: ""
  },
  {
    title: "Pneumonia Detection using Machine Learning",
    description:
      "Built a pneumonia detection model on chest X-ray imaging data, with preprocessing, normalization, and dataset splitting to improve prediction quality.",
    tags: ["Python", "Deep Learning", "Medical Imaging"],
    status: "live",
    demoUrl: "",
    repoUrl: ""
  },
  {
    title: "Product Analytics Dashboard",
    description:
      "Interactive Power BI dashboard merging multi-year sales and customer datasets, tracking Sales Achievement, Profitability, Average Discount, and Order Metrics.",
    tags: ["Power BI", "Data Modeling"],
    status: "live",
    demoUrl: "",
    repoUrl: ""
  },
  {
    title: "Resume Checker",
    description:
      "Desktop Java Swing app that parses and evaluates resume content against defined criteria and returns feedback.",
    tags: ["Java", "Java Swing", "OOP"],
    status: "live",
    demoUrl: "",
    repoUrl: ""
  }
];

// ---------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------

const experience = [
  {
    role: "HR Analytics Intern",
    company: "IIFL Samasta Finance Limited",
    period: "Apr 2026 — Aug 2026",
    highlights: [
      "Managed AON assessment credentials and coordinated candidate testing logistics for hiring processes",
      "Conducted daily retention bot calling to support employee retention tracking and analysis",
      "Consolidated daily hiring trackers using VBA-based VLOOKUP/XLOOKUP automation for streamlined reporting"
    ]
  },
  {
    role: "HR Operations Intern",
    company: "UNO Minda Limited",
    period: "Jun 2023 — Jul 2023",
    highlights: [
      "Maintained HR databases and employee records, ensuring data accuracy and integrity across systems",
      "Prepared HR analytics reports by collecting, cleaning, and analysing workforce data for stakeholder insights",
      "Streamlined onboarding and exit documentation workflows; assisted in recruitment screening processes"
    ]
  }
];

// ---------------------------------------------------------------------
// Contact messages
// ---------------------------------------------------------------------

const messages = [];

// ---------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    region: process.env.WEBSITE_SITE_NAME
      ? "azure-app-service"
      : "local",
    time: new Date().toISOString()
  });
});

// Profile
app.get("/api/profile", (req, res) => {
  res.json(profile);
});

// Skills
app.get("/api/skills", (req, res) => {
  res.json(skills);
});

// Projects
app.get("/api/projects", (req, res) => {
  res.json(projects);
});

// Experience
app.get("/api/experience", (req, res) => {
  res.json(experience);
});

// Contact form
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      error: "name, email, and message are all required."
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      error: "That email address doesn't look valid."
    });
  }

  const entry = {
    name,
    email,
    message,
    receivedAt: new Date().toISOString()
  };

  messages.push(entry);

  console.log("New contact message:", entry);

  res.status(201).json({
    ok: true
  });
});

// ---------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Portfolio API listening on port ${PORT}`);
});