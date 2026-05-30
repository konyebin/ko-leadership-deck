(function () {
  "use strict";

  const DURATION = 880;
  const WHEEL_COOLDOWN = 1000;
  const SWIPE_THRESHOLD = 48;

  const stage = document.getElementById("main");
  const sections = Array.from(document.querySelectorAll(".section[data-chapter]"));
  const navLinks = document.querySelectorAll(".chapter-nav a[data-section]");
  const progressFill = document.querySelector(".progress-fill");
  const sceneCurrent = document.querySelector(".scene-current");
  const sceneTotal = document.querySelector(".scene-total");
  const sceneHint = document.querySelector(".scene-hint");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let current = 0;
  let transitioning = false;
  let wheelLocked = false;
  let touchStartY = 0;

  if (sceneTotal) {
    sceneTotal.textContent = String(sections.length).padStart(2, "0");
  }

  function getScrollable(section) {
    return section.querySelector(".section-inner");
  }

  function canScrollDown(el) {
    if (!el) return false;
    return el.scrollHeight - el.clientHeight > 6 && el.scrollTop + el.clientHeight < el.scrollHeight - 6;
  }

  function canScrollUp(el) {
    if (!el) return false;
    return el.scrollTop > 6;
  }

  function revealSection(section) {
    section.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
    section.classList.remove("content-reset");
    void section.offsetWidth;
    section.classList.add("content-animate");
  }

  function updateUI() {
    const section = sections[current];
    const id = section.dataset.chapter;

    navLinks.forEach((link) => {
      const active = link.dataset.section === id;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });

    if (progressFill) {
      const pct = sections.length > 1 ? (current / (sections.length - 1)) * 100 : 100;
      progressFill.style.height = pct + "%";
    }

    if (sceneCurrent) {
      sceneCurrent.textContent = String(current + 1).padStart(2, "0");
    }

    if (sceneHint) {
      sceneHint.textContent = current === sections.length - 1 ? "End · ↑ to revisit" : "Scroll · swipe · ↓";
    }

    stage.dataset.scene = id;
    stage.dataset.index = String(current);
    history.replaceState(null, "", "#" + section.id);
  }

  function goTo(index, direction) {
    index = Math.max(0, Math.min(sections.length - 1, index));
    if (index === current || transitioning) return;

    const dir = direction !== undefined ? direction : index > current ? 1 : -1;
    const from = sections[current];
    const to = sections[index];
    const wait = prefersReducedMotion ? 0 : DURATION;

    transitioning = true;
    stage.classList.toggle("is-backward", dir < 0);
    stage.dataset.direction = dir > 0 ? "forward" : "back";

    from.classList.remove("is-active", "content-animate");
    from.classList.add("is-leaving");

    to.classList.add("is-active");
    const scrollable = getScrollable(to);
    if (scrollable) scrollable.scrollTop = 0;

    window.setTimeout(() => {
      from.classList.remove("is-leaving");
      current = index;
      updateUI();
      revealSection(to);
      transitioning = false;
    }, wait);
  }

  function next() {
    goTo(current + 1, 1);
  }

  function prev() {
    goTo(current - 1, -1);
  }

  function tryAdvance(delta) {
    const scrollable = getScrollable(sections[current]);
    if (delta > 0) {
      if (canScrollDown(scrollable)) return false;
      next();
    } else if (delta < 0) {
      if (canScrollUp(scrollable)) return false;
      prev();
    }
    return true;
  }

  sections.forEach((section, index) => {
    section.classList.toggle("is-active", index === 0);
  });
  revealSection(sections[0]);
  updateUI();

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").slice(1);
      const idx = sections.findIndex((s) => s.id === targetId);
      if (idx >= 0) goTo(idx);
    });
  });

  document.querySelectorAll("[data-scene-next]").forEach((btn) => {
    btn.addEventListener("click", () => next());
  });

  const skipLink = document.querySelector(".skip-link");
  if (skipLink) {
    skipLink.addEventListener("click", (e) => {
      e.preventDefault();
      goTo(1, 1);
    });
  }

  window.addEventListener(
    "wheel",
    (e) => {
      if (transitioning || wheelLocked) return;
      const consumed = tryAdvance(e.deltaY);
      if (consumed) {
        e.preventDefault();
        wheelLocked = true;
        window.setTimeout(() => {
          wheelLocked = false;
        }, WHEEL_COOLDOWN);
      }
    },
    { passive: false }
  );

  window.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    (e) => {
      if (transitioning) return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < SWIPE_THRESHOLD) return;
      tryAdvance(dy);
    },
    { passive: true }
  );

  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) return;

    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      prev();
    } else if (e.key === " " && !e.shiftKey) {
      e.preventDefault();
      next();
    } else if (e.key === " " && e.shiftKey) {
      e.preventDefault();
      prev();
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(sections.length - 1);
    }
  });

  const hash = location.hash.slice(1);
  if (hash) {
    const idx = sections.findIndex((s) => s.id === hash);
    if (idx > 0) goTo(idx);
  }
})();
