// BVProd — comportements partagés (menu mobile, animations, glass buttons, formulaires)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDesktopViewport = () => window.matchMedia('(min-width: 769px)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initReveal();
  initCascade();
  initTilt();
  initPortraitTilt();
  initParallax();
  initGlassButtons();
  initScrollStrips();
  initMotionStrips();
  initContactForm();
  initNewsletterForms();
});

/* ---------- mobile burger menu ---------- */
function initMobileMenu() {
  const burger = document.querySelector('[data-burger]');
  const overlay = document.querySelector('[data-mobile-menu]');
  if (!burger || !overlay) return;
  const closeBtn = overlay.querySelector('[data-menu-close]');
  const open = () => { overlay.classList.add('is-open'); burger.classList.add('is-open'); document.body.style.overflow = 'hidden'; };
  const close = () => { overlay.classList.remove('is-open'); burger.classList.remove('is-open'); document.body.style.overflow = ''; };
  burger.addEventListener('click', () => overlay.classList.contains('is-open') ? close() : open());
  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

/* ---------- reveal on scroll ---------- */
function initReveal() {
  const els = document.querySelectorAll('[data-anim="reveal"]');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-visible');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ---------- cascade grids ---------- */
function initCascade() {
  const grids = document.querySelectorAll('[data-anim="cascade"]');
  if (!grids.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const children = Array.from(e.target.children);
      children.forEach((child, i) => {
        const delay = prefersReducedMotion ? 0 : i * 90;
        setTimeout(() => {
          child.style.opacity = '1';
          child.style.transform = 'translateY(0) scale(1)';
          child.style.filter = 'blur(0)';
          const stat = child.querySelector('[data-stat-to]');
          if (stat) countUp(stat);
          addCardHover(child);
          setTimeout(() => {
            child.style.opacity = '';
            child.style.transform = '';
            child.style.filter = '';
          }, 600);
        }, delay);
      });
      obs.unobserve(e.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  grids.forEach(grid => {
    Array.from(grid.children).forEach(child => {
      if (prefersReducedMotion) return;
      child.style.opacity = '0';
      child.style.transform = 'translateY(30px) scale(0.97)';
      child.style.filter = isDesktopViewport() ? 'blur(4px)' : 'none';
      child.style.transition = 'opacity 0.55s ease, transform 0.55s ease, filter 0.55s ease, box-shadow 0.22s ease';
    });
    obs.observe(grid);
  });
}

function addCardHover(card) {
  if (card.dataset.noHover) return;
  const isDark = getComputedStyle(card).color === 'rgb(237, 236, 238)';
  card.style.cursor = card.dataset.noHover ? 'default' : 'pointer';
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-6px) scale(1.016)';
    card.style.boxShadow = isDark
      ? '0 0 0 1px rgba(194,125,255,0.18), 0 28px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.20)'
      : '0 20px 56px rgba(47,47,48,0.18), inset 0 1px 0 rgba(255,255,255,0.95)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) scale(1)';
    card.style.boxShadow = '';
  });
}

/* ---------- 3D tilt on cards ---------- */
function initTilt() {
  if (window.matchMedia('(pointer:coarse)').matches || prefersReducedMotion) return;
  document.querySelectorAll('[data-tilt-grid]').forEach(grid => {
    Array.from(grid.children).forEach((card, i) => {
      const icon = card.querySelector('[data-tilt-icon]');
      if (icon) icon.style.animation = `bvIconFloat 3.2s ${i * 0.45}s ease-in-out infinite`;
      card.style.transformOrigin = 'center center';
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.12s ease, box-shadow 0.22s ease';
      });
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const dx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const dy = ((e.clientY - r.top) / r.height - 0.5) * 2;
        card.style.transform = `perspective(700px) rotateX(${-dy * 7}deg) rotateY(${dx * 7}deg) translateY(-5px) scale(1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s ease, box-shadow 0.3s ease';
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  });
}

/* ---------- portrait tilt (À propos) ---------- */
function initPortraitTilt() {
  const el = document.querySelector('[data-portrait-tilt]');
  if (!el || window.matchMedia('(pointer:coarse)').matches) return;
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const dy = ((e.clientY - r.top) / r.height - 0.5) * 2;
    el.style.transition = 'transform 0.1s linear';
    el.style.transform = `perspective(900px) rotateX(${-dy * 8}deg) rotateY(${dx * 8}deg) scale(1.02)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
  });
}

/* ---------- parallax on watermarks / glows ---------- */
function initParallax() {
  const els = document.querySelectorAll('[data-parallax]');
  if (!els.length || prefersReducedMotion) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      els.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.1;
        el.style.transform = `translateY(${y * speed * -0.1}px)`;
      });
      ticking = false;
    });
  }, { passive: true });
}

