/* Editorial template extras: product rail, add-to-bag counter, subscription picker.
   Core behaviour (nav, theme, reveals, form, tracking) comes from ../../assets/js/main.js. */
(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---- Product rail arrows ------------------------------------------- */
  const rail = $("[data-rail]");
  const prev = $("[data-rail-prev]"), next = $("[data-rail-next]");
  if (rail && prev && next) {
    const step = () => (rail.querySelector("li")?.getBoundingClientRect().width || 300) + 24;
    const sync = () => {
      prev.disabled = rail.scrollLeft < 4;
      next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
    };
    prev.addEventListener("click", () => rail.scrollBy({ left: -step(), behavior: "smooth" }));
    next.addEventListener("click", () => rail.scrollBy({ left: step(), behavior: "smooth" }));
    rail.addEventListener("scroll", sync, { passive: true });
    addEventListener("resize", sync);
    sync();
  }

  /* ---- Add to bag (demo: counts items; wire to Shopify/Square/etc.) --- */
  const bag = $(".bag"), count = $(".bag__count");
  let items = 0;
  $$("[data-add]").forEach((btn) => btn.addEventListener("click", () => {
    items += 1;
    count.textContent = items;
    count.classList.add("is-on");
    bag.setAttribute("aria-label", `Bag, ${items} item${items === 1 ? "" : "s"}`);
    btn.classList.add("is-added");
    btn.querySelector("span").textContent = "Added";
    btn.querySelector("use").setAttribute("href", "#i-check");
    setTimeout(() => {
      btn.classList.remove("is-added");
      btn.querySelector("span").textContent = "Add another";
      btn.querySelector("use").setAttribute("href", "#i-plus");
    }, 1600);
  }));

  /* ---- Subscription frequency picker --------------------------------- */
  const labels = { 1: "every week", 2: "every 2 weeks", 4: "every month" };
  $$('input[name="freq"]').forEach((r) => r.addEventListener("change", () => {
    $("[data-sub-price]").textContent = "$" + r.dataset.price;
    $("[data-sub-freq]").textContent = labels[r.value];
  }));
})();
