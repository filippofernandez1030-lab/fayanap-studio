// ===================== HEADER =====================
const header = document.getElementById('siteHeader');
const scrollTopBtn = document.getElementById('scrollTop');
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

// ===================== CURSOR SPOTLIGHT GLOW =====================
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow) {
  let glowTargetX = window.innerWidth / 2, glowTargetY = window.innerHeight / 2;
  let glowX = glowTargetX, glowY = glowTargetY;
  window.addEventListener('mousemove', (e) => {
    glowTargetX = e.clientX; glowTargetY = e.clientY;
    cursorGlow.classList.add('active');
  }, { passive: true });
  document.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
  function tickGlow() {
    glowX += (glowTargetX - glowX) * 0.12;
    glowY += (glowTargetY - glowY) * 0.12;
    cursorGlow.style.transform = `translate(${glowX - 300}px, ${glowY - 300}px)`;
    requestAnimationFrame(tickGlow);
  }
  tickGlow();
}

// ===================== MESH BACKGROUND PARALLAX =====================
const meshBlobs = document.querySelectorAll('.mesh-bg span');
window.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth - 0.5;
  const y = e.clientY / window.innerHeight - 0.5;
  meshBlobs.forEach((blob, i) => {
    const depth = (i + 1) * 14;
    blob.style.setProperty('--px', `${x * depth}px`);
    blob.style.setProperty('--py', `${y * depth}px`);
  });
}, { passive: true });

// ===================== SCROLL PARALLAX (background blobs) =====================
let parallaxTicking = false;
function applyScrollParallax() {
  const sy = window.scrollY;
  const blobOffset = Math.min(sy * 0.06, 80);
  meshBlobs.forEach(blob => blob.style.setProperty('--sy', `${blobOffset}px`));
  parallaxTicking = false;
}
window.addEventListener('scroll', () => {
  if (!parallaxTicking) {
    requestAnimationFrame(applyScrollParallax);
    parallaxTicking = true;
  }
}, { passive: true });
applyScrollParallax();

// ===================== GALLERY ITEM 3D TILT + GLARE =====================
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const r = item.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    item.style.setProperty('--mx', `${x * 100}%`);
    item.style.setProperty('--my', `${y * 100}%`);
    const rotY = (x - 0.5) * 16;
    const rotX = (0.5 - y) * 16;
    item.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.03)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});

// ===================== GALLERY SCROLL 3D REVEAL =====================
const galleryReveal = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = (Array.from(el.parentNode.children).indexOf(el) % 4) * 90;
      setTimeout(() => el.classList.add('in'), delay);
      galleryReveal.unobserve(el);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.gallery-item').forEach(el => galleryReveal.observe(el));

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
let lightboxList = [];
let currentIndex = 0;
let lightboxIsGrid = false;

function getGridList() {
  return Array.from(galleryItems).filter(item => !item.classList.contains('hide')).map(item => {
    const img = item.querySelector('img');
    return { full: img.dataset.full || img.src, alt: img.alt };
  });
}

