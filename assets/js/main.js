/* ==========================================================================
   VEER SANGHVI — PORTFOLIO · main.js
   Vanilla JS: nav scroll behaviour, mobile menu, skill bar animation,
   scroll-reveal, active nav link highlighting, footer year.
   ========================================================================== */

(function () {
  'use strict';

  /* -----------------------------------------------------------------------
     Utility: throttle
  ----------------------------------------------------------------------- */
  function throttle(fn, wait) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn.apply(this, args);
      }
    };
  }

  /* -----------------------------------------------------------------------
     1. Dynamic footer year
  ----------------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* -----------------------------------------------------------------------
     2. Nav: scroll shadow + active-link highlighting
  ----------------------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__links a');
  const sections = document.querySelectorAll('main section[id]');

  function updateNav() {
    const scrollY = window.scrollY;

    /* Add shadow when scrolled */
    nav.classList.toggle('nav--scrolled', scrollY > 20);

    /* Highlight the active section link */
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 100;
      if (scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + current
      );
    });
  }

  window.addEventListener('scroll', throttle(updateNav, 80));
  updateNav(); /* Run once on load */

  /* -----------------------------------------------------------------------
     3. Mobile menu toggle
  ----------------------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');

  if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinksContainer.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    /* Close menu when a nav link is clicked */
    navLinksContainer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinksContainer.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    /* Close menu when clicking outside */
    document.addEventListener('click', function (e) {
      if (
        navLinksContainer.classList.contains('open') &&
        !nav.contains(e.target)
      ) {
        navLinksContainer.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* -----------------------------------------------------------------------
     4. Skill bar animation — retained for progressive enhancement if bars
        are ever re-added; skips gracefully when no .skill-bar__fill exist.
  ----------------------------------------------------------------------- */
  const skillFills = document.querySelectorAll('.skill-bar__fill');

  if ('IntersectionObserver' in window && skillFills.length) {
    const skillObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const fill = entry.target;
            const targetWidth = fill.dataset.width || '0';
            /* Small delay for a staggered feel when multiple bars enter */
            setTimeout(function () {
              fill.style.width = targetWidth + '%';
            }, 100);
            skillObserver.unobserve(fill);
          }
        });
      },
      { threshold: 0.3 }
    );

    skillFills.forEach(function (fill) {
      skillObserver.observe(fill);
    });
  } else {
    /* Fallback: set widths immediately */
    skillFills.forEach(function (fill) {
      fill.style.width = (fill.dataset.width || '0') + '%';
    });
  }

  /* -----------------------------------------------------------------------
     5. Scroll-reveal for general page elements
  ----------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* -----------------------------------------------------------------------
     6. Smooth-scroll polyfill for browsers that lack CSS scroll-behavior
        (already handled by HTML scroll-behavior: smooth, but let's ensure
        older Safari compatibility via JS for anchor clicks)
  ----------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '64',
        10
      );
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

}());
