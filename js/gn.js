/* ═══════════════════════════════════════════════════════════════════════
   GOING NUTS — GN.JS
   VERSION 0: INTERACTIVE WEBSITE SKELETON
   ═══════════════════════════════════════════════════════════════════════ */

'use strict';

(function () {

  /* ── Mobile Navigation ───────────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger-btn');
  const mobileNav  = document.getElementById('mobile-nav');
  const navOverlay = document.getElementById('nav-overlay');
  const navClose   = document.getElementById('nav-close-btn');

  function openNav() {
    mobileNav.classList.add('is-open');
    mobileNav.setAttribute('aria-hidden', 'false');
    hamburger && hamburger.setAttribute('aria-expanded', 'true');
    hamburger && hamburger.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('aria-hidden', 'true');
    hamburger && hamburger.setAttribute('aria-expanded', 'false');
    hamburger && hamburger.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  hamburger  && hamburger.addEventListener('click', openNav);
  navClose   && navClose.addEventListener('click', closeNav);
  navOverlay && navOverlay.addEventListener('click', closeNav);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('is-open')) {
      closeNav();
    }
  });


  /* ── Active Nav Link ─────────────────────────────────────────────── */
  (function setActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.c-header__nav a, .c-mobile-nav__links a');
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href') || '';
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('is-active');
      }
    });
  })();


  /* ── FAQ Accordion ───────────────────────────────────────────────── */
  const faqTriggers = document.querySelectorAll('.c-faq-item__trigger');

  faqTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const isOpen   = trigger.getAttribute('aria-expanded') === 'true';
      const bodyId   = trigger.getAttribute('aria-controls');
      const body     = document.getElementById(bodyId);

      /* Close all others first */
      faqTriggers.forEach(function (t) {
        if (t !== trigger) {
          t.setAttribute('aria-expanded', 'false');
          const bId = t.getAttribute('aria-controls');
          const b   = bId && document.getElementById(bId);
          if (b) b.classList.remove('is-open');
        }
      });

      /* Toggle current */
      if (isOpen) {
        trigger.setAttribute('aria-expanded', 'false');
        body && body.classList.remove('is-open');
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        body && body.classList.add('is-open');
      }
    });
  });

  /* Open first FAQ item by default */
  if (faqTriggers.length > 0) {
    faqTriggers[0].setAttribute('aria-expanded', 'true');
    const firstBodyId = faqTriggers[0].getAttribute('aria-controls');
    const firstBody = firstBodyId && document.getElementById(firstBodyId);
    if (firstBody) firstBody.classList.add('is-open');
  }


  /* ── Work Category Filters ───────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.c-filter-btn');
  const workCards  = document.querySelectorAll('.c-work-card[data-category]');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const cat = btn.dataset.filter;

      /* Update active button */
      filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');

      /* Filter cards */
      workCards.forEach(function (card) {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = '';
          card.style.animation = 'fadeIn 0.25s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  /* ── Smooth Scroll for anchor links ─────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ── Header scroll shadow ────────────────────────────────────────── */
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 2px 12px rgba(13,14,12,0.12)';
      } else {
        header.style.boxShadow = '';
      }
    }, { passive: true });
  }


  /* ── Simple fade-in animation ────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = '@keyframes fadeIn { from { opacity:0; transform:translateY(8px);} to { opacity:1; transform:none; } }';
  document.head.appendChild(style);


})();


/* ── Tab system ──────────────────────────────────────────────────────────
   Drives .c-tabs / .c-tab-btn / .c-tab-panel
   Desktop: panels always show (CSS overrides). Mobile: only active shows.
   ─────────────────────────────────────────────────────────────────────── */
(function () {
  document.querySelectorAll('.c-tabs').forEach(function (tabSet) {
    var btns   = Array.from(tabSet.querySelectorAll('.c-tab-btn'));
    var panels = Array.from(tabSet.querySelectorAll('.c-tab-panel'));
    if (!btns.length || !panels.length) return;

    function activate(i) {
      btns.forEach(function (b, j) {
        b.classList.toggle('is-active', j === i);
        b.setAttribute('aria-selected', String(j === i));
      });
      panels.forEach(function (p, j) {
        p.classList.toggle('is-active', j === i);
      });
    }
    activate(0);
    btns.forEach(function (btn, i) {
      btn.addEventListener('click', function () { activate(i); });
    });
  });
}());


/* ── Collapsible panels ──────────────────────────────────────────────────
   Drives .c-collapse__trigger / .c-collapse__body (id via aria-controls)
   Desktop: body always visible (CSS). Mobile: toggle.
   ─────────────────────────────────────────────────────────────────────── */
(function () {
  document.querySelectorAll('.c-collapse__trigger').forEach(function (trigger) {
    var targetId = trigger.getAttribute('aria-controls');
    var body = targetId ? document.getElementById(targetId) : trigger.nextElementSibling;
    if (!body) return;
    trigger.addEventListener('click', function () {
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      body.classList.toggle('is-open', !isOpen);
    });
  });
}());
