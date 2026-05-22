(function () {
  "use strict";

  const sections = document.querySelectorAll(".section[data-chapter]");
  const navLinks = document.querySelectorAll(".chapter-nav a[data-section]");
  const progressFill = document.querySelector(".progress-fill");
  const reveals = document.querySelectorAll(".reveal");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // IntersectionObserver: reveal on scroll
  if (!prefersReducedMotion && reveals.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    reveals.forEach((el) => revealObserver.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  // Active nav + scroll progress
  function setActiveChapter(id) {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.section === id);
    });
  }

  function updateProgress() {
    if (!progressFill) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressFill.style.height = pct + "%";
  }

  if (sections.length && !prefersReducedMotion) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveChapter(entry.target.dataset.chapter);
          }
        });
      },
      { root: null, rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    sections.forEach((s) => sectionObserver.observe(s));
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Keyboard navigation between sections
  const chapterIds = Array.from(sections).map((s) => s.id);

  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    const idx = chapterIds.indexOf(
      document.querySelector(".section[data-chapter]:target")?.id ||
        getCurrentChapter()
    );
    let next = idx;
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      next = Math.min(idx + 1, chapterIds.length - 1);
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      next = Math.max(idx - 1, 0);
    } else return;
    const el = document.getElementById(chapterIds[next]);
    if (el) el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  function getCurrentChapter() {
    let current = chapterIds[0];
    const mid = window.scrollY + window.innerHeight * 0.4;
    sections.forEach((s) => {
      if (s.offsetTop <= mid) current = s.id;
    });
    return current;
  }

  // Smooth scroll for nav clicks (enhance native # anchors)
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
        history.pushState(null, "", href);
      }
    });
  });

  setActiveChapter(chapterIds[0] || "hero");
})();
