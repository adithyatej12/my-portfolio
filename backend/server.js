// Simple portfolio backend API — Express on Node.js
// Deployed on Azure App Service.

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// Azure App Service runs behind a reverse proxy.
// Trust the first proxy so express-rate-limit can identify clients correctly.
app.set("trust proxy", 1);

const PORT = process.env.PORT || 3000;

// ---------------------------------------------------------------------
// Security
// ---------------------------------------------------------------------

app.use(helmet());

const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

app.use(
  cors({
    origin: allowedOrigin
  })
);

app.use(
  express.json({
    limit: "10kb"
  })
);

// ---------------------------------------------------------------------
// Rate limiting
// ---------------------------------------------------------------------

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many contact requests. Please try again later."
  }
});

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
  { name: "Python (Pandas, NumPy, Scikit-learn)", level: 85 },
  { name: "SQL (MySQL)", level: 80 },
  { name: "Tableau / Power BI", level: 80 },
  { name: "Machine Learning", level: 75 },
  { name: "Excel (Advanced) / Dashboards", level: 75 },
  { name: "Databricks / ETL Pipelines", level: 70 },
  { name: "R", level: 65 },
  { name: "AWS / Azure / GCP", level: 60 },
  { name: "MongoDB", level: 55 }
];

// ---------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------

const projects = [
  {
    title: "Dhanalakshmi Jewellery",
    description:
      "Full-stack jewellery e-commerce app — React storefront, Spring Boot API, JWT authentication with BCrypt, email-OTP verification, and MySQL.",
    tags: ["React", "Spring Boot", "MySQL"],
    status: "live",
    demoUrl: "",
    repoUrl: "https://github.com/adithyatej12/dhanalakshmi-jewellery"
  },
  {
    title: "Microservices Modernization on AWS",
    description:
      "Migrated a monolith to microservices on AWS — Docker images on ECR, ECS Fargate behind an Application Load Balancer, RDS MySQL, with CodePipeline/CodeDeploy CI/CD.",
    tags: ["Docker", "AWS", "CI/CD"],
    status: "live",
    demoUrl: "",
    repoUrl: "https://github.com/adithyatej12/microservices-modernization-aws"
  },
  {
    title: "Cloud Analytics Lab",
    description:
      "Azure data-engineering lab — Data Factory pipelines, Blob Storage, ADLS Gen2, Synapse Dedicated SQL Pool, and serverless SQL analytics.",
    tags: ["Azure", "Data Factory", "Synapse"],
    status: "live",
    demoUrl: "",
    repoUrl: "https://github.com/adithyatej12/Cloud-Analytics-Lab"
  },
  {
    title: "Portfolio Website",
    description:
      "This site — static frontend on Azure Static Web Apps backed by a Node.js/Express API on Azure App Service, deployed with GitHub Actions.",
    tags: ["JavaScript", "Azure", "Node.js"],
    status: "live",
    demoUrl: "",
    repoUrl: "https://github.com/adithyatej12/my-portfolio"
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
// Email configuration
// ---------------------------------------------------------------------

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// ---------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    region: process.env.WEBSITE_SITE_NAME
      ? "azure-app-service"
      : "local",
    time: new Date().toISOString()
  });
});

app.get("/api/profile", (req, res) => {
  res.json(profile);
});

app.get("/api/skills", (req, res) => {
  res.json(skills);
});

app.get("/api/projects", (req, res) => {
  res.json(projects);
});

app.get("/api/experience", (req, res) => {
  res.json(experience);
});

// ---------------------------------------------------------------------
// Contact form
// ---------------------------------------------------------------------

app.post("/api/contact", contactLimiter, async (req, res) => {
  const { name, email, message } = req.body || {};

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return res.status(400).json({
      error: "Name, email and message are required."
    });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanMessage = message.trim();

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return res.status(400).json({
      error: "Name, email and message cannot be empty."
    });
  }

  if (cleanName.length > 100) {
    return res.status(400).json({
      error: "Name is too long."
    });
  }

  if (cleanEmail.length > 254) {
    return res.status(400).json({
      error: "Email address is too long."
    });
  }

  if (cleanMessage.length > 2000) {
    return res.status(400).json({
      error: "Message is too long."
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({
      error: "That email address doesn't look valid."
    });
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: cleanEmail,
      subject: `Portfolio Contact: ${cleanName}`,
      text: `Name: ${cleanName}

Email: ${cleanEmail}

Message:
${cleanMessage}`
    });

    console.log(`Contact email sent from ${cleanEmail}`);

    res.status(201).json({
      ok: true
    });
  } catch (error) {
    console.error("Email sending failed:", error);

    res.status(500).json({
      error: "Unable to send your message right now. Please try again later."
    });
  }
});

// ---------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Portfolio API listening on port ${PORT}`);
});