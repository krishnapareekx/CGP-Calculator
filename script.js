// =============================================
//   CGPA CALCULATOR - script.js
//   by Krishna
// =============================================

// ── Grade Data ──
const GRADES = [
  { grade: "O",  label: "Outstanding", points: 10, color: "#16a34a", border: "#bbf7d0", bg: "#f0fdf4" },
  { grade: "A+", label: "Excellent",   points: 9,  color: "#0d9488", border: "#99f6e4", bg: "#f0fdfa" },
  { grade: "A",  label: "Very Good",   points: 8,  color: "#0891b2", border: "#a5f3fc", bg: "#ecfeff" },
  { grade: "B+", label: "Good",        points: 7,  color: "#2563eb", border: "#bfdbfe", bg: "#eff6ff" },
  { grade: "B",  label: "Above Avg",   points: 6,  color: "#7c3aed", border: "#ddd6fe", bg: "#f5f3ff" },
  { grade: "C",  label: "Average",     points: 5,  color: "#9333ea", border: "#e9d5ff", bg: "#faf5ff" },
  { grade: "P",  label: "Pass",        points: 4,  color: "#b45309", border: "#fde68a", bg: "#fffbeb" },
  { grade: "F",  label: "Fail",        points: 0,  color: "#dc2626", border: "#fecaca", bg: "#fef2f2" },
];

// ── State ──
let subjects = [
  { id: 1, name: "Subject 1", credits: 3, grade: "O"  },
  { id: 2, name: "Subject 2", credits: 4, grade: "A+" },
];
let nextId = 3;

// ── Helpers ──
function getGrade(g) {
  return GRADES.find((x) => x.grade === g) || GRADES[GRADES.length - 1];
}

function getCGPALabel(cgpa) {
  if (cgpa >= 9)  return { label: "Outstanding 🏆", color: "#16a34a" };
  if (cgpa >= 8)  return { label: "Excellent ⭐",   color: "#0d9488" };
  if (cgpa >= 7)  return { label: "Very Good 👍",   color: "#0891b2" };
  if (cgpa >= 6)  return { label: "Good 😊",        color: "#2563eb" };
  if (cgpa >= 5)  return { label: "Above Average 📚", color: "#7c3aed" };
  if (cgpa >= 4)  return { label: "Average 🙂",     color: "#9333ea" };
  if (cgpa > 0)   return { label: "Pass ✅",        color: "#b45309" };
  return            { label: "Fail ❌",             color: "#dc2626" };
}

// ── Add Subject ──
function addSubject() {
  subjects.push({
    id: nextId++,
    name: "Subject " + subjects.length + 1,
    credits: 3,
    grade: "A",
  });
  render();
}

// ── Remove Subject ──
function removeSubject(id) {
  subjects = subjects.filter((s) => s.id !== id);
  render();
}

// ── Update Credits ──
function changeCredits(id, delta) {
  subjects = subjects.map((s) => {
    if (s.id === id) {
      const newCredits = Math.min(10, Math.max(1, s.credits + delta));
      return { ...s, credits: newCredits };
    }
    return s;
  });
  render();
}

function setCredits(id, val) {
  const v = Math.min(10, Math.max(1, parseInt(val) || 1));
  subjects = subjects.map((s) => (s.id === id ? { ...s, credits: v } : s));
  render();
}

// ── Update Grade ──
function setGrade(id, val) {
  subjects = subjects.map((s) => (s.id === id ? { ...s, grade: val } : s));
  render();
}

// ── Inline Name Editing ──
function startEditName(id) {
  const el = document.getElementById("name-text-" + id);
  const input = document.getElementById("name-input-" + id);
  if (el && input) {
    el.style.display = "none";
    input.style.display = "flex";
    input.focus();
    input.select();
  }
}

function finishEditName(id) {
  const el = document.getElementById("name-text-" + id);
  const input = document.getElementById("name-input-" + id);
  if (el && input) {
    const newName = input.value.trim() || "Subject";
    subjects = subjects.map((s) => (s.id === id ? { ...s, name: newName } : s));
    el.style.display = "flex";
    input.style.display = "none";
    // update displayed name without full re-render
    const nameSpan = el.querySelector(".name-val");
    if (nameSpan) nameSpan.textContent = newName;
  }
}

function handleNameKey(event, id) {
  if (event.key === "Enter") finishEditName(id);
}

// ── Reset All ──
function resetAll() {
  subjects = [];
  render();
}

// ── CGPA Ring ──
function updateRing(cgpa) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius; // ~439.82
  const offset = circumference - (cgpa / 10) * circumference;
  const ring = document.getElementById("cgpa-ring");
  const valText = document.getElementById("cgpa-value");
  if (ring) ring.setAttribute("stroke-dashoffset", offset.toFixed(2));
  if (valText) valText.textContent = cgpa.toFixed(2);
}

