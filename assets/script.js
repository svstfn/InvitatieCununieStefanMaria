// Editează CONFIG dacă se schimbă datele evenimentului sau URL-ul Apps Script.
const CONFIG = {
  brideName: "Maria",
  groomName: "Stefan",
  heroImage: "imagini/miri1.JPG",
  eventDateISO: "2026-07-31T12:00:00",
  eventSpanText: "31 Iulie 2026, ora 15:30 – 2 August 2026, ora 12:00",
  birthdayNote: "Pe 1 August sărbătorim și ziua de naștere a lui Stefan.",
  ceremony: {
    place: "Primăria Ocna Sibiului",
    time: "12:00",
    mapUrl: "https://maps.app.goo.gl/DLThy8bBFZVLbdEEA",
    image: "imagini/primarie.jpg"
  },
  party: {
    place: "Pensiunea Titel Rășinari",
    time: "15:30",
    mapUrl: "https://maps.app.goo.gl/DawPc9VknjypN71x5",
    image: "imagini/locatie.jpg"
  },
  rsvpDeadline: "2026-07-25",
  scriptUrl: "https://script.google.com/macros/s/AKfycbyZ3Xqb6JV3cEY8q9F8T5KI9qWMcHOUAFpMDBCuZ-6mP1fhLBummXj4lSUcN7P7Fee6Zw/exec"
};

const MONTHS_RO = [
  "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
  "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
];

