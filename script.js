document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for scroll animations (fade in)
  const faders = document.querySelectorAll('.fade-in');

  const appearOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver(function(
    entries,
    appearOnScroll
  ) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('appear');
        appearOnScroll.unobserve(entry.target);
      }
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });

  // Navigation Bar Scroll Effect
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.padding = '10px 40px';
      header.style.backgroundColor = 'rgba(251, 249, 244, 0.98)';
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.padding = '15px 40px';
      header.style.backgroundColor = 'rgba(251, 249, 244, 0.95)';
      header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.05)';
    }
  });
});
