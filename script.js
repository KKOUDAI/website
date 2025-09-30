const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const contactForm = document.querySelector(".contact-form");
const yearElem = document.getElementById("year");

// Set current year in footer for quick maintenance
if (yearElem) {
  yearElem.textContent = new Date().getFullYear();
}

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
const storedTheme = localStorage.getItem("codex-theme");

const applyTheme = (theme) => {
  if (theme === "dark") {
    root.setAttribute("data-theme", "dark");
    themeToggle.textContent = "☀️";
  } else {
    root.removeAttribute("data-theme");
    themeToggle.textContent = "🌙";
  }
};

const initialTheme = storedTheme || (prefersDark.matches ? "dark" : "light");
applyTheme(initialTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    const nextTheme = isDark ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("codex-theme", nextTheme);
  });
}

// Provide smooth scroll fallback for browsers without native support
const supportsSmoothScroll = "scrollBehavior" in document.documentElement.style;

if (!supportsSmoothScroll) {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      event.preventDefault();
      const targetId = anchor.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      const topOffset = targetElement.getBoundingClientRect().top + window.pageYOffset - 72;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    });
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get("name") || "";

    window.alert(`${name}さん、メッセージありがとうございます！`);
    contactForm.reset();
  });
}

prefersDark.addEventListener("change", (event) => {
  if (localStorage.getItem("codex-theme")) return;
  applyTheme(event.matches ? "dark" : "light");
});