function formatEventDate(iso) {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_RO[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDeadline(iso) {
  const parts = iso.split("-");
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return `${d.getDate()} ${MONTHS_RO[d.getMonth()]} ${d.getFullYear()}`;
}

function injectConfig() {
  document.getElementById("bride-name").textContent = CONFIG.brideName;
  document.getElementById("groom-name").textContent = CONFIG.groomName;
  document.getElementById("event-date").textContent = formatEventDate(CONFIG.eventDateISO);
  document.getElementById("footer-names").textContent = `${CONFIG.brideName} & ${CONFIG.groomName}`;

  document.getElementById("event-span-text").textContent = CONFIG.eventSpanText;
  document.getElementById("birthday-note").textContent = CONFIG.birthdayNote;

  document.getElementById("ceremony-place").textContent = CONFIG.ceremony.place;
  document.getElementById("ceremony-time").textContent = CONFIG.ceremony.time;
  document.getElementById("party-place").textContent = CONFIG.party.place;
  document.getElementById("party-time").textContent = CONFIG.party.time;

  setupDetailCard("ceremony", CONFIG.ceremony);
  setupDetailCard("party", CONFIG.party);

  const hero = document.getElementById("hero");
  if (hero && CONFIG.heroImage) {
    hero.style.backgroundImage = `url("${CONFIG.heroImage}")`;
  }

  document.getElementById("rsvp-deadline").textContent =
    `Te rugăm să ne confirmi prezența până pe ${formatDeadline(CONFIG.rsvpDeadline)}.`;
}

function setupDetailCard(prefix, data) {
  const mapEl = document.getElementById(`${prefix}-map`);
  const photoEl = document.getElementById(`${prefix}-photo`);

  if (data.mapUrl) {
    mapEl.href = data.mapUrl;
    mapEl.hidden = false;
  } else {
    mapEl.hidden = true;
  }

  if (photoEl && data.image) {
    photoEl.src = data.image;
    photoEl.alt = data.place;
  }
}

let countdownInterval;

function updateCountdown() {
  const target = new Date(CONFIG.eventDateISO).getTime();
  const now = Date.now();
  const diff = target - now;
  const countdownEl = document.getElementById("countdown");
  const todayEl = document.getElementById("countdown-today");

  if (diff <= 0) {
    countdownEl.classList.add("countdown--today");
    countdownEl.innerHTML = '<p class="countdown__today-msg">Astăzi ne cununăm!</p>';
    todayEl.classList.remove("visually-hidden");
    if (countdownInterval) clearInterval(countdownInterval);
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("countdown-days").textContent = String(days);
  document.getElementById("countdown-hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("countdown-minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("countdown-seconds").textContent = String(seconds).padStart(2, "0");
}

function initFadeIn() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const elements = document.querySelectorAll(".fade-in");

  if (prefersReduced) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

function getSelectedPrezenta() {
  const checked = document.querySelector('input[name="prezenta"]:checked');
  return checked ? checked.value : "";
}

function isPrezentaDa(prezenta) {
  return prezenta.startsWith("Da,");
}

function toggleConditionalFields() {
  const prezenta = getSelectedPrezenta();
  document.getElementById("group-persoane").hidden = !isPrezentaDa(prezenta);
}

function clearErrors() {
  document.querySelectorAll(".form-error").forEach((el) => {
    el.textContent = "";
  });
  const status = document.getElementById("form-status");
  status.textContent = "";
  status.className = "form-status";
}

function setError(fieldId, message) {
  document.getElementById(`error-${fieldId}`).textContent = message;
}

function validateForm() {
  clearErrors();
  let valid = true;

  const nume = document.getElementById("nume").value.trim();
  if (!nume) {
    setError("nume", "Te rugăm să introduci numele.");
    valid = false;
  }

  const prezenta = getSelectedPrezenta();
  if (!prezenta) {
    setError("prezenta", "Te rugăm să alegi o opțiune.");
    valid = false;
  }

  if (isPrezentaDa(prezenta)) {
    const persoane = Number(document.getElementById("persoane").value);
    if (!persoane || persoane < 1) {
      setError("persoane", "Numărul de persoane trebuie să fie cel puțin 1.");
      valid = false;
    }
  }

  return valid;
}

function showSuccessMessage(prezenta) {
  const wrapper = document.getElementById("rsvp-form-wrapper");
  const successEl = document.getElementById("rsvp-success");

  wrapper.hidden = true;
  successEl.hidden = false;

  if (isPrezentaDa(prezenta)) {
    successEl.innerHTML =
      "<p>Îți mulțumim! Răspunsul tău a fost trimis. Abia așteptăm să sărbătorim împreună!</p>";
  } else {
    successEl.innerHTML =
      "<p>Îți mulțumim! Răspunsul tău a fost trimis. Ne pare rău că nu poți fi alături de noi.</p>";
  }
}

function submitRsvp(data) {
  return new Promise((resolve, reject) => {
    const iframe = document.getElementById("rsvp-target");
    if (!iframe) {
      reject(new Error("iframe rsvp-target lipsă"));
      return;
    }

    const url = CONFIG.scriptUrl + "?" + new URLSearchParams(data).toString();
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      iframe.removeEventListener("load", finish);
      resolve();
    };

    iframe.addEventListener("load", finish);
    iframe.addEventListener("error", () => {
      if (!settled) {
        settled = true;
        reject(new Error("Nu s-a putut trimite răspunsul."));
      }
    });
    setTimeout(finish, 5000);

    iframe.src = url;
  });
}

function handleSubmit(e) {
  e.preventDefault();

  if (!validateForm()) return;

  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("rsvp-submit");
  const honeypot = document.getElementById("website").value.trim();
  const prezenta = getSelectedPrezenta();

  if (honeypot) {
    showSuccessMessage(prezenta);
    return;
  }

  if (!CONFIG.scriptUrl) {
    statusEl.textContent =
      "Formularul nu este încă conectat. Proprietarul trebuie să adauge scriptUrl în assets/script.js.";
    statusEl.className = "form-status form-status--info";
    return;
  }

  const data = {
    nume: document.getElementById("nume").value.trim(),
    prezenta,
    persoane: isPrezentaDa(prezenta) ? document.getElementById("persoane").value : "",
    mesaj: document.getElementById("mesaj").value.trim(),
    website: ""
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Se trimite…";
  statusEl.textContent = "";
  statusEl.className = "form-status";

  submitRsvp(data)
    .then(() => {
      showSuccessMessage(prezenta);
    })
    .catch(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Trimite răspunsul";
      statusEl.textContent = "A apărut o eroare. Te rugăm să încerci din nou.";
      statusEl.className = "form-status form-status--error";
    });
}

function initForm() {
  const form = document.getElementById("rsvp-form");
  form.addEventListener("submit", handleSubmit);

  document.querySelectorAll('input[name="prezenta"]').forEach((radio) => {
    radio.addEventListener("change", toggleConditionalFields);
  });
}

function initGallery() {
  const carousel = document.getElementById("gallery-carousel");
  const dotsWrap = document.getElementById("gallery-dots");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.getElementById("lightbox-close");
  const backdrop = document.getElementById("lightbox-backdrop");
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll(".gallery-carousel__slide")];
  if (!slides.length) return;

  let index = 0;
  let timer = null;
  const intervalMs = 1000;

  const setSlide = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
    dotsWrap?.querySelectorAll(".gallery-frame__dot").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
  };

  const startAuto = () => {
    stopAuto();
    timer = window.setInterval(() => setSlide(index + 1), intervalMs);
  };

  const stopAuto = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  slides.forEach((slide, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "gallery-frame__dot" + (i === 0 ? " is-active" : "");
    dot.setAttribute("aria-label", `Fotografia ${i + 1}`);
    dot.addEventListener("click", () => {
      setSlide(i);
      startAuto();
    });
    dotsWrap?.appendChild(dot);
  });

  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);
  carousel.addEventListener("focusin", stopAuto);
  carousel.addEventListener("focusout", (e) => {
    if (!carousel.contains(e.relatedTarget)) startAuto();
  });

  if (lightbox && lightboxImg) {
    const open = (src, alt) => {
      lightboxImg.src = src;
      lightboxImg.alt = alt || "Maria și Stefan";
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      stopAuto();
    };

    const close = () => {
      lightbox.hidden = true;
      lightboxImg.src = "";
      document.body.style.overflow = "";
      startAuto();
    };

    slides.forEach((slide) => {
      slide.addEventListener("click", () => {
        const img = slide.querySelector("img");
        open(slide.dataset.full, img ? img.alt : "");
      });
    });

    closeBtn?.addEventListener("click", close);
    backdrop?.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lightbox.hidden) close();
    });
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reducedMotion) startAuto();
}

document.addEventListener("DOMContentLoaded", () => {
  injectConfig();
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
  initFadeIn();
  initForm();
  initGallery();
});