/* ---------- glass buttons: sheen + subtle magnetic pull ---------- */
function initGlassButtons() {
  const canMagnet = !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches;
  document.querySelectorAll('[data-glass-btn]').forEach(btn => {
    if (btn.dataset.glassInit) return;
    btn.dataset.glassInit = '1';
    btn.style.transition = 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, filter 0.3s ease-in-out';
    const restShadow = getComputedStyle(btn).boxShadow;
    const pressShadow = (restShadow && restShadow !== 'none' ? restShadow + ', ' : '') + 'inset 0 7px 16px rgba(0,0,0,0.30), inset 0 -1px 0 rgba(255,255,255,0.30)';
    const sheen = document.createElement('span');
    sheen.className = 'bv-sheen';
    btn.insertBefore(sheen, btn.firstChild);

    let magnetX = 0, magnetY = 0;
    const applyTransform = (pressed) => {
      const press = pressed ? 'translateY(3px) scale(0.99)' : 'translateY(0) scale(1)';
      btn.style.transform = `${press} translate(${magnetX}px, ${magnetY}px)`;
    };

    btn.addEventListener('mouseenter', () => {
      btn.style.boxShadow = pressShadow;
      btn.style.filter = 'brightness(1.1) saturate(1.18)';
      sheen.style.opacity = '1';
      sheen.style.backgroundPosition = '140% 140%';
      applyTransform(true);
    });
    if (canMagnet) {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        magnetX = (e.clientX - r.left - r.width / 2) * 0.12;
        magnetY = (e.clientY - r.top - r.height / 2) * 0.12;
        applyTransform(true);
      });
    }
    btn.addEventListener('mouseleave', () => {
      btn.style.boxShadow = restShadow;
      btn.style.filter = '';
      sheen.style.opacity = '0';
      sheen.style.backgroundPosition = '-70% -70%';
      magnetX = 0; magnetY = 0;
      applyTransform(false);
    });
  });
}

function countUp(el) {
  if (el.dataset.counted) return;
  el.dataset.counted = '1';
  const to = parseFloat(el.dataset.statTo);
  const prefix = el.dataset.statPrefix || '';
  const suffix = el.dataset.statSuffix || '';
  const duration = 1700;
  const t0 = performance.now();
  const tick = (now) => {
    const p = Math.min((now - t0) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.round(to * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------- generic horizontal scroll strips with prev/next buttons ---------- */
function initScrollStrips() {
  document.querySelectorAll('[data-scroll-strip]').forEach(strip => {
    const step = parseInt(strip.dataset.scrollStep, 10) || 300;
    const prev = document.querySelector(`[data-scroll-prev="${strip.id}"]`);
    const next = document.querySelector(`[data-scroll-next="${strip.id}"]`);
    if (prev) prev.addEventListener('click', () => strip.scrollBy({ left: -step, behavior: 'smooth' }));
    if (next) next.addEventListener('click', () => strip.scrollBy({ left: step, behavior: 'smooth' }));

    let dragging = false, startX = 0, startScroll = 0;
    strip.addEventListener('mousedown', (e) => {
      dragging = true; startX = e.pageX; startScroll = strip.scrollLeft; strip.classList.add('grabbing');
    });
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      strip.scrollLeft = startScroll - (e.pageX - startX);
    });
    window.addEventListener('mouseup', () => { dragging = false; strip.classList.remove('grabbing'); });
  });
}

/* ---------- motion design video strip ---------- */
function initMotionStrips() {
  document.querySelectorAll('[data-motion-strip]').forEach(strip => {
    const bar = document.querySelector(`[data-scroll-progress="${strip.id}"]`);
    strip.querySelectorAll('video').forEach((v) => {
      v.muted = true; v.loop = true; v.pause();
      const wrap = v.parentElement;
      if (!wrap) return;
      wrap.style.position = 'relative';

      const playOverlay = document.createElement('div');
      playOverlay.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:8;transition:opacity .25s ease;cursor:pointer;';
      playOverlay.innerHTML = '<div style="width:64px;height:64px;border-radius:50%;background:rgba(0,0,0,.52);backdrop-filter:blur(10px);border:1.5px solid rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 4.5L20 12L6 19.5V4.5Z" fill="#EDECEE"/></svg></div>';
      playOverlay.addEventListener('click', () => { v.paused ? v.play().catch(() => {}) : v.pause(); });
      wrap.appendChild(playOverlay);
      const sync = () => { playOverlay.style.opacity = v.paused ? '1' : '0'; playOverlay.style.pointerEvents = v.paused ? 'auto' : 'none'; };
      v.addEventListener('play', sync); v.addEventListener('pause', sync); sync();

      const card = wrap.parentElement;
      if (card) {
        card.addEventListener('mouseenter', () => v.play().catch(() => {}));
        card.addEventListener('mouseleave', () => v.pause());
      }

      const soundBtn = document.createElement('button');
      soundBtn.type = 'button';
      soundBtn.setAttribute('aria-label', 'Activer / couper le son');
      soundBtn.textContent = '🔇';
      soundBtn.style.cssText = 'position:absolute;bottom:12px;right:12px;width:34px;height:34px;border-radius:50%;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.14);color:#fff;font-size:14px;z-index:10;';
      soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const willMute = !v.muted;
        strip.querySelectorAll('video').forEach(ov => { ov.muted = true; });
        v.muted = willMute;
        soundBtn.textContent = willMute ? '🔇' : '🔊';
      });
      wrap.appendChild(soundBtn);
    });

    strip.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        strip.scrollLeft += e.deltaX;
      }
    }, { passive: false });
    strip.addEventListener('scroll', () => {
      if (!bar) return;
      const max = strip.scrollWidth - strip.clientWidth;
      bar.style.width = max > 0 ? (strip.scrollLeft / max * 100) + '%' : '0%';
    });
  });
}

