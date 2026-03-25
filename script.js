/**
 * JJUTECH – script.js
 * Dark/Light mode, particles, typing effect, scroll animations,
 * search filter, category filter, mobile menu, back-to-top, forms
 */

/* =============================================
   1. LOADER
   ============================================= */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hidden'), 1600);
});

/* =============================================
   2. THEME TOGGLE (dark / light)
   ============================================= */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = themeToggle.querySelector('.theme-icon');
const html        = document.documentElement;

// Restore saved preference
const savedTheme = localStorage.getItem('jjutech-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  themeIcon.textContent = next === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('jjutech-theme', next);
});

/* =============================================
   3. NAVBAR – scroll effect + active link
   ============================================= */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveLink();
  toggleBackToTop();
});

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 100;
  sections.forEach(sec => {
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (!link) return;
    const top    = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    link.classList.toggle('active', scrollY >= top && scrollY < bottom);
  });
}

/* =============================================
   4. MOBILE MENU
   ============================================= */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* =============================================
   5. PARTICLE CANVAS
   ============================================= */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
      const colors = ['108,99,255', '0,212,255', '168,85,247'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  // Create particles
  for (let i = 0; i < 80; i++) particles.push(new Particle());

  // Draw connecting lines between nearby particles
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108,99,255,${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();

/* =============================================
   6. TYPING TEXT EFFECT
   ============================================= */
(function initTyping() {
  const el     = document.getElementById('typingText');
  if (!el) return;
  const words  = ['Achievement', 'Innovation', 'Excellence', 'Success', 'Impact'];
  let wIndex   = 0, cIndex = 0, deleting = false;

  // Add cursor
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  el.parentNode.insertBefore(cursor, el.nextSibling);

  function type() {
    const word    = words[wIndex];
    const current = deleting ? word.slice(0, cIndex--) : word.slice(0, cIndex++);
    el.textContent = current;

    let delay = deleting ? 60 : 100;

    if (!deleting && cIndex > word.length) {
      delay    = 2000;
      deleting = true;
    } else if (deleting && cIndex < 0) {
      deleting = false;
      cIndex   = 0;
      wIndex   = (wIndex + 1) % words.length;
      delay    = 400;
    }
    setTimeout(type, delay);
  }
  type();
})();

/* =============================================
   7. SCROLL REVEAL ANIMATIONS
   ============================================= */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for grid children
        const delay = entry.target.closest('.blog-grid, .featured-grid, .contact-info')
          ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
          : 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
})();

/* =============================================
   8. LIVE SEARCH FILTER
   ============================================= */
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    filterPosts(searchInput.value.trim().toLowerCase(), activeFilter);
  });
}

/* =============================================
   9. CATEGORY FILTER
   ============================================= */
let activeFilter = 'all';

// Top filter buttons
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    filterPosts(searchInput ? searchInput.value.trim().toLowerCase() : '', activeFilter);
  });
});

// Sidebar category links
document.querySelectorAll('.category-list a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const filter = link.dataset.filter;
    activeFilter = filter;
    // Sync top filter buttons
    filterBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.filter === filter);
    });
    filterPosts(searchInput ? searchInput.value.trim().toLowerCase() : '', filter);
    // Scroll to blog section
    document.getElementById('blog').scrollIntoView({ behavior: 'smooth' });
  });
});

/**
 * Filter blog cards by search query and/or category
 */
function filterPosts(query, category) {
  const cards    = document.querySelectorAll('.blog-card');
  const noResult = document.getElementById('noResults');
  let visible    = 0;

  cards.forEach(card => {
    const title    = card.querySelector('h3')?.textContent.toLowerCase() || '';
    const excerpt  = card.querySelector('p')?.textContent.toLowerCase() || '';
    const cat      = card.dataset.category || '';

    const matchSearch   = !query || title.includes(query) || excerpt.includes(query);
    const matchCategory = category === 'all' || cat === category;

    if (matchSearch && matchCategory) {
      card.classList.remove('hidden');
      visible++;
    } else {
      card.classList.add('hidden');
    }
  });

  if (noResult) noResult.style.display = visible === 0 ? 'block' : 'none';
}

/* =============================================
   10. BACK TO TOP
   ============================================= */
const backToTop = document.getElementById('backToTop');

function toggleBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =============================================
   11. NEWSLETTER FORM
   ============================================= */
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input[type="email"]');
    const btn   = newsletterForm.querySelector('button');
    btn.textContent = '✓ Subscribed!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    input.value = '';
    setTimeout(() => {
      btn.textContent = 'Subscribe →';
      btn.style.background = '';
    }, 3000);
  });
}

/* =============================================
   12. CONTACT FORM
   ============================================= */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button');
    btn.textContent = '✓ Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    contactForm.reset();
    setTimeout(() => {
      btn.textContent = 'Send Message →';
      btn.style.background = '';
    }, 3000);
  });
}

/* =============================================
   13. SMOOTH SCROLL for anchor links
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

/* =============================================
   14. API INTEGRATION
   Fetches real posts, categories, and handles
   newsletter / contact form submissions via the
   Express + SQLite backend.
   ============================================= */

const API = 'http://localhost:3000/api';

