const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// AI Knowledge Base
const aiResponses = {
  "як вибрати пароль": "Стійкий пароль повинен мати: мінімум 12 символів, великі й малі букви, цифри та спеціальні символи. Не використовуйте особисту інформацію, дати народження або послідовності на клавіатурі. Найкраще використовувати менеджер паролів (1Password, Bitwarden, LastPass).",
  "як правильно вибрати пароль": "Стійкий пароль повинен мати: мінімум 12 символів, великі й малі букви, цифри та спеціальні символи. Не використовуйте особисту інформацію, дати народження або послідовності на клавіатурі. Найкраще використовувати менеджер паролів (1Password, Bitwarden, LastPass).",
  "що таке фішинг": "Фішинг — це кіберзловживання, при якому зловмисники виділяють себе за легітимні компанії (банки, сервіси) через поддельні листи, SMS або сайти. Вони спонукають вас ввести пароль, дані карти або інші чутливі дані. Як захиститися: перевіряйте адреси email, не клікайте на странні посилання, не завантажуйте файли від невідомих, використовуйте 2FA.",
  "як захистити телефон": "1. Встановлюйте оновлення одразу\n2. Завантажуйте додатки тільки з App Store / Google Play\n3. Використовуйте сильний пін, Face ID або відбиток\n4. Включите 2FA для важливих акаунтів\n5. Не підключайтесь до невідомих Wi-Fi мереж\n6. Регулярно робіть резервні копії",
  "що таке vpn": "VPN (Virtual Private Network) — це безпечна програма, яка шифрує ваш інтернет-трафік. Вона приховує ваш IP адресу та робить вас невидимо онлайн. VPN корисна в публічних Wi-Fi мережах (кафе, аеропорти). Рекомендовані: ExpressVPN, NordVPN, Proton VPN, Mullvad.",
  "як розпізнати фішинг": "Ознаки фішингу: 1) Дивні адреси email (не офіційні домени), 2) Прохання термінально ввести пароль, 3) Посилання в листі ведуть на потенційно шкідливі сайти, 4) Неприроднна мова або помилки, 5) Непрохані листи про оновлення або перевірки акаунту. Завжди перевіряйте домен вебсайту!",
  "як включити 2fa": "Двофакторна аутентифікація вимагає два способи підтвердження: пароль + код. Кроки: 1) Йти в параметри акаунту, 2) Знайти опцію 'Безпека', 3) Включити 2FA, 4) Вибрати метод (додаток як Google Authenticator або SMS), 5) Зберегти backup коди!",
  "як захистити компютер": "1. Встановіть антивірус та фаєрвол\n2. Регулярно оновлюйте Windows / macOS\n3. Використовуйте сильні паролі і 2FA\n4. Не завантажуйте files від невідомих джерел\n5. Бувайте обережні в email та посиланнях\n6. Робіть резервні копії регулярно",
  "що таке шифрування": "Шифрування перетворює читний текст на нечитний код. Тільки людина з правильним ключем може видобути оригінальне повідомлення. HTTPS на вебсайтах використовує шифрування. Зашифровані месенджери: Signal, Telegram (secret chats), WhatsApp.",
  "як захистити wi-fi": "1. Змініть стандартний пароль маршрутизатора\n2. Використовуйте шифрування WPA3 (або WPA2)\n3. Приховайте SSID (ім'я мережі)\n4. Відключіть WPS (Wi-Fi Protected Setup)\n5. Регулярно оновлюйте прошивку маршрутизатора",
  "що таке двофакторна аутентифікація": "2FA — додатковий шар безпеки. Вимагає два методи підтвердження: 1) Що ви знаєте (пароль), 2) Що у вас є (телефон з кодом). Види: SMS, TOTP додатки (Google Authenticator, Microsoft Authenticator), 2FA ключі (YubiKey).",
  "як захистити email": "1. Використовуйте сильний пароль\n2. Включіть 2FA (TOTP краще за SMS)\n3. Проглядайте пристрої, підключені до акаунту\n4. Встановіть вісімків відновлення\n5. Не передавайте email нікому\n6. Будьте обережні з посиланнями в листах"
};

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

    const mailto = `mailto:security@blackguard.example?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    status && (status.textContent = "Відкриваємо ваш поштовий клієнт…");
    form.reset();
  });
}

function initAI() {
  const messagesContainer = $("#ai-messages");
  const inputField = $("#ai-question");
  const sendBtn = $("#ai-send");
  const quickBtns = $$(".ai-quick-btn");

  if (!messagesContainer || !inputField || !sendBtn) return;

  function addMessage(text, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `ai-message ${isUser ? "ai-message--user" : "ai-message--bot"}`;
    
    const avatar = document.createElement("div");
    avatar.className = "ai-message__avatar";
    avatar.textContent = isUser ? "👤" : "🤖";
    
    const content = document.createElement("div");
    content.className = "ai-message__content";
    content.textContent = text;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function getAIResponse(question) {
    const lowerQuestion = question.toLowerCase();
    
    // Точний пошук або схожість
    for (const [key, response] of Object.entries(aiResponses)) {
      if (lowerQuestion.includes(key) || key.includes(lowerQuestion)) {
        return response;
      }
    }
    
    // Якщо немає точного матчу
    return "Я не знаю точної відповіді на це питання, але можу вам допомогти з основами кібербезпеки. Спробуйте запитати про: паролі, фішинг, 2FA, VPN, захист комп'ютера чи телефону.";
  }

  function handleSendMessage() {
    const question = inputField.value.trim();
    if (!question) return;

    addMessage(question, true);
    inputField.value = "";

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = getAIResponse(question);
      addMessage(response, false);
    }, 500);
  }

  sendBtn.addEventListener("click", handleSendMessage);
  inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  quickBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const question = btn.getAttribute("data-question");
      if (question) {
        inputField.value = question;
        handleSendMessage();
      }
    });
  });
}

initTheme();
initTopbarElevation();
initNav();
initSmoothScroll();
initYear();
initForm();
initAI();
