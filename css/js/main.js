/* =====================================================
   GLAMOUR SALON - Main JavaScript
   Features: Navbar scroll, Hero Slider, Testimonials
             Slider, Reveal animations, FAQ, Booking form
===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────────
     1. NAVBAR — Scroll effect + Mobile menu
  ───────────────────────────────────────────────── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');

  // Scroll effect
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on load

  // Mobile overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  const openMenu = () => {
    hamburger.classList.add('open');
    navMenu.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.contains('open') ? closeMenu() : openMenu();
    });
  }
  overlay.addEventListener('click', closeMenu);
  navMenu && navMenu.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
    link.addEventListener('click', closeMenu);
  });


  /* ─────────────────────────────────────────────────
     2. HERO SLIDER
  ───────────────────────────────────────────────── */
  const slides    = document.querySelectorAll('.hero-slider .slide');
  const dots      = document.querySelectorAll('.slider-dots .dot');
  const prevBtn   = document.getElementById('sliderPrev');
  const nextBtn   = document.getElementById('sliderNext');

  if (slides.length > 0) {
    let current  = 0;
    let autoTimer = null;

    const goTo = (index) => {
      slides[current].classList.remove('active');
      slides[current].classList.add('prev');
      dots[current] && dots[current].classList.remove('active');

      current = (index + slides.length) % slides.length;

      slides[current].classList.add('active');
      slides[current].classList.remove('prev');
      dots[current] && dots[current].classList.add('active');

      // Clean up prev class after transition
      setTimeout(() => {
        slides.forEach(s => s.classList.remove('prev'));
      }, 1200);
    };

    const startAuto = () => {
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    };
    const resetAuto = () => {
      clearInterval(autoTimer);
      startAuto();
    };

    prevBtn && prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    nextBtn && nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goTo(parseInt(dot.dataset.index));
        resetAuto();
      });
    });

    startAuto();

    // Touch swipe support
    let touchStartX = 0;
    const sliderEl  = document.getElementById('heroSlider');
    sliderEl && sliderEl.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    sliderEl && sliderEl.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goTo(current + 1) : goTo(current - 1);
        resetAuto();
      }
    }, { passive: true });
  }


  /* ─────────────────────────────────────────────────
     3. TESTIMONIALS SLIDER
  ───────────────────────────────────────────────── */
  const tTrack  = document.getElementById('testimonialTrack');
  const tCards  = tTrack ? tTrack.querySelectorAll('.testimonial-card') : [];
  const tPrevBtn = document.getElementById('tPrev');
  const tNextBtn = document.getElementById('tNext');

  if (tCards.length > 0 && tTrack) {
    let tCurrent   = 0;
    let visibleCount = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;

    const getCardWidth = () => {
      const total    = tTrack.parentElement.offsetWidth;
      const gap      = 28;
      return (total - gap * (visibleCount - 1)) / visibleCount;
    };

    const updateSlider = () => {
      visibleCount = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
      const cardW = getCardWidth();
      const gap   = 28;
      const maxIndex = Math.max(0, tCards.length - visibleCount);
      tCurrent = Math.min(tCurrent, maxIndex);

      tCards.forEach(c => { c.style.minWidth = cardW + 'px'; });
      tTrack.style.transform = `translateX(-${tCurrent * (cardW + gap)}px)`;
    };

    tPrevBtn && tPrevBtn.addEventListener('click', () => {
      const maxIndex = Math.max(0, tCards.length - visibleCount);
      tCurrent = tCurrent <= 0 ? maxIndex : tCurrent - 1;
      updateSlider();
    });
    tNextBtn && tNextBtn.addEventListener('click', () => {
      const maxIndex = Math.max(0, tCards.length - visibleCount);
      tCurrent = tCurrent >= maxIndex ? 0 : tCurrent + 1;
      updateSlider();
    });

    window.addEventListener('resize', updateSlider);
    updateSlider();

    // Auto scroll testimonials
    let tTimer = setInterval(() => {
      const maxIndex = Math.max(0, tCards.length - visibleCount);
      tCurrent = tCurrent >= maxIndex ? 0 : tCurrent + 1;
      updateSlider();
    }, 4000);

    [tPrevBtn, tNextBtn].forEach(btn => btn && btn.addEventListener('click', () => {
      clearInterval(tTimer);
      tTimer = setInterval(() => {
        const maxIndex = Math.max(0, tCards.length - visibleCount);
        tCurrent = tCurrent >= maxIndex ? 0 : tCurrent + 1;
        updateSlider();
      }, 4000);
    }));
  }


  /* ─────────────────────────────────────────────────
     4. SCROLL REVEAL ANIMATIONS
  ───────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger sibling cards
          const siblings = entry.target.parentElement.querySelectorAll('.reveal');
          const idx = Array.from(siblings).indexOf(entry.target);
          entry.target.style.transitionDelay = `${Math.min(idx, 5) * 100}ms`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    revealEls.forEach(el => el.classList.add('visible'));
  }


  /* ─────────────────────────────────────────────────
     5. FAQ ACCORDION
  ───────────────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question && question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      faqItems.forEach(i => i.classList.remove('open'));
      // Open clicked if was closed
      if (!isOpen) item.classList.add('open');
    });
  });


  /* ─────────────────────────────────────────────────
     6. BOOKING FORM
  ───────────────────────────────────────────────── */
  const bookingForm = document.getElementById('bookingForm');
  const formSuccess = document.getElementById('formSuccess');

  if (bookingForm) {
    // Set min date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = bookingForm.querySelector('.submit-btn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

      // Simulate async request
      await new Promise(resolve => setTimeout(resolve, 1500));

      bookingForm.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';
    });
  }


  /* ─────────────────────────────────────────────────
     7. SMOOTH SCROLL FOR ANCHOR LINKS
  ───────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ─────────────────────────────────────────────────
     8. NAVBAR: active link highlight on scroll
  ───────────────────────────────────────────────── */
  const sections    = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinksAll.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current) && current !== '') {
        link.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });


  /* ─────────────────────────────────────────────────
     9. GALLERY LIGHTBOX (simple)
  ───────────────────────────────────────────────── */
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (galleryItems.length > 0) {
    // Create lightbox elements
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.style.cssText = `
      display:none; position:fixed; inset:0; z-index:9999;
      background:rgba(0,0,0,.9); align-items:center;
      justify-content:center; cursor:zoom-out;
    `;
    const lbImg = document.createElement('img');
    lbImg.style.cssText = 'max-width:90vw; max-height:90vh; border-radius:8px; object-fit:contain;';
    lb.appendChild(lbImg);
    document.body.appendChild(lb);

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const src = item.querySelector('img').src;
        lbImg.src = src;
        lb.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });
    lb.addEventListener('click', () => {
      lb.style.display = 'none';
      document.body.style.overflow = '';
    });
  }


  /* ─────────────────────────────────────────────────
     10. BACK TO TOP BUTTON
  ───────────────────────────────────────────────── */
  const topBtn = document.createElement('button');
  topBtn.id = 'backToTop';
  topBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  topBtn.style.cssText = `
    position:fixed; bottom:28px; right:28px; z-index:900;
    width:46px; height:46px; border-radius:50%;
    background:var(--rose); color:#fff; border:none;
    font-size:1rem; cursor:pointer;
    box-shadow:0 4px 16px rgba(201,121,110,.45);
    opacity:0; pointer-events:none;
    transition:all .35s cubic-bezier(.4,0,.2,1);
    display:flex; align-items:center; justify-content:center;
  `;
  document.body.appendChild(topBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      topBtn.style.opacity = '1';
      topBtn.style.pointerEvents = 'all';
    } else {
      topBtn.style.opacity = '0';
      topBtn.style.pointerEvents = 'none';
    }
  }, { passive: true });

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});


/* ─────────────────────────────────────────────────
   Global helper: Reset booking form
───────────────────────────────────────────────── */
function resetForm() {
  const bookingForm = document.getElementById('bookingForm');
  const formSuccess = document.getElementById('formSuccess');
  if (bookingForm) {
    bookingForm.reset();
    bookingForm.style.display = 'flex';
    const btn = bookingForm.querySelector('.submit-btn');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-calendar-check"></i> Confirm Appointment';
    }
  }
  if (formSuccess) formSuccess.style.display = 'none';
}
