/* ═══════════════════════════════════════════════
   V.E.S.T.A. — Exoesqueleto Inteligente
   JavaScript principal · 2026
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll(
    '.valor-card, .obj-card, .member-card, .render-full-card, .sensor-chip, .stat-card, .download-card, .spec-row'
  );

  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }, i * 60);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => observer.observe(el));

  /* ── ACTIVE NAV ON SCROLL ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(a => a.classList.remove('nav-active'));
        const active = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
        if (active) active.classList.add('nav-active');
      }
    });
  });

  /* ── MOBILE NAV TOGGLE ── */
  const navToggle = document.getElementById('nav-toggle');
  const navDrawer = document.getElementById('nav-drawer');

  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navDrawer.classList.toggle('open');
    });

    // Cerrar drawer al hacer click en un enlace
    navDrawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navDrawer.classList.remove('open');
      });
    });

    // Cerrar drawer al hacer scroll
    window.addEventListener('scroll', () => {
      if (navDrawer.classList.contains('open')) {
        navToggle.classList.remove('open');
        navDrawer.classList.remove('open');
      }
    }, { passive: true });
  }

  /* ── TOAST NOTIFICATION ── */
  function showToast(message, icon = '✓') {
    let toast = document.getElementById('vesta-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'vesta-toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), 3500);
  }

  /* ── HELPER: descarga archivo local ── */
  function downloadLocal(filename, toastMsg, toastIcon) {
    const a = document.createElement('a');
    a.href = filename;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(toastMsg, toastIcon);
  }

  /* ── DOWNLOAD WORD ── */
  const dlWordBtn = document.getElementById('dl-word');
  if (dlWordBtn) {
    dlWordBtn.addEventListener('click', () => {
      downloadLocal(
        'V.E.S.T.A.-Análisis estático 10-1.docx',
        'V.E.S.T.A.-Análisis estático 10-1',
        '📄'
      );
    });
  }

  /* ── DOWNLOAD ANDROID ── */
  document.querySelectorAll('.dl-android').forEach(btn => {
    btn.addEventListener('click', () => {
      downloadLocal(
        'V.E.S.T.A..apk',
        'Descarga de APK iniciada — V.E.S.T.A. Monitor',
        '🤖'
      );
    });
  });

  /* ── DOWNLOAD WINDOWS ── */
  document.querySelectorAll('.dl-windows').forEach(btn => {
    btn.addEventListener('click', () => {
      downloadLocal(
        'V.E.S.T.A..exe',
        'Descarga de V.E.S.T.A. para Windows iniciada',
        '🪟'
      );
    });
  });

  /* ── SMOOTH ANCHOR + NAV OFFSET ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 68;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });

  /* ── BAR CHART ANIMATION ── */
  const bars = document.querySelectorAll('.bar-fill');
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width || e.target.style.width;
        barObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => {
    const finalW = bar.style.width;
    bar.style.width = '0%';
    bar.dataset.width = finalW;
    bar.style.transition = 'width 1s ease';
    barObserver.observe(bar);
  });

  /* ── PORTAL TÉCNICO ── */
  const TECH_URL  = 'https://josepht2244.github.io/technical_V.E.S.T.A.-/';
  const TECH_CODE = 'VESTA-TECH';  // ← Cambia este código de acceso

  const overlay       = document.getElementById('tech-overlay');
  const techClose     = document.getElementById('tech-close');
  const btnGuestEnter = document.getElementById('btn-guest-enter');
  const btnTechEnter  = document.getElementById('btn-tech-enter');
  const techInput     = document.getElementById('tech-code-input');
  const techError     = document.getElementById('tech-error');

  function openPortalModal(e) {
    if (e) e.preventDefault();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => techInput && techInput.focus(), 300);
  }

  function closePortalModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (techInput) techInput.value = '';
    if (techError) techError.classList.remove('show');
    if (techInput) techInput.classList.remove('error');
  }

  document.getElementById('btn-portal-nav')    ?.addEventListener('click', openPortalModal);
  document.getElementById('btn-portal-drawer') ?.addEventListener('click', openPortalModal);

  techClose?.addEventListener('click', closePortalModal);
  overlay?.addEventListener('click', e => { if (e.target === overlay) closePortalModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePortalModal(); });

  btnGuestEnter?.addEventListener('click', () => {
    window.open(TECH_URL, '_blank', 'noopener');
    closePortalModal();
  });

  function attemptTechAccess() {
    const val = techInput?.value.trim();
    if (val === TECH_CODE) {
      window.open(TECH_URL, '_blank', 'noopener');
      closePortalModal();
    } else {
      techError?.classList.add('show');
      techInput?.classList.add('error');
      techInput?.addEventListener('animationend', () => techInput.classList.remove('error'), { once: true });
    }
  }

  btnTechEnter?.addEventListener('click', attemptTechAccess);
  techInput?.addEventListener('keydown', e => { if (e.key === 'Enter') attemptTechAccess(); });
  techInput?.addEventListener('input', () => {
    techError?.classList.remove('show');
  });

})();