function openLightboxUI() {
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function openLightboxFromGrid(item) {
  lightboxIsGrid = true;
  const list = getGridList();
  const img = item.querySelector('img');
  const full = img.dataset.full || img.src;
  currentIndex = list.findIndex(x => x.full === full);
  lightboxList = list;
  showLightboxImage();
  openLightboxUI();
}
function openLightboxFromList(list, index) {
  lightboxIsGrid = false;
  lightboxList = list;
  currentIndex = index;
  showLightboxImage();
  openLightboxUI();
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
function showLightboxImage() {
  if (lightboxIsGrid) lightboxList = getGridList();
  const item = lightboxList[currentIndex];
  if (!item) return;
  lightboxImg.classList.remove('pop');
  void lightboxImg.offsetWidth;
  lightboxImg.classList.add('pop');
  lightboxImg.src = item.full;
  lightboxImg.alt = item.alt;
  lightboxCounter.textContent = `${currentIndex + 1} / ${lightboxList.length}`;
}
function nextImage() {
  if (lightboxIsGrid) lightboxList = getGridList();
  currentIndex = (currentIndex + 1) % lightboxList.length;
  showLightboxImage();
}
function prevImage() {
  if (lightboxIsGrid) lightboxList = getGridList();
  currentIndex = (currentIndex - 1 + lightboxList.length) % lightboxList.length;
  showLightboxImage();
}

galleryItems.forEach(item => item.addEventListener('click', () => openLightboxFromGrid(item)));
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

// ===================== TESTIMONIAL 3D DEPTH CAROUSEL =====================
const dots = document.querySelectorAll('.dot');
const slides = Array.from(document.querySelectorAll('.testimonial-card'));
let slideIndex = 0;
let slideTimer;

function layoutTestimonials() {
  const n = slides.length;
  slides.forEach((el, i) => {
    let diff = i - slideIndex;
    if (diff > n / 2) diff -= n;
    if (diff < -n / 2) diff += n;
    const abs = Math.abs(diff);
    const tx = diff * 340;
    const tz = -abs * 200;
    const rot = diff * -22;
    const scale = Math.max(1 - abs * 0.14, 0.72);
    const opacity = abs > 1 ? 0 : 1 - abs * 0.45;
    el.style.transform = `translateX(calc(-50% + ${tx}px)) translateZ(${tz}px) rotateY(${rot}deg) scale(${scale})`;
    el.style.opacity = opacity;
    el.style.zIndex = 100 - abs;
    el.style.pointerEvents = diff === 0 ? 'auto' : 'none';
    el.classList.toggle('is-active', diff === 0);
  });
  dots.forEach((d, idx) => d.classList.toggle('active', idx === slideIndex));
}

function goToSlide(i) {
  slideIndex = (i + slides.length) % slides.length;
  layoutTestimonials();
}
document.getElementById('nextTestimonial')?.addEventListener('click', () => { goToSlide(slideIndex + 1); restartAutoplay(); });
document.getElementById('prevTestimonial')?.addEventListener('click', () => { goToSlide(slideIndex - 1); restartAutoplay(); });
dots.forEach((d, idx) => d.addEventListener('click', () => { goToSlide(idx); restartAutoplay(); }));

function restartAutoplay() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => goToSlide(slideIndex + 1), 5500);
}
if (slides.length) {
  layoutTestimonials();
  restartAutoplay();
  const testimonialSliderEl = document.querySelector('.testimonial-slider');
  testimonialSliderEl?.addEventListener('mouseenter', () => clearInterval(slideTimer));
  testimonialSliderEl?.addEventListener('mouseleave', restartAutoplay);
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

// ===================== TUNEL 3D DE SCROLL =====================
const tunnelViewport = document.getElementById('tunnelViewport');
const tunnelWorld = document.getElementById('tunnelWorld');
const tunnelSpacer = document.getElementById('tunnelSpacer');
const scrollCue = document.getElementById('scrollCue');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (tunnelViewport && tunnelWorld && tunnelSpacer && !reduceMotion) {
  const Z_SCALE = 0.5;
  const FADE_IN_START = -900, FADE_IN_END = -350;
  const FADE_OUT_START = -60, FADE_OUT_END = 260;

  const tunnelNodes = Array.from(tunnelWorld.querySelectorAll('.tunnel-node')).map(el => ({
    el,
    baseZ: parseFloat(el.dataset.z) || 0,
    x: parseFloat(el.dataset.x) || 0,
    y: parseFloat(el.dataset.y) || 0,
    ry: parseFloat(el.dataset.ry) || 0,
  }));

  const tunnelPhotoList = tunnelNodes
    .filter(n => n.el.classList.contains('tunnel-node-photo'))
    .map(n => ({ full: n.el.dataset.full, alt: n.el.dataset.alt }));

  tunnelNodes.forEach(n => {
    if (n.el.classList.contains('tunnel-node-photo')) {
      n.el.addEventListener('click', () => {
        const idx = tunnelPhotoList.findIndex(p => p.full === n.el.dataset.full);
        openLightboxFromList(tunnelPhotoList, idx);
      });
    }
  });

  function nodeOpacity(z) {
    if (z <= FADE_IN_START || z >= FADE_OUT_END) return 0;
    if (z < FADE_IN_END) return (z - FADE_IN_START) / (FADE_IN_END - FADE_IN_START);
    if (z <= FADE_OUT_START) return 1;
    return 1 - (z - FADE_OUT_START) / (FADE_OUT_END - FADE_OUT_START);
  }

  let tunnelTicking = false;
  function renderTunnel() {
    const tunnelScrollHeight = tunnelSpacer.offsetHeight;
    const progress = Math.min(window.scrollY, tunnelScrollHeight);
    tunnelNodes.forEach(n => {
      const z = (progress - n.baseZ) * Z_SCALE;
      const opacity = nodeOpacity(z);
      n.el.style.transform = `translate3d(calc(-50% + ${n.x}px), calc(-50% + ${n.y}px), ${z}px) rotateY(${n.ry}deg)`;
      n.el.style.opacity = opacity;
      n.el.style.pointerEvents = opacity > 0.15 ? 'auto' : 'none';
    });
    tunnelViewport.classList.toggle('exited', window.scrollY >= tunnelScrollHeight);
    scrollCue?.classList.toggle('hide', window.scrollY > 200);
    tunnelTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!tunnelTicking) {
      requestAnimationFrame(renderTunnel);
      tunnelTicking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', renderTunnel);
  renderTunnel();
}

// ===================== ACTIVE NAV ON SCROLL =====================
const sections = document.querySelectorAll('section[id], .scroll-marker[id]');
const navLinks = document.querySelectorAll('.main-nav > a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top + window.scrollY - 140;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}, { passive: true });
