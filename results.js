
const noResults = document.getElementById("no-results");
const resultsContent = document.getElementById("results-content");

function readAssessmentAnswers() {
  // Answers are passed temporarily through the navigation URL.
  // No localStorage or sessionStorage is used.
  const params = new URLSearchParams(window.location.search);

  if (!params.has("career")) {
    return null;
  }

  const answers = {};

  for (const [key, value] of params.entries()) {
    if (key === "skills") {
      if (!answers.skills) answers.skills = [];
      answers.skills.push(value);
    } else {
      answers[key] = value;
    }
  }

  return answers;
}

function addSkillTags(container, skills, emptyMessage) {
  container.replaceChildren();

  if (!skills.length) {
    const empty = document.createElement("p");
    empty.className = "empty-message";
    empty.textContent = emptyMessage;
    container.appendChild(empty);
    return;
  }

  skills.forEach(skill => {
    const tag = document.createElement("span");
    tag.className = "skill-tag";
    tag.textContent = skill;
    container.appendChild(tag);
  });
}

function renderRecommendations(recommendations) {
  const container = document.getElementById("recommendations");
  container.replaceChildren();

  if (!recommendations.length) {
    const message = document.createElement("p");
    message.textContent = "Keep practicing and build projects to strengthen your profile.";
    container.appendChild(message);
    return;
  }

  recommendations.forEach((recommendation, index) => {
    const article = document.createElement("article");
    article.className = "recommendation-card";

    const number = document.createElement("span");
    number.className = "recommendation-number";
    number.textContent = String(index + 1).padStart(2, "0");

    const content = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = recommendation.skill;

    const description = document.createElement("p");
    description.textContent = recommendation.action;

    content.append(title, description);
    article.append(number, content);
    container.appendChild(article);
  });
}

function renderScoreBreakdown(breakdown) {
  const container = document.getElementById("score-breakdown");
  container.replaceChildren();

  const categories = [
    { key: "skills", label: "Career-specific skills", max: 40 },
    { key: "experience", label: "Projects and experience", max: 20 },
    { key: "education", label: "Education and learning", max: 10 },
    { key: "certificationsAndPortfolio", label: "Certifications and portfolio", max: 10 },
    { key: "selfAssessment", label: "Self-assessment", max: 20 }
  ];

  categories.forEach(category => {
    const row = document.createElement("div");
    row.className = "breakdown-row";

    const heading = document.createElement("div");
    heading.className = "breakdown-heading";

    const label = document.createElement("span");
    label.textContent = category.label;

    const value = document.createElement("strong");
    value.textContent = `${breakdown[category.key]} / ${category.max}`;

    heading.append(label, value);

    const track = document.createElement("div");
    track.className = "breakdown-track";

    const fill = document.createElement("div");
    fill.className = "breakdown-fill";
    fill.style.width = `${Math.min(
      100,
      (breakdown[category.key] / category.max) * 100
    )}%`;

    track.appendChild(fill);
    row.append(heading, track);
    container.appendChild(row);
  });
}

function renderResults(answers) {
  let result;

  try {
    result = analyzeCareerReadiness(answers);
  } catch (error) {
    console.error("Unable to analyze assessment.");
    noResults.hidden = false;
    resultsContent.hidden = true;
    return;
  }

  document.getElementById("result-career").textContent = result.career;
  document.getElementById("readiness-badge").textContent = result.readinessLevel;
  document.getElementById("result-summary").textContent = result.summary;
  document.getElementById("score-value").textContent = result.score;

  const scoreCircle = document.getElementById("score-circle");
  scoreCircle.style.setProperty("--score-angle", `${result.score * 3.6}deg`);
  scoreCircle.setAttribute(
    "aria-label",
    `Career readiness score: ${result.score} out of 100`
  );

  addSkillTags(
    document.getElementById("matched-skills"),
    result.matchedSkills,
    "No matching skills selected yet."
  );

  addSkillTags(
    document.getElementById("missing-skills"),
    result.missingSkills,
    "Great! All listed career skills were selected."
  );

  renderRecommendations(result.recommendations);
  renderScoreBreakdown(result.scoreBreakdown);

  noResults.hidden = true;
  resultsContent.hidden = false;
}

document.getElementById("restart-btn").addEventListener("click", () => {
  window.location.href = "form.html";
});

document.getElementById("print-btn").addEventListener("click", () => {
  window.print();
});

const answers = readAssessmentAnswers();

if (answers) {
  renderResults(answers);
} else {
  noResults.hidden = false;
  resultsContent.hidden = true;
}
