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

  /* -----------------------------------------------------------------------
     7. Project modal — data, open/close, gallery navigation
  ----------------------------------------------------------------------- */

  /* Project data: maps data-project-id → title, tags, desc, result, media */
  var PROJECT_DATA = {
    'fire-suppression': {
      title: 'Novel Fire Suppression & Leak Detection In Casting System',
      tags: ['Patent Filed', 'Manufacturing', 'SolidWorks'],
      desc: 'Designed and optimized a novel advanced alloy casting system integrating leak ' +
            'defect detection and fire suppression using SolidWorks for 3D modeling and detailed ' +
            'drawing creation. The system integrates safety mechanisms directly into the casting ' +
            'workflow, reducing response time and improving process safety.',
      resultLabel: 'Result',
      result: 'Patent successfully filed (NDA).',
      media: []  /* Images under NDA -- not available for display */
    },
    'xflex': {
      title: 'X-FLEX Terrain-Capable Compact Lift',
      tags: ['Robotics', 'Computer Vision', 'Python'],
      desc: 'Engineering a miniature scissor lift with hand-tracking capability using MediaPipe, ' +
            'designed to autonomously follow a designated point on the user\'s hand and assist in ' +
            'lifting and transporting heavy loads, demonstrating closed-loop control without ' +
            'additional sensors.',
      resultLabel: 'Result',
      result: 'Autonomous load-following demonstrated.',
      media: [
        {
          type: 'image',
          src: 'assets/X-flex/Image.png',
          caption: 'X-FLEX scissor lift — 3D model'
        },
        {
          type: 'image',
          src: 'assets/X-flex/Design .png',
          caption: 'X-FLEX scissor lift — design drawing'
        }
      ]
    },
    'wobbler': {
      title: 'High-Speed Wobbler Engine',
      tags: ['Machining', 'Sand Casting', 'CAD'],
      desc: 'Modeled and assembled a high-speed wobbler mechanism via manufacturing, sand casting, ' +
            'and tumbling. Produced detailed engineering drawings and performed tolerance analysis ' +
            'to achieve stable operation at high RPM.',
      resultLabel: 'Result',
      result: '2,340 RPM achieved.',
      media: [
        {
          type: 'video',
          src: 'assets/wobbler/Finished.mov',
          caption: 'High-Speed Wobbler Engine — finished running at 2,340 RPM'
        },
        {
          type: 'video',
          src: 'assets/wobbler/Untitled.mov',
          caption: 'Wobbler engine — additional build and test footage'
        },
        {
          type: 'image',
          src: 'assets/wobbler/IMG_5658.JPG',
          caption: 'Wobbler engine — machined components and assembly'
        },
        {
          type: 'image',
          src: 'assets/wobbler/IMG_5660.JPG',
          caption: 'Wobbler engine — precision-toleranced parts'
        },
        {
          type: 'image',
          src: 'assets/wobbler/IMG_5662.jpg',
          caption: 'Wobbler engine — sand cast and tumbled mechanism parts'
        }
      ]
    },
    'rover': {
      title: 'ASME IAM3D R.O.V.E.R Competition',
      tags: ['Competition', '3D Printing', 'ASME'],
      desc: 'Designing and building a Ground Based Remote Controlled Vehicle capable of navigating ' +
            'an obstacle field, meeting strict ASME weight and material constraints. Completed full ' +
            'chassis CAD model in SolidWorks and iterated structural design using 3D-printed ' +
            'prototype components.',
      resultLabel: 'Milestone',
      result: 'Chassis design finalized; prototype components validated.',
      media: []  /* No preview media -- images not yet available for this project */
    }
  };

  /* Modal elements */
  var pmodal        = document.getElementById('pmodal');
  var pmodalMedia   = document.getElementById('pmodalMedia');
  var pmodalNav     = document.getElementById('pmodalNav');
  var pmodalPrev    = document.getElementById('pmodalPrev');
  var pmodalNext    = document.getElementById('pmodalNext');
  var pmodalCounter = document.getElementById('pmodalCounter');
  var pmodalCaption = document.getElementById('pmodalCaption');
  var pmodalThumbs  = document.getElementById('pmodalThumbs');
  var pmodalTags    = document.getElementById('pmodalTags');
  var pmodalTitle   = document.getElementById('pmodalTitle');
  var pmodalDesc    = document.getElementById('pmodalDesc');
  var pmodalResult  = document.getElementById('pmodalResult');
  var pmodalClose   = document.getElementById('pmodalClose');
  var pmodalBackdrop = document.getElementById('pmodalBackdrop');

  var currentMedia  = [];
  var currentIndex  = 0;

  /* Render one media item into the main display area */
  function renderMedia(index) {
    var item = currentMedia[index];
    if (!item) return;

    /* Stop any previous video */
    var oldVideo = pmodalMedia.querySelector('video');
    if (oldVideo) { oldVideo.pause(); }

    pmodalMedia.innerHTML = '';

    if (item.type === 'video') {
      var vid = document.createElement('video');
      vid.src = item.src;
      vid.controls = true;
      vid.muted = false;
      vid.playsInline = true;
      vid.setAttribute('aria-label', item.caption);
      vid.style.width = '100%';
      vid.style.height = '100%';
      pmodalMedia.appendChild(vid);
    } else {
      var img = document.createElement('img');
      img.src = item.src;
      img.alt = item.caption;
      pmodalMedia.appendChild(img);
    }

    pmodalCaption.textContent = item.caption;

    /* Update counter */
    pmodalCounter.textContent = (index + 1) + ' / ' + currentMedia.length;

    /* Update active thumb */
    pmodalThumbs.querySelectorAll('.pmodal__thumb').forEach(function (th, i) {
      th.classList.toggle('pmodal__thumb--active', i === index);
    });

    currentIndex = index;
  }

  /* Build and open the modal for a given project id */
  function openModal(projectId) {
    var data = PROJECT_DATA[projectId];
    if (!data) return;

    currentMedia = data.media;
    currentIndex = 0;

    /* Tags */
    pmodalTags.innerHTML = '';
    data.tags.forEach(function (tag) {
      var span = document.createElement('span');
      span.className = 'tag';
      span.textContent = tag;
      pmodalTags.appendChild(span);
    });

    /* Title, desc, result */
    pmodalTitle.textContent = data.title;
    pmodalDesc.textContent  = data.desc;
    pmodalResult.innerHTML  = '<span class="result-label">' + data.resultLabel + ':</span> ' + data.result;

    /* Show or hide the gallery column depending on whether media exists */
    var galleryEl = pmodalMedia.closest('.pmodal__gallery');
    if (currentMedia.length === 0) {
      if (galleryEl) { galleryEl.hidden = true; }
      pmodalNav.hidden = true;
      pmodalMedia.innerHTML = '';
      pmodalThumbs.innerHTML = '';
      pmodalCaption.textContent = '';
    } else {
      if (galleryEl) { galleryEl.hidden = false; }

      /* Thumbnails */
      pmodalThumbs.innerHTML = '';
      currentMedia.forEach(function (item, i) {
        var thumb = document.createElement('div');
        thumb.className = 'pmodal__thumb' + (item.type === 'video' ? ' pmodal__thumb--video' : '');
        thumb.setAttribute('aria-label', 'Media ' + (i + 1));
        thumb.setAttribute('role', 'button');
        thumb.setAttribute('tabindex', '0');

        if (item.type === 'video') {
          var tv = document.createElement('video');
          tv.src = item.src;
          tv.muted = true;
          tv.playsInline = true;
          thumb.appendChild(tv);
        } else {
          var ti = document.createElement('img');
          ti.src = item.src;
          ti.alt = '';
          thumb.appendChild(ti);
        }

        thumb.addEventListener('click', function () { renderMedia(i); });
        thumb.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); renderMedia(i); }
        });
        pmodalThumbs.appendChild(thumb);
      });

      /* Show / hide nav arrows */
      pmodalNav.hidden = (currentMedia.length <= 1);

      /* Render first item */
      renderMedia(0);
    }

    /* Show modal */
    pmodal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    /* Focus close button */
    pmodalClose.focus();
  }

  function closeModal() {
    /* Stop any playing video */
    var vid = pmodalMedia.querySelector('video');
    if (vid) { vid.pause(); }

    pmodal.setAttribute('hidden', '');
    document.body.style.overflow = '';

    /* Return focus to the card that opened the modal */
    if (lastFocusedCard) { lastFocusedCard.focus(); }
  }

  /* Nav buttons */
  pmodalPrev.addEventListener('click', function () {
    var i = (currentIndex - 1 + currentMedia.length) % currentMedia.length;
    renderMedia(i);
  });
  pmodalNext.addEventListener('click', function () {
    var i = (currentIndex + 1) % currentMedia.length;
    renderMedia(i);
  });

  /* Close via button or backdrop */
  pmodalClose.addEventListener('click', closeModal);
  pmodalBackdrop.addEventListener('click', closeModal);

  /* Keyboard: Escape = close, arrow keys = navigate */
  document.addEventListener('keydown', function (e) {
    if (pmodal.hasAttribute('hidden')) return;

    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowLeft') {
      var i = (currentIndex - 1 + currentMedia.length) % currentMedia.length;
      renderMedia(i);
    } else if (e.key === 'ArrowRight') {
      var i = (currentIndex + 1) % currentMedia.length;
      renderMedia(i);
    }
  });

  /* Wire up project cards */
  var lastFocusedCard = null;

  document.querySelectorAll('.project-card[data-project-id]').forEach(function (card) {
    function handleOpen(e) {
      /* Don't open if user clicked a link or button inside the card */
      if (e.target.closest('a, button')) return;
      lastFocusedCard = card;
      openModal(card.dataset.projectId);
    }

    card.addEventListener('click', handleOpen);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        lastFocusedCard = card;
        openModal(card.dataset.projectId);
      }
    });
  });

}());
