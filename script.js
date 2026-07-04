// ===================== HEADER =====================
const header = document.getElementById('siteHeader');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
  scrollTopBtn.classList.toggle('show', window.scrollY > 500);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===================== MOBILE NAV =====================
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle?.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});
mainNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

// ===================== SCROLL TOP =====================
const scrollTopBtn = document.getElementById('scrollTop');
scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===================== SCROLL REVEAL =====================
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// ===================== HERO 3D TILT =====================
const heroStage = document.getElementById('heroStage');
const heroMedia = document.querySelector('.hero-media');
if (heroStage && heroMedia) {
  heroMedia.addEventListener('mousemove', (e) => {
    const rect = heroMedia.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroStage.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
  });
  heroMedia.addEventListener('mouseleave', () => {
    heroStage.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}

// ===================== CARD TILT (specialties) =====================
document.querySelectorAll('.specialty-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateY(0) rotateX(0) translateY(0)';
  });
});

// ===================== ABOUT PHOTO TILT =====================
const aboutWrap = document.querySelector('.about-photo-wrap');
const aboutMedia = document.querySelector('.about-media');
if (aboutWrap && aboutMedia) {
  aboutMedia.addEventListener('mousemove', (e) => {
    const r = aboutMedia.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    aboutWrap.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
  });
  aboutMedia.addEventListener('mouseleave', () => {
    aboutWrap.style.transform = 'rotateY(0) rotateX(0)';
  });
}

// ===================== GALLERY FILTER =====================
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hide', !match);
    });
  });
});

// dropdown links also trigger filters
document.querySelectorAll('[data-filter]').forEach(link => {
  if (link.classList.contains('filter-btn')) return;
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const filter = link.dataset.filter;
    const targetBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
    if (targetBtn) targetBtn.click();
    document.getElementById('portafolio')?.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===================== LIGHTBOX =====================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCounter = document.getElementById('lightboxCounter');
let visibleItems = [];
let currentIndex = 0;

function refreshVisibleItems() {
  visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('hide'));
}

function openLightbox(item) {
  refreshVisibleItems();
  currentIndex = visibleItems.indexOf(item);
  showLightboxImage();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
function showLightboxImage() {
  const item = visibleItems[currentIndex];
  if (!item) return;
  const img = item.querySelector('img');
  lightboxImg.src = img.dataset.full || img.src;
  lightboxImg.alt = img.alt;
  lightboxCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
}
function nextImage() { refreshVisibleItems(); currentIndex = (currentIndex + 1) % visibleItems.length; showLightboxImage(); }
function prevImage() { refreshVisibleItems(); currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length; showLightboxImage(); }

galleryItems.forEach(item => item.addEventListener('click', () => openLightbox(item)));
document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
document.getElementById('lightboxNext')?.addEventListener('click', nextImage);
document.getElementById('lightboxPrev')?.addEventListener('click', prevImage);
lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft') prevImage();
});

// ===================== TESTIMONIAL SLIDER =====================
const track = document.getElementById('testimonialTrack');
const dots = document.querySelectorAll('.dot');
const slides = document.querySelectorAll('.testimonial-card');
let slideIndex = 0;
let slideTimer;

function goToSlide(i) {
  slideIndex = (i + slides.length) % slides.length;
  track.style.transform = `translateX(-${slideIndex * 100}%)`;
  dots.forEach((d, idx) => d.classList.toggle('active', idx === slideIndex));
}
document.getElementById('nextTestimonial')?.addEventListener('click', () => { goToSlide(slideIndex + 1); restartAutoplay(); });
document.getElementById('prevTestimonial')?.addEventListener('click', () => { goToSlide(slideIndex - 1); restartAutoplay(); });
dots.forEach((d, idx) => d.addEventListener('click', () => { goToSlide(idx); restartAutoplay(); }));

function restartAutoplay() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => goToSlide(slideIndex + 1), 5500);
}
if (slides.length) {
  track.style.display = 'flex';
  track.style.transition = 'transform .6s cubic-bezier(.19,1,.22,1)';
  restartAutoplay();
}

// ===================== HERO PARTICLES CANVAS =====================
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const colors = ['#ff2d78', '#b83bff', '#29e0ff', '#ffce45'];

  function resize() {
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
  }
  function initParticles() {
    const count = Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 26000);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: (Math.random() * 2 + 1) * devicePixelRatio,
      vx: (Math.random() - 0.5) * 0.35 * devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.35 * devicePixelRatio,
      c: colors[Math.floor(Math.random() * colors.length)],
      a: Math.random() * 0.5 + 0.2,
    }));
  }
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = p.a;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }
  window.addEventListener('resize', () => { resize(); initParticles(); });
  resize(); initParticles(); tick();
}

// ===================== ACTIVE NAV ON SCROLL =====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.main-nav > a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 140;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}, { passive: true });
