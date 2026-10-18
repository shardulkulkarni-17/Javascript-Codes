
const CAREER_REQUIREMENTS = {
  "Software Developer": {
    skills: ["Java", "Python", "C++", "C#", "JavaScript", "SQL", "Git"],
    recommendations: {
      "Java": "Learn object-oriented programming and Java collections.",
      "Python": "Practice Python fundamentals and problem-solving.",
      "C++": "Study data structures, algorithms and memory management.",
      "C#": "Practice object-oriented programming with C#.",
      "JavaScript": "Practice programming fundamentals and asynchronous JavaScript.",
      "SQL": "Learn database queries, joins and data modeling.",
      "Git": "Practice version control using branches and commits.",
      "Projects": "Build two practical applications and document your code."
    }
  },

  "Web Developer": {
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "Git"],
    recommendations: {
      "HTML": "Learn semantic HTML and accessible forms.",
      "CSS": "Practice responsive layouts, Flexbox and Grid.",
      "JavaScript": "Build interactive features using JavaScript.",
      "React": "Learn components, props, state and hooks.",
      "Node.js": "Learn server-side JavaScript fundamentals.",
      "Express": "Practice creating REST APIs with Express.",
      "Git": "Learn Git and maintain a clear project history.",
      "Projects": "Build and deploy a responsive, interactive website."
    }
  },

  "Data Analyst": {
    skills: ["Python", "SQL", "Excel", "Power BI", "Tableau", "Statistics"],
    recommendations: {
      "Python": "Practice data analysis using pandas and NumPy.",
      "SQL": "Learn filtering, joins, aggregation and subqueries.",
      "Excel": "Practice formulas, pivot tables and data cleaning.",
      "Power BI": "Build interactive dashboards using Power BI.",
      "Tableau": "Learn data visualization and dashboard design.",
      "Statistics": "Study descriptive statistics and basic probability.",
      "Projects": "Analyze a real dataset and present actionable insights."
    }
  },

  "Cybersecurity Analyst": {
    skills: ["Linux", "Networking", "Python", "Security Fundamentals", "Wireshark", "SIEM"],
    recommendations: {
      "Linux": "Practice Linux commands, permissions and system logs.",
      "Networking": "Study TCP/IP, DNS, ports and network protocols.",
      "Python": "Write simple scripts to automate defensive security tasks.",
      "Security Fundamentals": "Learn authentication, access control and common threats.",
      "Wireshark": "Practice analyzing network traffic in a legal lab.",
      "SIEM": "Explore security event monitoring and log analysis.",
      "Projects": "Create a home lab for defensive security practice."
    }
  },

  "UI/UX Designer": {
    skills: ["Figma", "Wireframing", "Prototyping", "User Research", "Visual Design", "Accessibility"],
    recommendations: {
      "Figma": "Practice reusable components and auto layout in Figma.",
      "Wireframing": "Create low-fidelity wireframes for a user journey.",
      "Prototyping": "Build interactive prototypes and test user flows.",
      "User Research": "Learn interviews, usability testing and personas.",
      "Visual Design": "Practice typography, spacing, color and hierarchy.",
      "Accessibility": "Learn accessible color contrast and inclusive design.",
      "Projects": "Create a case study showing the problem, process and outcome."
    }
  }
};

function analyzeCareerReadiness(answers) {
  const career = CAREER_REQUIREMENTS[answers.career];

  if (!career) {
    throw new Error("Please select a valid career.");
  }

  const selectedSkills = [
    ...(answers.skills || []),
    ...(answers.otherSkills || "")
      .split(",")
      .map(skill => skill.trim())
      .filter(Boolean)
  ];

  const normalizedSkills = selectedSkills.map(skill =>
    skill.toLowerCase()
  );

  const matchedSkills = career.skills.filter(skill =>
    normalizedSkills.includes(skill.toLowerCase())
  );

  const missingSkills = career.skills.filter(skill =>
    !normalizedSkills.includes(skill.toLowerCase())
  );

  // 1. Career-specific skill match: 40 points
  const skillScore = career.skills.length
    ? (matchedSkills.length / career.skills.length) * 40
    : 0;

  // 2. Projects and practical experience: 20 points
  const projectCount = Number(answers.projectCount || 0);
  const projectScore = Math.min(projectCount / 3, 1) * 12;
  const internshipScore = answers.internship === "Yes" ? 8 : 0;
  const experienceScore = projectScore + internshipScore;

  // 3. Education and learning progress: 10 points
  const educationScore = answers.qualification ? 5 : 0;
  const learningScore = answers.proficiency
    ? ({
        Beginner: 2,
        Intermediate: 4,
        Advanced: 5
      }[answers.proficiency] || 0)
    : 0;
  const educationTotal = educationScore + learningScore;

  // 4. Certifications and portfolio: 10 points
  const certificationScore =
    answers.certifications === "Yes" ? 5 : 0;
  const portfolioScore =
    answers.portfolio === "Yes" ? 5 : 0;
  const portfolioTotal = certificationScore + portfolioScore;

  // 5. Self-assessment: 20 points
  const problemSolving = Number(answers.problemSolving || 0);
  const interviewPrep = Number(answers.interviewPrep || 0);
  const communication = Number(answers.communication || 0);

  const confidenceScore =
    ((problemSolving + interviewPrep + communication) / 15) * 15;

  const practiceScore =
    answers.practicedQuestions === "Yes" ? 5 : 0;

  const selfAssessmentTotal = confidenceScore + practiceScore;

  const score = Math.round(
    skillScore +
    experienceScore +
    educationTotal +
    portfolioTotal +
    selfAssessmentTotal
  );

  let readinessLevel;
  let summary;

  if (score >= 80) {
    readinessLevel = "Strong Preparation";
    summary = "You have a promising foundation. Focus on polishing your skills and interview practice.";
  } else if (score >= 60) {
    readinessLevel = "Good Progress";
    summary = "You have made progress. Strengthen your missing skills and practical experience.";
  } else if (score >= 40) {
    readinessLevel = "Developing";
    summary = "You have a starting foundation. Prioritize core skills and build small projects.";
  } else {
    readinessLevel = "Getting Started";
    summary = "Start with the fundamentals, then practice through small, structured projects.";
  }

  const recommendations = missingSkills
    .slice(0, 3)
    .map(skill => ({
      skill,
      action: career.recommendations[skill] ||
        `Learn ${skill} and practice it in a small project.`
    }));

  if (recommendations.length < 3 && projectCount < 2) {
    recommendations.push({
      skill: "Practical Projects",
      action: career.recommendations.Projects
    });
  }

  if (
    recommendations.length < 3 &&
    answers.practicedQuestions !== "Yes"
  ) {
    recommendations.push({
      skill: "Interview Practice",
      action: "Practice role-specific questions and explain your project decisions aloud."
    });
  }

  return {
    career: answers.career,
    score: Math.max(0, Math.min(100, score)),
    readinessLevel,
    summary,
    matchedSkills,
    missingSkills,
    recommendations: recommendations.slice(0, 3),
    scoreBreakdown: {
      skills: Math.round(skillScore),
      experience: Math.round(experienceScore),
      education: Math.round(educationTotal),
      certificationsAndPortfolio: Math.round(portfolioTotal),
      selfAssessment: Math.round(selfAssessmentTotal)
    }
  };
}
