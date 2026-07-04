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

// ===================== 3D COVERFLOW =====================
const cfTrack = document.getElementById('cfTrack');
if (cfTrack) {
  const cfItems = Array.from(cfTrack.querySelectorAll('.cf-item'));
  const cfList = cfItems.map(el => ({ full: el.dataset.full, alt: el.dataset.alt }));
  let cfActive = 0;
  let cfTimer;

  function cfLayout() {
    const n = cfItems.length;
    cfItems.forEach((el, i) => {
      let diff = i - cfActive;
      if (diff > n / 2) diff -= n;
      if (diff < -n / 2) diff += n;
      const abs = Math.abs(diff);
      const tx = diff * 132;
      const tz = -abs * 150;
      const rot = diff * -34;
      const scale = Math.max(1 - abs * 0.13, 0.55);
      const opacity = abs > 3 ? 0 : Math.max(1 - abs * 0.3, 0);
      el.style.transform = `translate3d(${tx}px, 0, ${tz}px) rotateY(${rot}deg) scale(${scale})`;
      el.style.opacity = opacity;
      el.style.zIndex = 100 - abs;
      el.style.pointerEvents = abs > 3 ? 'none' : 'auto';
      el.classList.toggle('is-active', diff === 0);
    });
  }

  function cfGoTo(i) {
    const n = cfItems.length;
    cfActive = (i + n) % n;
    cfLayout();
  }

  function cfRestartAutoplay() {
    clearInterval(cfTimer);
    cfTimer = setInterval(() => cfGoTo(cfActive + 1), 3600);
  }

  cfItems.forEach((el, i) => {
    el.addEventListener('click', () => {
      if (i === cfActive) {
        openLightboxFromList(cfList, i);
      } else {
        cfGoTo(i);
        cfRestartAutoplay();
      }
    });
  });
  document.getElementById('cfPrev')?.addEventListener('click', () => { cfGoTo(cfActive - 1); cfRestartAutoplay(); });
  document.getElementById('cfNext')?.addEventListener('click', () => { cfGoTo(cfActive + 1); cfRestartAutoplay(); });

  // touch / drag swipe
  let dragStartX = null;
  cfTrack.addEventListener('pointerdown', (e) => { dragStartX = e.clientX; });
  cfTrack.addEventListener('pointerup', (e) => {
    if (dragStartX === null) return;
    const delta = e.clientX - dragStartX;
    if (delta > 40) { cfGoTo(cfActive - 1); cfRestartAutoplay(); }
    else if (delta < -40) { cfGoTo(cfActive + 1); cfRestartAutoplay(); }
    dragStartX = null;
  });

  const coverflowEl = document.getElementById('coverflow');
  coverflowEl?.addEventListener('mouseenter', () => clearInterval(cfTimer));
  coverflowEl?.addEventListener('mouseleave', cfRestartAutoplay);

  cfLayout();
  cfRestartAutoplay();
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