/* ---------- contact form -> Formspree ---------- */
function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const btn = form.querySelector('button[type="submit"]');
  let msg = form.querySelector('[data-form-msg]');
  if (!msg) {
    msg = document.createElement('p');
    msg.setAttribute('data-form-msg', '1');
    msg.className = 'form-msg';
    form.appendChild(msg);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (btn.disabled) return;

    const fields = Array.from(form.querySelectorAll('input[required], textarea[required]'));
    let firstBad = null;
    fields.forEach(el => {
      const bad = !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value.trim()));
      el.style.borderColor = bad ? 'rgba(255,110,110,0.75)' : '';
      if (bad && !firstBad) firstBad = el;
    });

    if (firstBad) {
      msg.className = 'form-msg error';
      msg.setAttribute('role', 'alert');
      msg.textContent = 'Merci de remplir tous les champs obligatoires (e-mail valide inclus).';
      firstBad.focus();
      return;
    }

    const originalLabel = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Envoi en cours…';
    msg.className = 'form-msg pending';
    msg.setAttribute('role', 'status');
    msg.textContent = 'Envoi en cours…';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        msg.className = 'form-msg success';
        msg.textContent = 'Message envoyé — je reviens vers vous sous 24h. Merci !';
        form.reset();
        form.querySelectorAll('input, textarea').forEach(el => { el.style.borderColor = ''; });
      } else {
        throw new Error('Formspree error');
      }
    } catch (err) {
      msg.className = 'form-msg error';
      msg.textContent = 'Une erreur est survenue. Réessayez ou écrivez-moi directement à BVProd.wix@gmail.com.';
    } finally {
      btn.disabled = false;
      btn.textContent = originalLabel;
      setTimeout(() => { msg.textContent = ''; msg.className = 'form-msg'; }, 8000);
    }
  });
}

/* ---------- newsletter (front-end only, pas de backend demandé) ---------- */
function initNewsletterForms() {
  document.querySelectorAll('[data-newsletter-form]').forEach(form => {
    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!input || btn.disabled) return;
      if (!/^\S+@\S+\.\S+$/.test(input.value.trim())) {
        input.value = '';
        const old = input.placeholder;
        input.placeholder = 'E-mail invalide';
        form.style.borderColor = 'rgba(255,110,110,0.65)';
        setTimeout(() => { input.placeholder = old; form.style.borderColor = ''; }, 2400);
        return;
      }
      const old = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Envoi…';
      setTimeout(() => {
        btn.textContent = 'Merci ✓';
        input.value = '';
        setTimeout(() => { btn.textContent = old; btn.disabled = false; }, 2800);
      }, 700);
    });
  });
}
