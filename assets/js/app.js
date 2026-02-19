const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open');
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    if (navLinks) navLinks.classList.remove('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    galleryItems.forEach((item) => {
      const category = item.dataset.category;
      const shouldShow = filter === 'all' || category === filter;
      item.hidden = !shouldShow;
    });
  });
});

const galleryTriggers = Array.from(document.querySelectorAll('.gallery-trigger'));

function markMissingImages() {
  galleryTriggers.forEach((trigger) => {
    const img = trigger.querySelector('img');
    const testImage = new Image();
    testImage.onload = () => trigger.classList.remove('missing');
    testImage.onerror = () => trigger.classList.add('missing');
    testImage.src = img.src;
  });
}

const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox.querySelector('.lightbox-image');
const closeBtn = lightbox.querySelector('.lightbox-close');
const prevBtn = lightbox.querySelector('.prev');
const nextBtn = lightbox.querySelector('.next');

let activeIndex = 0;

function openLightbox(index) {
  const trigger = galleryTriggers[index];
  if (!trigger || trigger.classList.contains('missing') || trigger.closest('.gallery-item').hidden) return;
  activeIndex = index;
  lightboxImage.src = trigger.dataset.src;
  lightboxImage.alt = trigger.dataset.alt;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
}

function move(step) {
  const visibleIndexes = galleryTriggers
    .map((trigger, index) => ({ trigger, index }))
    .filter(({ trigger }) => !trigger.classList.contains('missing') && !trigger.closest('.gallery-item').hidden)
    .map(({ index }) => index);

  if (!visibleIndexes.length) return;

  const currentVisiblePosition = Math.max(0, visibleIndexes.indexOf(activeIndex));
  const nextPosition = (currentVisiblePosition + step + visibleIndexes.length) % visibleIndexes.length;
  openLightbox(visibleIndexes[nextPosition]);
}

galleryTriggers.forEach((trigger, index) => {
  trigger.addEventListener('click', () => openLightbox(index));
});

closeBtn.addEventListener('click', closeLightbox);
prevBtn.addEventListener('click', () => move(-1));
nextBtn.addEventListener('click', () => move(1));

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowRight') move(1);
  if (event.key === 'ArrowLeft') move(-1);
});

markMissingImages();
