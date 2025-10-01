const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const navToggle = document.getElementById("navToggle");
const siteHeader = document.querySelector(".site-header");
const siteNav = document.getElementById("primaryNav");
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

if (navToggle && siteHeader && siteNav) {
  const closeNav = () => {
    if (!siteHeader.classList.contains("site-header--nav-open")) return;
    siteHeader.classList.remove("site-header--nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "メニューを開く");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("site-header--nav-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    navToggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
    if (isOpen) {
      const firstLink = siteNav.querySelector("a");
      if (firstLink) {
        firstLink.focus({ preventScroll: true });
      }
    }
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeNav();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 640) {
      closeNav();
    }
  });

  document.addEventListener("click", (event) => {
    if (!siteHeader.classList.contains("site-header--nav-open")) return;
    if (siteHeader.contains(event.target)) return;
    closeNav();
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
    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    const subject = encodeURIComponent(`お問い合わせ: ${name || "無記名"}`);
    const bodyLines = [
      "以下の内容でお問い合わせがありました。",
      "",
      `お名前: ${name || "未入力"}`,
      `メールアドレス: ${email || "未入力"}`,
      "",
      "メッセージ:",
      message || "(本文なし)",
    ];

    const mailtoLink = `mailto:kkoga2013@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    window.location.href = mailtoLink;
    contactForm.reset();
  });
}

prefersDark.addEventListener("change", (event) => {
  if (localStorage.getItem("codex-theme")) return;
  applyTheme(event.matches ? "dark" : "light");
});