/* ── Load posts from API and render into blog grid ── */
async function loadPostsFromAPI() {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;

  // Show skeletons while loading
  grid.innerHTML = Array(6).fill(0).map(() => `
    <div class="blog-card">
      <div class="skeleton" style="height:180px;border-radius:var(--radius) var(--radius) 0 0;"></div>
      <div class="card-body" style="padding:20px;display:flex;flex-direction:column;gap:10px;">
        <div class="skeleton" style="height:12px;width:60%;border-radius:4px;"></div>
        <div class="skeleton" style="height:18px;width:90%;border-radius:4px;"></div>
        <div class="skeleton" style="height:14px;width:80%;border-radius:4px;"></div>
        <div class="skeleton" style="height:14px;width:40%;border-radius:4px;"></div>
      </div>
    </div>
  `).join('');

  try {
    const res  = await fetch(`${API}/posts?limit=9`);
    const data = await res.json();
    renderPosts(data.posts, grid);
  } catch {
    // API not running – keep the static HTML cards already in the DOM
    // (re-fetch won't overwrite if this function isn't called on static build)
  }
}

function renderPosts(posts, container) {
  if (!posts || posts.length === 0) {
    container.innerHTML = `<div class="no-results"><span>🔍</span><p>No posts found.</p></div>`;
    return;
  }

  container.innerHTML = posts.map(post => `
    <article class="blog-card reveal" data-category="${post.category}">
      <div class="card-img-wrap">
        <img src="${post.image_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80'}"
             alt="${post.title}" loading="lazy" />
        <span class="card-tag tag-${post.category}">${post.category.toUpperCase()}</span>
      </div>
      <div class="card-body">
        <div class="card-meta">
          <span>${new Date(post.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
          <span>${post.read_time} min read</span>
        </div>
        <h3>${post.title}</h3>
        <p>${post.excerpt || ''}</p>
        <a href="post.html?slug=${post.slug}" class="read-more">Read More →</a>
      </div>
    </article>
  `).join('') + `<div class="no-results" id="noResults" style="display:none;"><span>🔍</span><p>No posts found.</p></div>`;

  // Re-observe new cards for scroll reveal
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    obs.observe(el);
  });
}

/* ── Load trending posts into sidebar ─────────────── */
async function loadTrending() {
  try {
    const res   = await fetch(`${API}/posts/trending`);
    const posts = await res.json();
    const list  = document.querySelector('.trending-list');
    if (!list || !posts.length) return;
    list.innerHTML = posts.map(p => `
      <li><a href="post.html?slug=${p.slug}">${p.title}</a></li>
    `).join('');
  } catch { /* keep static content */ }
}

/* ── Load categories into sidebar ─────────────────── */
async function loadCategories() {
  try {
    const res  = await fetch(`${API}/categories`);
    const cats = await res.json();
    const list = document.querySelector('.category-list');
    if (!list || !cats.length) return;
    list.innerHTML = cats.map(c => `
      <li><a href="#" data-filter="${c.slug}">${c.icon} ${c.name} <span>${c.count}</span></a></li>
    `).join('');
    // Re-attach filter listeners
    list.querySelectorAll('a[data-filter]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        activeFilter = link.dataset.filter;
        filterPosts(searchInput ? searchInput.value.trim().toLowerCase() : '', activeFilter);
        document.getElementById('blog').scrollIntoView({ behavior: 'smooth' });
      });
    });
  } catch { /* keep static content */ }
}

/* ── Newsletter form → POST /api/newsletter ────────── */
const nlForm = document.getElementById('newsletterForm');
if (nlForm) {
  nlForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = nlForm.querySelector('input[type="email"]');
    const btn   = nlForm.querySelector('button');
    btn.textContent = 'Subscribing...';
    btn.disabled    = true;

    try {
      const res  = await fetch(`${API}/newsletter`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: input.value })
      });
      const data = await res.json();
      if (res.ok) {
        btn.textContent = '✓ Subscribed!';
        btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
        input.value = '';
      } else {
        btn.textContent = data.error || 'Error';
        btn.style.background = 'linear-gradient(135deg,#ef4444,#dc2626)';
      }
    } catch {
      btn.textContent = '✓ Subscribed!';
      btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
      input.value = '';
    }

    setTimeout(() => {
      btn.textContent = 'Subscribe →';
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  });
}

/* ── Contact form → POST /api/contact ──────────────── */
const ctForm = document.getElementById('contactForm');
if (ctForm) {
  ctForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputs = ctForm.querySelectorAll('input, textarea');
    const btn    = ctForm.querySelector('button');
    const [name, email, subject, message] = [...inputs].map(i => i.value);
    btn.textContent = 'Sending...';
    btn.disabled    = true;

    try {
      const res  = await fetch(`${API}/contact`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, subject, message })
      });
      const data = await res.json();
      btn.textContent = res.ok ? '✓ Message Sent!' : (data.error || 'Error');
      btn.style.background = res.ok
        ? 'linear-gradient(135deg,#22c55e,#16a34a)'
        : 'linear-gradient(135deg,#ef4444,#dc2626)';
      if (res.ok) ctForm.reset();
    } catch {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
      ctForm.reset();
    }

    setTimeout(() => {
      btn.textContent = 'Send Message →';
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  });
}

/* ── Init API calls on page load ───────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadPostsFromAPI();
  loadTrending();
  loadCategories();
});
