const inputElements = {
  username: document.getElementById("username"),
  email: document.getElementById("email"),
  password: document.getElementById("password"),
  passwordConfirmation: document.getElementById("passwordConfirmation"),
  showPasswordToggle: document.getElementById("showPasswordToggle"),
};

const complianceElements = {
  usernameCompliance: document.querySelector(".username-compliance"),
  emailCompliance: document.querySelector(".email-compliance"),
  passwordCompliance: document.querySelector(".password-compliance"),
  passwordConfirmationCompliance: document.querySelector(
    ".passwordConfirmation-compliance"
  ),
};
// username compliance
inputElements.username.addEventListener("focus", () => {
  complianceElements.usernameCompliance.classList.remove("hidden");
});

inputElements.username.addEventListener("blur", () => {
  complianceElements.usernameCompliance.classList.add("hidden");
});

//email compliance
inputElements.email.addEventListener("focus", () => {
  complianceElements.emailCompliance.classList.remove("hidden");
});

inputElements.email.addEventListener("blur", () => {
  complianceElements.emailCompliance.classList.add("hidden");
});
