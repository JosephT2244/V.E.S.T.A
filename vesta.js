/*
  Archivo      | vesta.js
  Descripción  | JavaScript principal de V.E.S.T.A.; controla animaciones,
               | navegación activa, menú móvil, descargas y notificaciones.
*/

/* Arranque     | Encapsula todo el script para evitar variables globales accidentales. */
(function () {
  'use strict';

  /* Scroll reveal | Selecciona tarjetas y filas que aparecerán al entrar en pantalla. */
  const revealEls = document.querySelectorAll(
    '.valor-card, .obj-card, .member-card, .render-full-card, .sensor-chip, .stat-card, .download-card, .spec-row, .purchase-showcase, .custom-order, .purchase-step, .config-option, .route-card'
  );

  /* Estado inicial | Prepara los elementos ocultos antes de observar su visibilidad. */
  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  /* Observador    | Revela cada elemento con retraso leve cuando aparece en viewport. */
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

  /* Navegación   | Guarda secciones y enlaces para marcar el link activo al hacer scroll. */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  /* Scroll activo | Detecta la sección visible y actualiza la clase nav-active. */
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

  /* Menú móvil   | Obtiene botón hamburguesa y drawer lateral para pantallas pequeñas. */
  const navToggle = document.getElementById('nav-toggle');
  const navDrawer = document.getElementById('nav-drawer');

  if (navToggle && navDrawer) {
    /* Toggle menú  | Abre o cierra el drawer móvil al tocar el botón hamburguesa. */
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navDrawer.classList.toggle('open');
    });

    /* Link drawer  | Cierra el menú móvil cuando el usuario elige una sección. */
    navDrawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navDrawer.classList.remove('open');
      });
    });

    /* Scroll drawer | Cierra el menú móvil si el usuario empieza a desplazarse. */
    window.addEventListener('scroll', () => {
      if (navDrawer.classList.contains('open')) {
        navToggle.classList.remove('open');
        navDrawer.classList.remove('open');
      }
    }, { passive: true });
  }

  /* Toast        | Muestra una notificación temporal reutilizable en la esquina inferior. */
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

  /* Assets       | Define URLs externas y nombres de archivo para descargas pesadas. */
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

  /* Descarga     | Crea un enlace temporal, dispara la descarga y confirma con toast. */
  function downloadLocal(fileUrl, toastMsg, toastIcon, downloadName) {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = downloadName || fileUrl.split('/').pop() || '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(toastMsg, toastIcon);
  }

  /* Word         | Conecta el botón del análisis estático con el archivo .docx local. */
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

  /* Android      | Asigna descarga APK a todos los botones con clase dl-android. */
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

  /* Windows      | Asigna descarga del paquete .zip a todos los botones dl-windows. */
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

  /* Compra       | Convierte la configuración personalizada en una solicitud por correo. */
  const customOrderForm = document.getElementById('custom-order-form');
  if (customOrderForm) {
    customOrderForm.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(customOrderForm);
      const modules = data.getAll('Modulos[]').join(', ') || 'Por definir';
      const subject = encodeURIComponent('Solicitud de compra V.E.S.T.A. personalizada');
      const body = encodeURIComponent(
        `Hola, quiero cotizar un exoesqueleto V.E.S.T.A. 100% personalizado.\n\n` +
        `Nombre: ${data.get('Nombre') || ''}\n` +
        `Contacto: ${data.get('email') || ''}\n` +
        `Tipo de uso: ${data.get('Uso') || 'Por definir'}\n` +
        `Estatura: ${data.get('Estatura') || 'Por definir'}\n` +
        `Contexto: ${data.get('Contexto') || 'Por definir'}\n` +
        `Módulos: ${modules}\n` +
        `Objetivo principal: ${data.get('Objetivo') || 'Por definir'}`
      );

      window.location.href = `mailto:jtrejoh2300@alumno.ipn.mx?subject=${subject}&body=${body}`;
      showToast('Solicitud preparada para jtrejoh2300@alumno.ipn.mx', '✓');
    });
  }

  /* Anclas       | Suaviza navegación interna y compensa la altura de la barra fija. */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 68;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });

  /* Barras       | Prepara las barras del mockup para animarse cuando sean visibles. */
  const bars = document.querySelectorAll('.bar-fill');
  /* Observador    | Restaura el ancho final de cada barra al aparecer en pantalla. */
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width || e.target.style.width;
        barObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  /* Estado barras | Guarda el ancho final y arranca cada barra desde cero. */
  bars.forEach(bar => {
    const finalW = bar.style.width;
    bar.style.width = '0%';
    bar.dataset.width = finalW;
    bar.style.transition = 'width 1s ease';
    barObserver.observe(bar);
  });

})();
