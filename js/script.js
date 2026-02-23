/* jshint esversion: 6 */
'use strict';

// ============================================================
// THE STITCHING STUDIO — Main JavaScript
// ============================================================

(function () {

  // ----------------------------------------------------------
  // NAVIGATION — Hamburger toggle & active link highlighting
  // ----------------------------------------------------------
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu on nav link click (mobile)
    navLinks.addEventListener('click', function (e) {
      if (e.target.classList.contains('nav-link')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ----------------------------------------------------------
  // NAVBAR SCROLL EFFECT
  // ----------------------------------------------------------
  function handleNavbarScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // ----------------------------------------------------------
  // ACTIVE NAV LINK ON SCROLL
  // ----------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function setActiveNavLink() {
    const scrollY = window.scrollY;
    sections.forEach(function (section) {
      const sectionTop    = section.offsetTop - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId     = section.getAttribute('id');
      const matchingLink  = document.querySelector('.nav-link[href="#' + sectionId + '"]');

      if (matchingLink) {
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
          allNavLinks.forEach(function (l) { l.classList.remove('active'); });
          matchingLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', setActiveNavLink, { passive: true });
  setActiveNavLink();

  // ----------------------------------------------------------
  // SMOOTH SCROLL for anchor links (polyfill for older browsers)
  // ----------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navH = navbar ? navbar.offsetHeight : 70;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ----------------------------------------------------------
  // BACK TO TOP BUTTON
  // ----------------------------------------------------------
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ----------------------------------------------------------
  // GALLERY LIGHTBOX
  // ----------------------------------------------------------
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxCap   = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox) {
    document.querySelectorAll('.gallery-item').forEach(function (item) {
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');

      function openLightbox() {
        const img     = item.querySelector('img');
        const caption = item.querySelector('.gallery-label');
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightboxCap.textContent = caption ? caption.textContent : '';
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden';
          lightboxClose.focus();
        }
      }

      item.addEventListener('click', openLightbox);
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox();
        }
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }

  // ----------------------------------------------------------
  // CONTACT FORM VALIDATION
  // ----------------------------------------------------------
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const formSuccess = document.getElementById('formSuccess');

    function getField(id) {
      return document.getElementById(id);
    }

    function getError(id) {
      return document.getElementById(id + 'Error');
    }

    function showError(fieldId, message) {
      const field = getField(fieldId);
      const error = getError(fieldId);
      if (field)  { field.classList.add('error'); }
      if (error)  { error.textContent = message; }
    }

    function clearError(fieldId) {
      const field = getField(fieldId);
      const error = getError(fieldId);
      if (field)  { field.classList.remove('error'); }
      if (error)  { error.textContent = ''; }
    }

    function validateForm() {
      let valid = true;

      // Name
      const name = getField('name');
      if (!name || !name.value.trim()) {
        showError('name', 'Please enter your full name.');
        valid = false;
      } else {
        clearError('name');
      }

      // Phone
      const phone = getField('phone');
      const phonePattern = /^[+]?[\d\s\-]{10,15}$/;
      if (!phone || !phone.value.trim()) {
        showError('phone', 'Please enter your phone number.');
        valid = false;
      } else if (!phonePattern.test(phone.value.trim())) {
        showError('phone', 'Please enter a valid phone number (10–15 digits).');
        valid = false;
      } else {
        clearError('phone');
      }

      // Email
      const email = getField('email');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !email.value.trim()) {
        showError('email', 'Please enter your email address.');
        valid = false;
      } else if (!emailPattern.test(email.value.trim())) {
        showError('email', 'Please enter a valid email address.');
        valid = false;
      } else {
        clearError('email');
      }

      return valid;
    }

    // Real-time validation on blur
    ['name', 'phone', 'email'].forEach(function (fieldId) {
      const field = getField(fieldId);
      if (field) {
        field.addEventListener('blur', function () {
          validateForm();
        });
        field.addEventListener('input', function () {
          clearError(fieldId);
        });
      }
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm()) {
        // Show success message (static form — no backend)
        if (formSuccess) {
          formSuccess.textContent = '✔ Thank you! Your message has been received. We\'ll contact you shortly.';
        }
        contactForm.reset();
        ['name', 'phone', 'email'].forEach(function (id) { clearError(id); });
      }
    });
  }

  // ----------------------------------------------------------
  // SCROLL ANIMATIONS (Intersection Observer)
  // ----------------------------------------------------------
  if ('IntersectionObserver' in window) {
    const aosObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          aosObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-aos]').forEach(function (el) {
      aosObserver.observe(el);
    });
  } else {
    // Fallback: show all immediately
    document.querySelectorAll('[data-aos]').forEach(function (el) {
      el.classList.add('aos-animate');
    });
  }

})();
