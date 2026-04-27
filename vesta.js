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

  const downloadAssets = {
    android: {
      url: 'https://media.githubusercontent.com/media/JosephT2244/V.E.S.T.A/main/V.E.S.T.A.apk',
      name: 'V.E.S.T.A.apk'
    },
    windows: {
      url: 'https://media.githubusercontent.com/media/JosephT2244/V.E.S.T.A/main/V.E.S.T.A-Windows.zip',
      name: 'V.E.S.T.A-Windows.zip'
    }
  };

  /* ── HELPER: descarga archivo ── */
  function downloadLocal(fileUrl, toastMsg, toastIcon, downloadName) {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = downloadName || fileUrl.split('/').pop() || '';
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
        downloadAssets.android.url,
        'Descarga de APK iniciada — V.E.S.T.A. Monitor',
        '🤖',
        downloadAssets.android.name
      );
    });
  });

  /* ── DOWNLOAD WINDOWS ── */
  document.querySelectorAll('.dl-windows').forEach(btn => {
    btn.addEventListener('click', () => {
      downloadLocal(
        downloadAssets.windows.url,
        'Descarga de V.E.S.T.A. para Windows iniciada — extrae el .zip y ejecuta vesta_app.exe',
        '🪟',
        downloadAssets.windows.name
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

})();
