document.addEventListener('DOMContentLoaded', () => {
  const faders = document.querySelectorAll('.fade-in, .reveal-ink');

  const appearOptions = {
    threshold: 0,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver(function(
    entries,
    appearOnScroll
  ) {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) {
        return;
      } else {
        // Add stagger delay if multiple items appear at once (like cards)
        if (entry.target.classList.contains('card')) {
          entry.target.style.transitionDelay = `${(index % 3) * 0.15}s`;
        }
        entry.target.classList.add('appear');
        appearOnScroll.unobserve(entry.target);
      }
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });

  // Mouse Trail Sakura
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (!isTouchDevice && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let lastSpawntime = 0;
    
    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastSpawntime < 50) return; // limit spawn rate
      lastSpawntime = now;

      const petal = document.createElement('div');
      petal.classList.add('sakura-trail-petal');
      petal.style.left = `${e.pageX}px`;
      petal.style.top = `${e.pageY}px`;
      
      const size = Math.random() * 6 + 4;
      const rotation = Math.random() * 360;
      
      petal.style.width = `${size}px`;
      petal.style.height = `${size}px`;
      // Start rotation from the random value
      petal.style.setProperty('--start-rot', `${rotation}deg`);
      petal.style.setProperty('--end-rot', `${rotation + 90}deg`);
      
      document.body.appendChild(petal);
      
      setTimeout(() => {
        if(petal.parentNode) petal.parentNode.removeChild(petal);
      }, 1500);
    });
  }

  // Particle Generator
  function createParticles() {
    const containers = document.querySelectorAll('.particles-container');
    if (!containers.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    containers.forEach(container => {
      const type = container.dataset.type || 'subtle';
      let count = 8;
      let colors = ['rgba(0,0,0,0.05)'];
      let shapes = ['50%'];
      
      if (type === 'sakura') {
        count = 15;
        colors = ['#ffb7c5', '#ffc0cb', '#ffd1dc'];
        shapes = ['50% 0 50% 50%'];
      } else if (type === 'summer') {
        count = 10;
        colors = ['#8fbc8f', '#98fb98'];
        shapes = ['0 50% 50% 50%'];
      } else if (type === 'autumn') {
        count = 12;
        colors = ['#c1121f', '#d4af37', '#e25822'];
        shapes = ['50% 0 50% 50%', '0 50% 50% 50%'];
      } else if (type === 'snow') {
        count = 30;
        colors = ['#ffffff'];
        shapes = ['50%'];
      } else if (type === 'smoke') {
        count = 6;
        colors = ['rgba(13, 27, 42, 0.2)', 'rgba(120, 0, 0, 0.1)'];
        shapes = ['50%'];
      }

      for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = type === 'snow' ? Math.random() * 4 + 2 : (type === 'smoke' ? Math.random() * 150 + 50 : Math.random() * 8 + 6);
        const left = Math.random() * 100;
        const duration = type === 'smoke' ? Math.random() * 20 + 10 : Math.random() * 8 + 6;
        const delay = Math.random() * 10;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.backgroundColor = color;
        particle.style.borderRadius = shape;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        if (type === 'smoke') {
          particle.style.filter = 'blur(20px)';
          particle.style.animationName = 'driftUp';
        } else if (type === 'snow') {
          particle.style.animationName = 'driftDown';
        }

        container.appendChild(particle);
      }
    });
  }

  createParticles();

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
