// script.js
// Adds intersection observer to animate elements on scroll
document.addEventListener('DOMContentLoaded', () => {
  const REGION_PATHS = {
    bd: '/bd/',
    us: '/us/'
  };

  const saveRegionAndRedirect = (region) => {
    if (!REGION_PATHS[region]) return;
    localStorage.setItem('preferredRegion', region);
    window.location.href = REGION_PATHS[region];
  };

  const isInBangladesh = (latitude, longitude) => (
    latitude >= 20.3 && latitude <= 26.7 &&
    longitude >= 88.0 && longitude <= 92.8
  );

  const isInUnitedStates = (latitude, longitude) => {
    const contiguous = latitude >= 24.4 && latitude <= 49.5 && longitude >= -124.9 && longitude <= -66.8;
    const alaska = latitude >= 51.0 && latitude <= 71.6 && longitude >= -179.2 && longitude <= -129.9;
    const hawaii = latitude >= 18.8 && latitude <= 22.4 && longitude >= -160.3 && longitude <= -154.7;
    return contiguous || alaska || hawaii;
  };

  const rootRegionPage = document.querySelector('[data-region-root]');
  if (rootRegionPage) {
    const savedRegion = localStorage.getItem('preferredRegion');
    if (REGION_PATHS[savedRegion]) {
      window.location.replace(REGION_PATHS[savedRegion]);
      return;
    }
  }

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
  const nav = document.querySelector('header nav');
  if (navToggle && navList && nav) {
    navToggle.setAttribute('aria-expanded', 'false');

    navToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('open');
      nav.classList.toggle('open', isOpen);
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('open');
        nav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close the mobile menu when the window is resized to a desktop width.
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navList.classList.contains('open')) {
        navList.classList.remove('open');
        nav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
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

  document.querySelectorAll('[data-region-choice]').forEach(choice => {
    choice.addEventListener('click', () => {
      const region = choice.getAttribute('data-region-choice');
      if (REGION_PATHS[region]) {
        localStorage.setItem('preferredRegion', region);
      }
    });
  });

  document.querySelectorAll('[data-region-switcher]').forEach(switcher => {
    switcher.addEventListener('change', event => {
      saveRegionAndRedirect(event.target.value);
    });
  });

  const locationButton = document.querySelector('[data-use-location]');
  const regionMessage = document.querySelector('[data-region-message]');
  if (locationButton && regionMessage) {
    locationButton.addEventListener('click', () => {
      if (!navigator.geolocation) {
        regionMessage.textContent = 'Location is not available in this browser. Please select a region manually.';
        return;
      }

      regionMessage.textContent = 'Checking your location...';
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          if (isInBangladesh(latitude, longitude)) {
            saveRegionAndRedirect('bd');
          } else if (isInUnitedStates(latitude, longitude)) {
            saveRegionAndRedirect('us');
          } else {
            regionMessage.textContent = 'We could not match your location to Bangladesh or the United States. Please select a region manually.';
          }
        },
        () => {
          regionMessage.textContent = 'Location permission was not available. Please select Bangladesh or United States manually.';
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  }
});
