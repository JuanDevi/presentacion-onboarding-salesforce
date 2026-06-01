/* ============================================
   SLIDE NAVIGATION & INTERACTIONS
   Etapa 1: Account Strategy – D-local
   ============================================ */

(function () {
  'use strict';

  const TOTAL_SLIDES = 25;
  let currentSlide = 1;
  let isAnimating = false;

  // DOM Elements
  const progressBar = document.getElementById('progressBar');
  const slideCounter = document.getElementById('slideCounter');

  // ---- Scale & Wrap ----
  function wrapSlides() {
    const area = document.createElement('div');
    area.id = 'presentation-area';
    document.body.appendChild(area);
    const slides = document.querySelectorAll('.slide');
    slides.forEach(s => area.appendChild(s));
    
    function resize() {
      const scale = Math.min(window.innerWidth / 1440, window.innerHeight / 900);
      area.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }
    window.addEventListener('resize', resize);
    resize();
  }

  // ---- Initialize ----
  function init() {
    wrapSlides();
    updateProgress();
    updateCounter();
    setupKeyboard();
    setupTouch();
    setupWheel();
    animateSlideContent(1);
  }

  // ---- Navigation ----
  function goToSlide(n, direction) {
    if (isAnimating || n < 1 || n > TOTAL_SLIDES || n === currentSlide) return;
    isAnimating = true;

    const currentEl = document.getElementById('slide-' + currentSlide);
    const nextEl = document.getElementById('slide-' + n);

    const dir = direction || (n > currentSlide ? 'next' : 'prev');

    // Apply exit animation to current
    currentEl.classList.remove('active');
    currentEl.classList.add('exiting-' + dir);

    // Apply enter animation to next
    nextEl.classList.add('entering-' + dir);

    // After animation
    setTimeout(() => {
      currentEl.classList.remove('exiting-' + dir);
      nextEl.classList.remove('entering-' + dir);
      nextEl.classList.add('active');

      currentSlide = n;
      updateProgress();
      updateCounter();
      animateSlideContent(n);
      isAnimating = false;
    }, 500);
  }

  window.nextSlide = function () {
    if (currentSlide < TOTAL_SLIDES) {
      goToSlide(currentSlide + 1, 'next');
    }
  };

  window.prevSlide = function () {
    if (currentSlide > 1) {
      goToSlide(currentSlide - 1, 'prev');
    }
  };

  // ---- Progress & Counter ----
  function updateProgress() {
    const pct = (currentSlide / TOTAL_SLIDES) * 100;
    progressBar.style.width = pct + '%';
  }

  function updateCounter() {
    slideCounter.textContent = currentSlide + ' / ' + TOTAL_SLIDES;
  }

  // ---- Keyboard ----
  function setupKeyboard() {
    document.addEventListener('keydown', function (e) {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          window.nextSlide();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          window.prevSlide();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(1, 'prev');
          break;
        case 'End':
          e.preventDefault();
          goToSlide(TOTAL_SLIDES, 'next');
          break;
        case 'f':
        case 'F':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
      }
    });
  }

  // ---- Touch Support ----
  function setupTouch() {
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
      const dx = e.changedTouches[0].screenX - touchStartX;
      const dy = e.changedTouches[0].screenY - touchStartY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (absDx > 50 && absDx > absDy) {
        if (dx < 0) window.nextSlide();
        else window.prevSlide();
      }
    }, { passive: true });
  }

  // ---- Mouse Wheel ----
  function setupWheel() {
    let wheelTimeout = null;
    document.addEventListener('wheel', function (e) {
      if (wheelTimeout) return;
      wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 800);

      if (e.deltaY > 0) window.nextSlide();
      else if (e.deltaY < 0) window.prevSlide();
    }, { passive: true });
  }

  // ---- Fullscreen ----
  window.toggleFullscreen = function () {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // ---- Animate Slide Content ----
  function animateSlideContent(slideNum) {
    const slide = document.getElementById('slide-' + slideNum);
    if (!slide) return;

    // Animate cards, items, rows with staggered entrance
    const animatables = slide.querySelectorAll(
      '.card-elevated, .card-trend, .competitor-card, .agenda-item, ' +
      '.stakeholder-card, .team-card, .ai-solution-card, .crm-card, ' +
      '.pipeline-item, .roadmap-row, .obstacle-item, .finance-row, ' +
      '.maturity-row, .ext-row, .timeline-phase, .priority-row, ' +
      '.projection-card, .q1-stat'
    );

    animatables.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(15px)';
      el.style.transition = 'none';

      setTimeout(() => {
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 80 + i * 60);
    });
  }

  // ---- Cover Particles ----
  function createParticles() {
    const container = document.getElementById('coverParticles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        background: rgba(0, 179, 255, ${0.1 + Math.random() * 0.2});
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: float ${4 + Math.random() * 6}s ease-in-out infinite;
        animation-delay: ${Math.random() * 4}s;
      `;
      container.appendChild(particle);
    }
  }

  // ---- Boot ----
  document.addEventListener('DOMContentLoaded', function () {
    init();
    createParticles();
  });

})();
