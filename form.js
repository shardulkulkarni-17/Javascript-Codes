
const form = document.getElementById("career-form");
const steps = Array.from(document.querySelectorAll(".form-step"));

const backButton = document.getElementById("back-btn");
const nextButton = document.getElementById("next-btn");
const submitButton = document.getElementById("submit-btn");

const stepLabel = document.getElementById("step-label");
const progressPercent = document.getElementById("progress-percent");
const progressBar = document.getElementById("progress-bar");
const errorMessage = document.getElementById("form-error");

let currentStep = 0;

function showStep(stepIndex) {
  currentStep = stepIndex;

  steps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
  });

  const stepNumber = currentStep + 1;
  const progress = Math.round((stepNumber / steps.length) * 100);

  stepLabel.textContent = `Step ${stepNumber} of ${steps.length}`;
  progressPercent.textContent = `${progress}% completed`;
  progressBar.style.width = `${progress}%`;

  backButton.hidden = currentStep === 0;
  nextButton.hidden = currentStep === steps.length - 1;
  submitButton.hidden = currentStep !== steps.length - 1;

  errorMessage.textContent = "";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function validateCurrentStep() {
  const activeStep = steps[currentStep];
  const requiredFields = activeStep.querySelectorAll("[required]");

  for (const field of requiredFields) {
    if (field.type === "radio") {
      const group = activeStep.querySelectorAll(
        `input[type="radio"][name="${field.name}"]`
      );

      const isSelected = Array.from(group).some(
        radio => radio.checked
      );

      if (!isSelected) {
        errorMessage.textContent = "Please select a career before continuing.";
        return false;
      }

      continue;
    }

    if (field.type === "checkbox") {
      if (!field.checked) {
        errorMessage.textContent = "Please complete all required fields.";
        return false;
      }

      continue;
    }

    if (!field.checkValidity() || !field.value.trim()) {
      field.reportValidity();
      errorMessage.textContent = "Please complete the required fields.";
      field.focus();
      return false;
    }
  }

  return true;
}

nextButton.addEventListener("click", () => {
  if (!validateCurrentStep()) return;

  if (currentStep < steps.length - 1) {
    showStep(currentStep + 1);
  }
});

backButton.addEventListener("click", () => {
  if (currentStep > 0) {
    showStep(currentStep - 1);
  }
});

form.addEventListener("submit", event => {
  event.preventDefault();

  if (!validateCurrentStep()) return;

  const formData = new FormData(form);
  const params = new URLSearchParams();

  for (const [key, value] of formData.entries()) {
    params.append(key, value);
  }

  window.location.href = `results.html?${params.toString()}`;
});

showStep(0);
