/* ═══════════════════════════════════════════════
   Jain Decoration & Mandap – script.js
═══════════════════════════════════════════════ */

/* ── DOM ready ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initReveal();
  initGalleryFilter();
  initLightbox();
  initActiveNavLinks();
});

/* ══════════════════════════════════════════════
   NAVBAR – sticky scroll style
══════════════════════════════════════════════ */
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const topbar  = document.getElementById('topbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ══════════════════════════════════════════════
   MOBILE MENU toggle
══════════════════════════════════════════════ */
function initMobileMenu() {
  const btn  = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', String(!open));
  });
}

function closeMobile() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.add('hidden');
}
window.closeMobile = closeMobile;

/* ══════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════ */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings within the same parent
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════
   GALLERY FILTER
══════════════════════════════════════════════ */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items      = document.querySelectorAll('.gallery-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      items.forEach(item => {
        if (filter === 'all' || item.dataset.cat === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* ══════════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════════ */
let lightboxImages   = [];
let lightboxCurrent  = 0;

function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  // Close on backdrop click
  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowRight')  lightboxNav(1);
    if (e.key === 'ArrowLeft')   lightboxNav(-1);
  });
}

function openLightbox(el) {
  const img = el.querySelector ? el.querySelector('img') : el;
  if (!img) return;

  // Collect all images from the same photo-grid or gallery-masonry
  const parent = img.closest('.photo-grid') || img.closest('.gallery-masonry');
  if (parent) {
    lightboxImages = Array.from(parent.querySelectorAll('img'));
  } else {
    lightboxImages = [img];
  }

  lightboxCurrent = lightboxImages.indexOf(img);
  if (lightboxCurrent < 0) lightboxCurrent = 0;

  showLightboxImage(lightboxCurrent);

  const lb = document.getElementById('lightbox');
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}
window.openLightbox = openLightbox;

function showLightboxImage(idx) {
  const lbImg     = document.getElementById('lightboxImg');
  const lbCaption = document.getElementById('lightboxCaption');
  if (!lbImg) return;

  const img = lightboxImages[idx];
  lbImg.src = img.src;
  lbImg.alt = img.alt || '';

  if (lbCaption) {
    lbCaption.textContent = img.alt
      ? `${img.alt}  (${idx + 1} / ${lightboxImages.length})`
      : `${idx + 1} / ${lightboxImages.length}`;
  }
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('active');
  document.body.style.overflow = '';
}
window.closeLightbox = closeLightbox;

function lightboxNav(dir) {
  lightboxCurrent = (lightboxCurrent + dir + lightboxImages.length) % lightboxImages.length;
  showLightboxImage(lightboxCurrent);
}
window.lightboxNav = lightboxNav;

/* ══════════════════════════════════════════════
   ACTIVE NAV LINK on scroll
══════════════════════════════════════════════ */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--gold)';
          } else {
            link.style.color = '';
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

/* ══════════════════════════════════════════════
   SMOOTH scroll polyfill for older Safari
══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
