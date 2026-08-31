// ---------------------------------------------------------------------
// Point this at your deployed backend once you have it (see DEPLOYMENT_GUIDE.md).
// While developing locally with `node server.js`, the default below works as-is.
// ---------------------------------------------------------------------
const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:3000/api"
  : "https://adithya-portfolio-api-2026-g6h7dudyc0gaevg7.centralindia-01.azurewebsites.net/api";// <-- replace after deploying App Service

const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");
const typingLine = document.getElementById("typingLine");

async function checkApiHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { cache: "no-store" });
    if (!res.ok) throw new Error("bad response");
    const data = await res.json();
    statusDot.classList.add("live");
    statusText.textContent = `api online · ${data.region || "unknown region"}`;
    if (typingLine) typingLine.textContent = "connected";
  } catch (err) {
    statusDot.classList.add("building");
    statusText.textContent = "api offline (edit API_BASE)";
    if (typingLine) typingLine.textContent = "waiting for API_BASE";
  }
}

async function loadProjects() {
  try {
    const res = await fetch(`${API_BASE}/projects`, { cache: "no-store" });
    if (!res.ok) throw new Error("bad response");
    const projects = await res.json();
    if (!Array.isArray(projects) || projects.length === 0) return;

    const grid = document.getElementById("projectsGrid");
    grid.innerHTML = projects.map(p => `
      <article class="project-card">
        <div class="project-status">
          <span class="status-dot ${p.status === "live" ? "live" : "building"}"></span>${p.status || "live"}
        </div>
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.description)}</p>
        <div class="chip-row">
          ${(p.tags || []).map(t => `<span class="chip">${escapeHtml(t)}</span>`).join("")}
        </div>
        <div class="project-links">
          ${p.demoUrl ? `<a class="link" href="${p.demoUrl}" target="_blank" rel="noopener">Live demo →</a>` : ""}
          ${p.repoUrl ? `<a class="link" href="${p.repoUrl}" target="_blank" rel="noopener">Source →</a>` : ""}
        </div>
      </article>
    `).join("");
  } catch (err) {
    // Keep the static fallback markup already in index.html — nothing to do.
    console.info("Using static fallback project data (API not reachable yet).");
  }
}

async function loadSkills() {
  try {
    const res = await fetch(`${API_BASE}/skills`, { cache: "no-store" });
    if (!res.ok) throw new Error("bad response");
    const skills = await res.json();
    if (!Array.isArray(skills) || skills.length === 0) return;

    const grid = document.getElementById("skillsGrid");
    grid.innerHTML = skills.map(s => `
      <div class="skill-card">
        <div class="skill-head"><span>${escapeHtml(s.name)}</span><span class="skill-pct">${s.level}%</span></div>
        <div class="skill-bar"><div class="skill-fill" style="width:${s.level}%"></div></div>
      </div>
    `).join("");
  } catch (err) {
    console.info("Using static fallback skill data (API not reachable yet).");
  }
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// ---------------------------------------------------------------------
// Contact form
// ---------------------------------------------------------------------
const form = document.getElementById("contactForm");
const submitBtn = document.getElementById("contactSubmit");
const formStatus = document.getElementById("formStatus");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  formStatus.classList.remove("error");
  formStatus.textContent = "";

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim(),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";

  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Request failed");
    formStatus.textContent = "Message sent — thanks! I'll reply by email.";
    form.reset();
  } catch (err) {
    formStatus.classList.add("error");
    formStatus.textContent = "Couldn't reach the API. Check API_BASE in script.js and that the backend is deployed.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send message";
  }
});

checkApiHealth();
loadProjects();
loadSkills();