// ── Build Subject Row HTML ──
function buildSubjectRow(subject, idx) {
  const g = getGrade(subject.grade);

  // Grade options
  let options = GRADES.map((gx) =>
    `<option value="${gx.grade}" ${gx.grade === subject.grade ? "selected" : ""}>
      ${gx.grade} — ${gx.points} pts
    </option>`
  ).join("");

  return `
    <div class="subject-row" id="row-${subject.id}"
      style="border-left-color:${g.color}; box-shadow: 0 2px 10px ${g.color}18;">

      <!-- Number Badge -->
      <div class="subject-num"
        style="background: linear-gradient(135deg, ${g.color}, #6366f1);">
        ${idx + 1}
      </div>

      <!-- Name (display) -->
      <div class="subject-name-text" id="name-text-${subject.id}"
        onclick="startEditName(${subject.id})" title="Click to edit name">
        <span class="name-val">${subject.name}</span>
        <span class="edit-icon">✏️</span>
      </div>

      <!-- Name (input) -->
      <input class="subject-name-input" id="name-input-${subject.id}"
        style="display:none;"
        value="${subject.name}"
        onblur="finishEditName(${subject.id})"
        onkeydown="handleNameKey(event, ${subject.id})"
      />

      <!-- Credits -->
      <div class="credits-wrap">
        <span class="credit-label">Credits:</span>
        <div class="credit-controls">
          <button class="btn-circle" onclick="changeCredits(${subject.id}, -1)">−</button>
          <input class="credit-input" type="number" min="1" max="10"
            value="${subject.credits}"
            onchange="setCredits(${subject.id}, this.value)"
            oninput="setCredits(${subject.id}, this.value)"
          />
          <button class="btn-circle" onclick="changeCredits(${subject.id}, 1)">+</button>
        </div>
      </div>

      <!-- Grade -->
      <div class="grade-wrap">
        <span class="grade-label">Grade:</span>
        <select class="grade-select" id="grade-sel-${subject.id}"
          onchange="setGrade(${subject.id}, this.value)"
          style="border-color:${g.color}; color:${g.color};">
          ${options}
        </select>
      </div>

      <!-- Points Badge -->
      <div class="pts-badge" id="pts-badge-${subject.id}"
        style="background:${g.color};">
        ${g.points} pts
      </div>

      <!-- Delete -->
      <button class="btn-delete" onclick="removeSubject(${subject.id})" title="Remove subject">
        🗑️
      </button>
    </div>
  `;
}

// ── Main Render ──
function render() {
  const list = document.getElementById("subjects-list");
  const emptyMsg = document.getElementById("empty-msg");
  const addAnotherBtn = document.getElementById("add-another-btn");

  // Build subject rows
  if (subjects.length === 0) {
    list.innerHTML = "";
    emptyMsg.style.display = "block";
    addAnotherBtn.style.display = "none";
  } else {
    emptyMsg.style.display = "none";
    addAnotherBtn.style.display = "block";
    list.innerHTML = subjects.map((s, i) => buildSubjectRow(s, i)).join("");
  }

  // Calculate CGPA
  const totalCredits  = subjects.reduce((sum, s) => sum + s.credits, 0);
  const totalWeighted = subjects.reduce((sum, s) => sum + s.credits * getGrade(s.grade).points, 0);
  const cgpa          = totalCredits > 0 ? totalWeighted / totalCredits : 0;

  // Update ring
  updateRing(cgpa);

  // Update stats
  document.getElementById("stat-subjects").textContent  = subjects.length;
  document.getElementById("stat-credits").textContent   = totalCredits;
  document.getElementById("stat-weighted").textContent  = totalWeighted;

  // Update label
  const labelBox  = document.getElementById("cgpa-label-box");
  const labelText = document.getElementById("cgpa-label-text");

  if (subjects.length === 0) {
    labelBox.style.background  = "#f0f9ff";
    labelBox.style.borderColor = "#bae6fd";
    labelText.style.color      = "#94a3b8";
    labelText.textContent      = "Add subjects to calculate ➕";
  } else {
    const info = getCGPALabel(cgpa);
    labelBox.style.background  = info.color + "18";
    labelBox.style.borderColor = info.color + "40";
    labelText.style.color      = info.color;
    labelText.textContent      = info.label;
  }

  // Grade Distribution
  const distSection = document.getElementById("grade-dist-section");
  const distGrid    = document.getElementById("grade-dist");

  if (subjects.length === 0) {
    distSection.style.display = "none";
  } else {
    distSection.style.display = "block";
    const usedGrades = GRADES.filter((g) => subjects.some((s) => s.grade === g.grade));
    distGrid.innerHTML = usedGrades.map((g) => {
      const count = subjects.filter((s) => s.grade === g.grade).length;
      return `
        <div class="dist-item" style="background:${g.bg}; border-color:${g.border};">
          <span class="dist-grade" style="color:${g.color};">${g.grade}</span>
          <span class="dist-count" style="background:${g.color};">${count}</span>
        </div>
      `;
    }).join("");
  }
}

// ── Initial Render ──
render();
