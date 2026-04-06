const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {}
}

function initTheme() {
  const toggle = $("[data-theme-toggle]");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme || "dark";
    setTheme(current === "dark" ? "light" : "dark");
  });
}

function initTopbarElevation() {
  const topbar = $(".topbar");
  if (!topbar) return;
  const onScroll = () => topbar.setAttribute("data-elevate", window.scrollY > 6 ? "1" : "0");
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initNav() {
  const toggle = $("[data-nav-toggle]");
  const panel = $("[data-nav-panel]");
  if (!toggle || !panel) return;

  const close = () => {
    panel.dataset.open = "0";
    toggle.setAttribute("aria-expanded", "false");
  };
  const open = () => {
    panel.dataset.open = "1";
    toggle.setAttribute("aria-expanded", "true");
  };

  close();

  toggle.addEventListener("click", () => {
    const isOpen = panel.dataset.open === "1";
    if (isOpen) close();
    else open();
  });

  panel.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.matches("a[href^='#']")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  document.addEventListener("click", (e) => {
    if (window.innerWidth > 640) return;
    const target = e.target;
    if (!(target instanceof Node)) return;
    if (panel.contains(target) || toggle.contains(target)) return;
    close();
  });
}

function initSmoothScroll() {
  const anchors = $$("a[href^='#']");
  anchors.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#" || href === "#top") return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", href);
    });
  });
}

function initYear() {
  const el = $("#year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function initForm() {
  const form = $("#lead-form");
  if (!form) return;

  const status = $("#form-status");
  const fields = {
    name: $("#name"),
    email: $("#email"),
  };

  function setError(fieldName, message) {
    const hint = $(`[data-error-for="${fieldName}"]`, form);
    if (!hint) return;
    hint.textContent = message || "";
    hint.dataset.kind = message ? "error" : "";
  }

  function validate() {
    let ok = true;
    const name = fields.name?.value?.trim() ?? "";
    const email = fields.email?.value?.trim() ?? "";

    if (!name) {
      ok = false;
      setError("name", "Вкажіть ім’я.");
    } else setError("name", "");

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      ok = false;
      setError("email", "Вкажіть коректний email.");
    } else setError("email", "");

    return ok;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) {
      status && (status.textContent = "Перевірте поля форми.");
      return;
    }

    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    const subject = `Запит: ${payload.topic || "кібербезпека"}`;
    const body = [
      `Ім’я: ${payload.name || ""}`,
      `Email: ${payload.email || ""}`,
      `Тема: ${payload.topic || ""}`,
      "",
      `${payload.message || ""}`,
    ].join("\n");

    const mailto = `mailto:security@kyivsec.example?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    status && (status.textContent = "Відкриваємо ваш поштовий клієнт…");
    form.reset();
  });
}

initTheme();
initTopbarElevation();
initNav();
initSmoothScroll();
initYear();
initForm();
