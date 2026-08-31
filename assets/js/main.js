/* =============================================================
   Portfolio behaviour: theme, nav, filters, reveal, form.
   Vanilla JS, no dependencies. Every block is independent —
   delete one and the rest keeps working.
   ============================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme toggle ---------- */
  (function theme() {
    var toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    var systemDark = window.matchMedia("(prefers-color-scheme: dark)");

    function current() {
      return document.documentElement.dataset.theme ||
             (systemDark.matches ? "dark" : "light");
    }

    function apply(next) {
      document.documentElement.dataset.theme = next;
      toggle.setAttribute("aria-label",
        next === "dark" ? "Switch to light theme" : "Switch to dark theme");
      try { localStorage.setItem("theme", next); } catch (e) { /* storage blocked */ }
    }

    apply(current());

    toggle.addEventListener("click", function () {
      apply(current() === "dark" ? "light" : "dark");
    });
  })();

  /* ---------- Mobile navigation ---------- */
  (function nav() {
    var toggle = document.getElementById("nav-toggle");
    var links = document.getElementById("nav-links");
    if (!toggle || !links) return;

    function close() {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }

    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) close();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("is-open")) {
        close();
        toggle.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (!links.classList.contains("is-open")) return;
      if (!e.target.closest("#nav-links") && !e.target.closest("#nav-toggle")) close();
    });
  })();

  /* ---------- Sticky header shadow + back-to-top ---------- */
  (function scrollChrome() {
    var header = document.getElementById("header");
    var toTop = document.getElementById("to-top");
    var ticking = false;

    function update() {
      var y = window.scrollY;
      if (header) header.classList.toggle("is-stuck", y > 8);
      if (toTop) toTop.classList.toggle("is-visible", y > 600);
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();

    if (toTop) {
      toTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      });
    }
  })();

  /* ---------- Highlight the section you're reading ---------- */
  (function activeNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
    if (!links.length || !("IntersectionObserver" in window)) return;

    var byId = {};
    var sections = [];

    links.forEach(function (link) {
      var id = (link.getAttribute("href") || "").slice(1);
      var section = id && document.getElementById(id);
      if (section) { byId[id] = link; sections.push(section); }
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove("is-active"); });
        var link = byId[entry.target.id];
        if (link) link.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (s) { observer.observe(s); });
  })();

  /* ---------- Reveal on scroll ---------- */
  (function reveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        // Stagger items that come into view together
        entry.target.style.transitionDelay = Math.min(i * 70, 280) + "ms";
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    items.forEach(function (el) { observer.observe(el); });
  })();

  /* ---------- Project filtering ---------- */
  (function filters() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll(".filter"));
    var grid = document.getElementById("projects");
    var empty = document.getElementById("projects-empty");
    if (!buttons.length || !grid) return;

    var projects = Array.prototype.slice.call(grid.querySelectorAll(".project"));

    function applyFilter(value) {
      var shown = 0;

      projects.forEach(function (project) {
        var tags = (project.dataset.tags || "").split(/\s+/);
        var match = value === "all" || tags.indexOf(value) !== -1;
        project.hidden = !match;
        if (match) {
          shown++;
          project.classList.add("is-visible"); // don't re-hide revealed cards
        }
      });

      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.filter === value));
      });

      if (empty) empty.hidden = shown !== 0;
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        applyFilter(button.dataset.filter || "all");
      });
    });
  })();

  /* ---------- Contact form ---------- */
  (function contactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var note = document.getElementById("form-note");

    function setError(name, message) {
      var slot = form.querySelector('[data-error-for="' + name + '"]');
      var input = form.elements[name];
      if (slot) slot.textContent = message || "";
      if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
      return !message;
    }

    function validate() {
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var message = form.elements.message.value.trim();

      var ok = true;
      ok = setError("name", name ? "" : "Please tell me your name.") && ok;
      ok = setError("email",
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? "" : "Please enter a valid email address.") && ok;
      ok = setError("message",
        message.length >= 10 ? "" : "A little more detail, please (10 characters or so).") && ok;

      return ok ? { name: name, email: email, message: message } : null;
    }

    // Clear an error as soon as the visitor starts fixing it
    ["name", "email", "message"].forEach(function (field) {
      var input = form.elements[field];
      if (input) input.addEventListener("input", function () { setError(field, ""); });
    });

    form.addEventListener("submit", function (e) {
      var data = validate();

      if (!data) {
        e.preventDefault();
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // With a form service configured (action="…"), let the browser POST it.
      var mailto = form.dataset.mailto;
      if (!mailto || form.getAttribute("action")) return;

      e.preventDefault();
      var subject = "Portfolio enquiry from " + data.name;
      var body = data.message + "\n\n— " + data.name + " (" + data.email + ")";
      window.location.href = "mailto:" + mailto +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      if (note) note.textContent = "Your email app should be opening now. Thanks for reaching out!";
    });
  })();

  /* ---------- Portrait: swap in a real photo if one exists ---------- */
  (function portrait() {
    var slot = document.querySelector(".hero__portrait");
    if (!slot || slot.querySelector("img")) return;

    var probe = new Image();
    probe.src = "assets/img/portrait.jpg";
    probe.alt = "";
    probe.decoding = "async";
    probe.onload = function () {
      probe.alt = "Portrait photograph";
      slot.innerHTML = "";
      slot.appendChild(probe);
    };
  })();

  /* ---------- Hide the CV button until a resume.pdf exists ---------- */
  (function cvLink() {
    var link = document.getElementById("cv-link");
    if (!link) return;

    // A HEAD request avoids downloading the file just to check it's there.
    fetch(link.getAttribute("href"), { method: "HEAD" })
      .then(function (res) { if (!res.ok) link.remove(); })
      .catch(function () { /* offline or file:// — leave the button alone */ });
  })();

  /* ---------- Footer year ---------- */
  (function year() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  })();
})();
