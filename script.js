/* ============================================
   NILESH PATIL — PORTFOLIO JAVASCRIPT
   Features:
   - Smooth scrolling
   - Navbar scroll effect + active link highlighting
   - Mobile hamburger menu
   - Typing text animation
   - Scroll reveal animation
   - Skill bar animation
   - Contact form validation + toast feedback
============================================ */

'use strict';

/* ================================
   1. DOM REFERENCES
================================ */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
const navItems  = document.querySelectorAll('.nav-link');
const typedText = document.getElementById('typedText');
const sections  = document.querySelectorAll('section[id]');
const revEls    = document.querySelectorAll('.reveal');
const skillFills= document.querySelectorAll('.skill-fill');
const contactForm = document.getElementById('contactForm');
const toast       = document.getElementById('toast');

/* ================================
   2. NAVBAR — SCROLL EFFECT
================================ */
function handleNavbarScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

/* ================================
   3. NAVBAR — ACTIVE LINK HIGHLIGHT
   Uses Intersection Observer to know
   which section is in view
================================ */
function highlightActiveLink() {
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop    = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  navItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', () => {
  handleNavbarScroll();
  highlightActiveLink();
}, { passive: true });

/* ================================
   4. MOBILE HAMBURGER MENU
================================ */
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
  // Prevent body scroll when menu is open
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu when a nav link is clicked
navItems.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ================================
   5. SMOOTH SCROLLING
   (CSS scroll-behavior handles most,
   this adds offset for fixed navbar)
================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId  = this.getAttribute('href');
    const targetEl  = document.querySelector(targetId);
    if (!targetEl) return;
    e.preventDefault();

    const navHeight = navbar.offsetHeight;
    const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: targetPos, behavior: 'smooth' });
  });
});

/* ================================
   6. TYPING ANIMATION
================================ */
const typingWords = [
  'Web Developer',
  'Frontend Builder',
  'CS Student',
  'Problem Solver',
  'Creative Coder'
];

let wordIndex   = 0;
let charIndex   = 0;
let isDeleting  = false;
let typingDelay = 120;

function typeWriter() {
  const currentWord = typingWords[wordIndex];

  if (isDeleting) {
    // Erase characters
    typedText.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
    typingDelay = 60;
  } else {
    // Type characters
    typedText.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
    typingDelay = 120;
  }

  // Word fully typed — pause, then delete
  if (!isDeleting && charIndex === currentWord.length) {
    typingDelay = 1800;
    isDeleting  = true;
  }

  // Word fully deleted — move to next word
  if (isDeleting && charIndex === 0) {
    isDeleting  = false;
    wordIndex   = (wordIndex + 1) % typingWords.length;
    typingDelay = 400;
  }

  setTimeout(typeWriter, typingDelay);
}

// Start typing after initial hero animations settle
setTimeout(typeWriter, 1200);

/* ================================
   7. SCROLL REVEAL ANIMATION
   Uses IntersectionObserver for
   performant scroll-triggered reveals
================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children within the same parent
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

// Stagger cards/items inside grids
function assignRevealDelays() {
  const grids = document.querySelectorAll(
    '.skills-grid, .projects-grid, .about-grid, .resume-grid, .contact-grid'
  );
  grids.forEach(grid => {
    const children = grid.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.dataset.delay = i * 100;
    });
  });
}

assignRevealDelays();
revEls.forEach(el => revealObserver.observe(el));

/* ================================
   8. SKILL BARS ANIMATION
   Triggered when skill section
   enters the viewport
================================ */
const skillBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      skillFills.forEach(bar => {
        const targetWidth = bar.getAttribute('data-w');
        // Small delay so the CSS transition is visible
        setTimeout(() => {
          bar.style.width = targetWidth + '%';
        }, 200);
      });
      skillBarObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillBarObserver.observe(skillsSection);

/* ================================
   9. CONTACT FORM VALIDATION
================================ */
function getVal(id)   { return document.getElementById(id).value.trim(); }
function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.previousElementSibling.classList.add('error');
}
function clearError(id) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = '';
    if (el.previousElementSibling) el.previousElementSibling.classList.remove('error');
  }
}

// Real-time validation helpers
['name','email','message'].forEach(field => {
  const input = document.getElementById(field);
  if (!input) return;
  input.addEventListener('input', () => clearError(`${field}Error`));
});

function validateForm() {
  let valid = true;

  // Clear all previous errors
  clearError('nameError');
  clearError('emailError');
  clearError('messageError');

  // Name — required, min 2 chars
  const name = getVal('name');
  if (!name) {
    showError('nameError', '⚠ Please enter your name.');
    valid = false;
  } else if (name.length < 2) {
    showError('nameError', '⚠ Name must be at least 2 characters.');
    valid = false;
  }

  // Email — required, valid format
  const email = getVal('email');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    showError('emailError', '⚠ Please enter your email address.');
    valid = false;
  } else if (!emailRegex.test(email)) {
    showError('emailError', '⚠ Please enter a valid email address.');
    valid = false;
  }

  // Message — required, min 10 chars
  const message = getVal('message');
  if (!message) {
    showError('messageError', '⚠ Please enter a message.');
    valid = false;
  } else if (message.length < 10) {
    showError('messageError', '⚠ Message must be at least 10 characters.');
    valid = false;
  }

  return valid;
}

/* Form submission */
contactForm.addEventListener('submit', function(e) {
  e.preventDefault();

  if (!validateForm()) return;

  // Simulate sending (replace with real backend/API call)
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  setTimeout(() => {
    // Reset form
    contactForm.reset();
    submitBtn.textContent = 'Send Message ➤';
    submitBtn.disabled = false;

    // Show success toast
    showToast();
  }, 1400);
});

/* ================================
   10. TOAST NOTIFICATION
================================ */
function showToast() {
  toast.style.display = 'block';
  // Hide toast after 4 seconds
  setTimeout(() => {
    toast.style.display = 'none';
  }, 4000);
}

/* ================================
   11. INIT — Run on page load
================================ */
handleNavbarScroll();
highlightActiveLink();

// Log a fun message for devs who open the console
console.log('%c👨‍💻 Nilesh Patil — Portfolio', 'color:#00f0ff; font-size:18px; font-weight:bold;');
console.log('%cHey there, fellow developer! Feel free to say hi 👋', 'color:#6b80a3; font-size:12px;');
