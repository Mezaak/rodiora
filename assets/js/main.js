/* ============================================================
   Rodiora — language switching, navigation, form, animations
   ============================================================ */

/* ------------------------------------------------------------
   1) STORE LINKS
   Put your real store URLs here. They are applied to every
   element with data-store="google" / data-store="apple".
   ------------------------------------------------------------ */
const STORE_LINKS = {
  google: "", // e.g. "https://play.google.com/store/apps/details?id=com.rodiora.app"
  apple: ""   // e.g. "https://apps.apple.com/app/id0000000000"
};

const CONTACT_EMAIL = "hello@rodiora.com";
const LANG_KEY = "rodiora-lang";

/* ---------------- Language ---------------- */
function readSavedLang() {
  try {
    return localStorage.getItem(LANG_KEY);
  } catch (err) {
    return null;
  }
}

function getInitialLang() {
  const saved = readSavedLang();
  if (saved === "tr" || saved === "en") return saved;
  return (navigator.language || "en").toLowerCase().startsWith("tr") ? "tr" : "en";
}

function applyLanguage(lang, animate) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;

  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const value = dict[el.dataset.i18n];
    if (value) el.textContent = value;
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const value = dict[el.dataset.i18nHtml];
    if (value) el.innerHTML = value;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const value = dict[el.dataset.i18nPlaceholder];
    if (value) el.placeholder = value;
  });

  if (dict["meta.title"]) document.title = dict["meta.title"];
  const desc = document.querySelector('meta[name="description"]');
  if (desc && dict["meta.desc"]) desc.setAttribute("content", dict["meta.desc"]);

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    const active = btn.dataset.lang === lang;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", String(active));
  });

  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (err) {
    /* private mode: language simply will not be remembered */
  }

  if (animate) {
    document.body.classList.add("lang-fade");
    window.setTimeout(() => document.body.classList.remove("lang-fade"), 400);
  }
}

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.dataset.lang !== document.documentElement.lang) {
      applyLanguage(btn.dataset.lang, true);
    }
  });
});

/* ---------------- Store links ---------------- */
document.querySelectorAll("[data-store]").forEach((el) => {
  const url = STORE_LINKS[el.dataset.store];
  if (url) {
    el.href = url;
    el.setAttribute("aria-label", el.dataset.store === "google" ? "Google Play" : "App Store");
  } else {
    el.setAttribute("aria-disabled", "true");
    el.addEventListener("click", (event) => event.preventDefault());
  }
});

/* ---------------- Mobile menu ---------------- */
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

function closeMenu() {
  nav.classList.remove("is-open");
  menuBtn.setAttribute("aria-expanded", "false");
}

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (e) => {
    if (nav.classList.contains("is-open") && !nav.contains(e.target) && !menuBtn.contains(e.target)) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 900) closeMenu();
  });
}

/* ---------------- Header shadow on scroll ---------------- */
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------------- Reveal on scroll ---------------- */
const revealTargets = document.querySelectorAll(
  ".section-head, .card, .apps-panel, .step, .about-copy, .values, .contact-copy, .contact-form, .hero-copy > *"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealTargets.forEach((el) => io.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("is-in"));
}

/* ---------------- Contact form (mailto, no backend) ---------------- */
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const lang = document.documentElement.lang;
    const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const topic = form.elements.topic.value;
    const message = form.elements.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = t["form.required"];
      status.style.color = "#fca5a5";
      return;
    }

    const subject = lang === "tr"
      ? `Yeni proje talebi — ${topic}`
      : `New project enquiry — ${topic}`;

    const body = lang === "tr"
      ? `Ad: ${name}\nE-posta: ${email}\nKonu: ${topic}\n\n${message}`
      : `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`;

    window.location.href =
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    status.textContent = t["form.status"];
    status.style.color = "#6ee7b7";
  });
}

/* ---------------- Footer year ---------------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* ---------------- Boot ---------------- */
applyLanguage(getInitialLang(), false);
