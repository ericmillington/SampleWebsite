/* ==========================================================================
   MAIN SCRIPT — progressive enhancement only. The site is fully usable
   without JS; everything here is polish, conversion helpers, or analytics.
   ========================================================================== */
(() => {
  "use strict";

  const root = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };

  root.classList.add("js");

  /* ---- Analytics hook ---------------------------------------------------
     Any element with data-track="name" pushes an event to window.dataLayer
     (works with GTM / GA4 out of the box) and calls gtag/plausible if present. */
  window.dataLayer = window.dataLayer || [];
  const track = (event, detail = {}) => {
    const payload = { event, ...detail, page: location.pathname };
    window.dataLayer.push(payload);
    if (typeof window.gtag === "function") window.gtag("event", event, detail);
    if (typeof window.plausible === "function") window.plausible(event, { props: detail });
  };
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-track]");
    if (el) track(el.dataset.track, { label: el.textContent.trim().slice(0, 60), href: el.getAttribute("href") || "" });
  });

  /* ---- Theme (light/dark) toggle --------------------------------------- */
  const themeBtn = $(".theme-toggle");
  const metaTheme = $$('meta[name="theme-color"]');
  const applyTheme = (t) => {
    root.dataset.theme = t;
    themeBtn?.setAttribute("aria-pressed", String(t === "dark"));
    // keep the browser chrome color in sync with the manual choice
    metaTheme.forEach((m) => m.removeAttribute("media"));
    metaTheme[0]?.setAttribute("content", getComputedStyle(root).getPropertyValue("--bg").trim() || (t === "dark" ? "#111" : "#fff"));
  };
  const saved = store.get("theme");
  if (saved) applyTheme(saved);
  themeBtn?.addEventListener("click", () => {
    const current = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    store.set("theme", next);
  });

  /* ---- Demo preset switcher (only when <html data-demo>) ---------------- */
  const savedPreset = store.get("preset");
  if (root.hasAttribute("data-demo") && savedPreset) root.dataset.preset = savedPreset;
  const demo = $(".demo-switcher");
  if (demo && root.hasAttribute("data-demo")) {
    const btn = $(".demo-switcher__btn", demo);
    const panel = $(".demo-switcher__panel", demo);
    const sync = () => $$(".swatch", demo).forEach((s) => s.setAttribute("aria-pressed", String(s.dataset.preset === (root.dataset.preset || "violet"))));
    sync();
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
    });
    demo.addEventListener("click", (e) => {
      const s = e.target.closest(".swatch");
      if (!s) return;
      root.dataset.preset = s.dataset.preset;
      store.set("preset", s.dataset.preset);
      sync();
      if (root.dataset.theme) applyTheme(root.dataset.theme);
    });
  }

  /* ---- Announcement bar ------------------------------------------------- */
  const announce = $(".announce");
  if (announce) {
    const key = "announce:" + (announce.dataset.id || "1");
    if (store.get(key)) announce.remove();
    $(".announce__close", announce)?.addEventListener("click", () => { announce.remove(); store.set(key, "1"); });
  }

  /* ---- Header: scrolled state ------------------------------------------ */
  const header = $(".header");
  const onScroll = () => header?.classList.toggle("is-scrolled", scrollY > 8);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile nav ------------------------------------------------------- */
  const menuBtn = $(".menu-toggle");
  const nav = $("#site-nav");
  const setMenu = (open) => {
    menuBtn?.setAttribute("aria-expanded", String(open));
    menuBtn?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav?.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    if (open) header?.classList.add("is-scrolled"); else onScroll();
  };
  menuBtn?.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  nav?.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && menuBtn?.getAttribute("aria-expanded") === "true") { setMenu(false); menuBtn.focus(); } });
  matchMedia("(min-width: 901px)").addEventListener("change", (e) => e.matches && setMenu(false));

  /* ---- Active nav link while scrolling --------------------------------- */
  const navLinks = $$('.nav__link[href^="#"]');
  if (navLinks.length && "IntersectionObserver" in window) {
    const map = new Map(navLinks.map((a) => [a.getAttribute("href").slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navLinks.forEach((a) => a.removeAttribute("aria-current"));
        map.get(en.target.id)?.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---- Scroll reveal ---------------------------------------------------- */
  const revealEls = $$("[data-reveal]");
  if (!reducedMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---- Animated counters ------------------------------------------------ */
  const fmt = (n, dec) => n.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const runCounter = (el) => {
    const end = parseFloat(el.dataset.count);
    const dec = (el.dataset.count.split(".")[1] || "").length;
    const prefix = el.dataset.prefix || "", suffix = el.dataset.suffix || "";
    if (reducedMotion) { el.textContent = prefix + fmt(end, dec) + suffix; return; }
    const dur = 1600, t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = prefix + fmt(end * eased, dec) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counters = $$("[data-count]");
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { runCounter(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));
  } else counters.forEach(runCounter);

  /* ---- Card spotlight (cursor-follow glow) ----------------------------- */
  if (!reducedMotion && matchMedia("(hover: hover)").matches) {
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest(".card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    }, { passive: true });
  }

  /* ---- Pricing: monthly / annual toggle -------------------------------- */
  const billing = $(".billing-toggle");
  billing?.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    $$("button", billing).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const mode = b.dataset.billing;
    $$("[data-monthly]").forEach((el) => { el.textContent = mode === "annual" ? el.dataset.annual : el.dataset.monthly; });
    track("pricing_toggle", { mode });
  });

  /* ---- Mobile sticky CTA: show after hero, hide near the contact form -- */
  const sticky = $(".sticky-cta");
  const hero = $(".hero");
  const contact = $("#contact");
  if (sticky && hero && "IntersectionObserver" in window) {
    let pastHero = false, atContact = false;
    const update = () => sticky.classList.toggle("is-visible", pastHero && !atContact);
    new IntersectionObserver(([en]) => { pastHero = !en.isIntersecting; update(); }).observe(hero);
    if (contact) new IntersectionObserver(([en]) => { atContact = en.isIntersecting; update(); }, { threshold: 0.1 }).observe(contact);
  }

  /* ---- Lead form: validation + submit ---------------------------------
     • Real backend: set the form's action to your endpoint (Formspree,
       Basin, Netlify Forms, your CRM webhook…). We POST via fetch and then
       redirect to data-success (thank-you.html), which is where you fire
       your conversion pixel.
     • No backend yet (action="#"): we skip the POST and just redirect, so
       the full funnel can be demoed.                                     */
  $$("form[data-validate]").forEach((form) => {
    const messages = {
      valueMissing: "This field is required.",
      typeMismatch: { email: "Please enter a valid email address.", tel: "Please enter a valid phone number." },
      patternMismatch: "Please match the requested format.",
      tooShort: "Please add a little more detail.",
    };
    const errorFor = (input) => {
      const v = input.validity;
      if (v.valid) return "";
      if (v.valueMissing) return input.type === "checkbox" ? "Please tick this box to continue." : messages.valueMissing;
      if (v.typeMismatch) return messages.typeMismatch[input.type] || "Please check this value.";
      if (v.patternMismatch) return input.title || messages.patternMismatch;
      if (v.tooShort) return messages.tooShort;
      return input.validationMessage;
    };
    const show = (input) => {
      const field = input.closest(".field, .consent");
      const msg = errorFor(input);
      field?.classList.toggle("is-invalid", !!msg);
      input.setAttribute("aria-invalid", String(!!msg));
      const out = field?.querySelector(".field__error") || (input.id && $(`#${input.id}-error`));
      if (out) out.textContent = msg;
      return !msg;
    };
    const inputs = $$("input:not([type=hidden]):not(.hp input), select, textarea", form).filter((i) => !i.closest(".hp"));
    inputs.forEach((i) => {
      i.addEventListener("blur", () => { if (i.value || i.type === "checkbox") show(i); });
      i.addEventListener("input", () => { if (i.getAttribute("aria-invalid") === "true") show(i); });
    });

    let started = false;
    form.addEventListener("focusin", () => { if (!started) { started = true; track("form_start", { form: form.name || form.id }); } });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = $(".form-status", form);
      status && (status.hidden = true);
      const ok = inputs.map(show).every(Boolean);
      if (!ok) { inputs.find((i) => i.getAttribute("aria-invalid") === "true")?.focus(); return; }
      if ($(".hp input", form)?.value) return; // bot

      const btn = $('[type="submit"]', form);
      btn?.classList.add("is-loading");
      btn?.setAttribute("aria-busy", "true");
      const action = form.getAttribute("action");
      const success = form.dataset.success || "thank-you.html";
      try {
        if (action && action !== "#") {
          const res = await fetch(action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
          if (!res.ok) throw new Error(res.statusText);
        } else {
          await new Promise((r) => setTimeout(r, 700));
        }
        track("generate_lead", { form: form.name || form.id });
        location.href = success;
      } catch {
        btn?.classList.remove("is-loading");
        btn?.removeAttribute("aria-busy");
        if (status) { status.hidden = false; status.textContent = "Sorry — something went wrong. Please call us or try again in a moment."; }
      }
    });
  });

  /* ---- Footer year ------------------------------------------------------ */
  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
