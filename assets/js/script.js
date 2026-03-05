// script.js
// Adds intersection observer to animate elements on scroll
document.addEventListener('DOMContentLoaded', () => {
  // Fade‑in elements using IntersectionObserver
  const faders = document.querySelectorAll('.fade-in');
  const appearOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('appear');
      observer.unobserve(entry.target);
    });
  }, appearOptions);
  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });

  // Mobile navigation toggle
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.querySelector('header nav ul');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      navList.classList.toggle('open');
    });

    // Close the mobile menu when the window is resized to a desktop width.
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navList.classList.contains('open')) {
        navList.classList.remove('open');
      }
    });
  }

  // Animate hero logo on page load
  const heroLogo = document.querySelector('.hero-logo');
  if (heroLogo) {
    // Delay to allow initial styles to apply before animating
    setTimeout(() => {
      heroLogo.classList.add('show');
    }, 200);

    // Shrink and fade the hero logo on scroll for a smoother transition when scrolling.
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      // Calculate scale and opacity based on scroll position
      // The logo shrinks gradually but never smaller than 60% of its original size.
      const scale = Math.max(0.6, 1 - scrollY / 600);
      const opacity = Math.max(0, 1 - scrollY / 400);
      heroLogo.style.transform = `translateY(0) scale(${scale})`;
      heroLogo.style.opacity = `${opacity}`;
    });
  }
});