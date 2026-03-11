// ════════════════════════════════════════════════
//  Sanket | Web Developer Portfolio — script.js
// ════════════════════════════════════════════════
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initSkillBars();
  initProjectFilter();
  initContactForm();
});

/* ── 1. Navbar ─────────────────────────────────── */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const links     = navLinks.querySelectorAll('.nav-link');

  /* Scroll → shadow + scrolled class */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* Hamburger toggle */
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  /* Close nav on any link click */
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  /* Active nav link highlight on scroll */
  const sections = document.querySelectorAll('section[id]');

  const sObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => sObs.observe(s));
}

/* ── 2. Scroll Reveal ──────────────────────────── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => obs.observe(el));
}

/* ── 3. Skill Bars ─────────────────────────────── */
function initSkillBars() {
  const fills = document.querySelectorAll('.bar-fill');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const w  = el.getAttribute('data-w') || '0';
        // Slight delay so reveal animation plays first
        setTimeout(() => { el.style.width = w + '%'; }, 250);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(f => obs.observe(f));
}

/* ── 4. Project Filter ─────────────────────────── */
function initProjectFilter() {
  const btns  = document.querySelectorAll('.fbtn');
  const cards = document.querySelectorAll('.proj-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      /* Update active button */
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      /* Show / hide cards */
      cards.forEach(card => {
        const tags = card.getAttribute('data-tags') || '';
        const show = filter === 'all' || tags.split(' ').includes(filter);

        if (show) {
          card.classList.remove('hidden');
          /* Re-trigger visible for animation */
          card.classList.remove('visible');
          void card.offsetWidth; // reflow
          card.classList.add('visible');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ── 5. Contact Form ───────────────────────────── */
function initContactForm() {
  const form      = document.getElementById('contactForm');
  const msgBox    = document.getElementById('formMsg');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  /* Real-time validation feedback */
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => liveValidate(input));
    input.addEventListener('input', () => {
      input.classList.remove('invalid');
      if (input.value.trim()) input.classList.add('valid');
      else input.classList.remove('valid');
    });
  });

  /* Submit */
  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = document.getElementById('fname').value.trim();
    const email   = document.getElementById('femail').value.trim();
    const subject = document.getElementById('fsubject').value.trim();
    const msg     = document.getElementById('fmsg').value.trim();

    /* Reset */
    hideMsg();

    /* Validate */
    if (!name || !email || !subject || !msg) {
      showMsg('err', '⚠️ Please fill in all required fields.');
      /* Highlight empty fields */
      [
        { id: 'fname',    val: name },
        { id: 'femail',   val: email },
        { id: 'fsubject', val: subject },
        { id: 'fmsg',     val: msg },
      ].forEach(({ id, val }) => {
        const el = document.getElementById(id);
        if (!val) el.classList.add('invalid');
      });
      return;
    }

    if (!validEmail(email)) {
      showMsg('err', '⚠️ Please enter a valid email address.');
      document.getElementById('femail').classList.add('invalid');
      return;
    }

    /* Simulate sending */
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Send Message →';
      showMsg('ok', `✅ Thanks, ${name}! Your message has been sent. I'll get back to you soon.`);
      form.reset();
      inputs.forEach(i => i.classList.remove('valid', 'invalid'));
    }, 1600);
  });

  function liveValidate(input) {
    if (!input.value.trim()) {
      input.classList.add('invalid');
      input.classList.remove('valid');
    } else if (input.type === 'email' && !validEmail(input.value)) {
      input.classList.add('invalid');
      input.classList.remove('valid');
    } else {
      input.classList.remove('invalid');
      input.classList.add('valid');
    }
  }

  function showMsg(type, text) {
    msgBox.textContent = text;
    msgBox.className   = `form-msg show ${type}`;
  }
  function hideMsg() {
    msgBox.textContent = '';
    msgBox.className   = 'form-msg';
  }
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
