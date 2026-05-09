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

  // Koi and Ripple Generator
  function createWaterEffects() {
    const containers = document.querySelectorAll('.koi-container');
    if (!containers.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let globalMouseX = null;
    let globalMouseY = null;
    
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!isTouchDevice) {
      document.addEventListener('mousemove', (e) => {
        globalMouseX = e.clientX;
        globalMouseY = e.clientY;
      });
    }

    class Koi {
      constructor(container) {
        this.container = container;
        this.el = document.createElement('div');
        this.el.classList.add('koi-wrapper');
        
        this.size = Math.random() * 110 + 70; // 70 to 180px
        this.baseSpeed = Math.random() * 0.5 + 0.5; // 0.5 to 1.0 px/frame
        this.speed = this.baseSpeed;
        this.maxSpeed = this.baseSpeed * 4;
        this.opacity = Math.random() * 0.2 + 0.1; // 0.1 to 0.3 depth
        
        const colorSets = [
          { b: '#fbf9f4', f: '#fbf9f4', p1: '#c1121f', p2: '#c1121f', e: '#1b263b' }, // Kohaku (White/Red)
          { b: '#fbf9f4', f: '#fbf9f4', p1: '#c1121f', p2: '#1b263b', e: '#1b263b' }, // Taisho Sanke (White/Red/Black)
          { b: '#d4af37', f: '#d4af37', p1: '#a67c00', p2: '#e5c158', e: '#780000' }, // Ogon (Gold)
          { b: '#0d1b2a', f: '#0d1b2a', p1: '#1b263b', p2: '#1b263b', e: '#fbf9f4' }, // Karasugoi (Black/Indigo)
          { b: '#c1121f', f: '#c1121f', p1: '#0d1b2a', p2: '#1b263b', e: '#fbf9f4' }, // Aka Bekko (Red/Black)
          { b: '#e0e6ed', f: '#e0e6ed', p1: '#7a8c9e', p2: '#c1121f', e: '#1b263b' }  // Asagi (Pale/Markings)
        ];
        const c = colorSets[Math.floor(Math.random() * colorSets.length)];
        this.el.style.setProperty('--koi-base', c.b);
        this.el.style.setProperty('--koi-fin', c.f);
        this.el.style.setProperty('--koi-p1', c.p1);
        this.el.style.setProperty('--koi-p2', c.p2);
        this.el.style.setProperty('--koi-eye', c.e);
        
        this.el.style.width = `${this.size}px`;
        this.el.style.height = `${this.size}px`;
        this.el.style.opacity = this.opacity;
        this.el.style.zIndex = Math.floor(this.opacity * 100);
        
        const dur = (Math.random() * 0.4 + 0.8) / this.baseSpeed;
        this.el.style.setProperty('--dur', `${dur}s`);
        this.el.style.setProperty('--delay', `-${Math.random() * 2}s`);
        
        const clipId = 'clip_' + Math.random().toString(36).substr(2, 9);
        const patches = [
          `<path d="M ${30 + Math.random()*10},${10 + Math.random()*10} Q ${60 + Math.random()*20},${10 + Math.random()*20} ${70 - Math.random()*10},${30 + Math.random()*15} Q ${40 + Math.random()*20},${40 + Math.random()*10} ${30 - Math.random()*10},${25 + Math.random()*10} Z" fill="var(--koi-p1)"/>`,
          `<circle cx="${50 + (Math.random()-0.5)*10}" cy="${50 + (Math.random()-0.5)*10}" r="${15 + Math.random()*10}" fill="var(--koi-p2)"/>`,
          `<ellipse cx="${50 + (Math.random()-0.5)*10}" cy="${80 + (Math.random()-0.5)*10}" rx="${10 + Math.random()*5}" ry="${15 + Math.random()*10}" fill="var(--koi-p1)"/>`
        ].join('');

        this.el.innerHTML = `
          <svg viewBox="0 0 100 140" class="koi-svg">
            <defs>
              <clipPath id="${clipId}">
                <path d="M 50,10 C 70,25 75,55 50,100 C 25,55 30,25 50,10 Z"/>
              </clipPath>
            </defs>
            <g style="transform-origin: 50px 95px; animation: tailSway var(--dur) ease-in-out var(--delay) infinite alternate;">
              <path d="M 50,95 C 60,115 75,125 50,135 C 25,125 40,115 50,95 Z" fill="var(--koi-fin)" opacity="0.8"/>
              <path d="M 50,95 L 45,125 M 50,95 L 50,130 M 50,95 L 55,125" stroke="var(--koi-eye)" stroke-width="0.5" opacity="0.3"/>
            </g>
            <g style="transform-origin: 30px 40px; animation: finSway var(--dur) ease-in-out var(--delay) infinite alternate;">
              <path d="M 35,35 C 10,30 5,50 35,45 Z" fill="var(--koi-fin)" opacity="0.8"/>
              <path d="M 35,35 L 15,45 M 35,35 L 20,40 M 35,35 L 25,48" stroke="var(--koi-eye)" stroke-width="0.5" opacity="0.3"/>
            </g>
            <g style="transform-origin: 70px 40px; animation: finSwayReverse var(--dur) ease-in-out var(--delay) infinite alternate;">
              <path d="M 65,35 C 90,30 95,50 65,45 Z" fill="var(--koi-fin)" opacity="0.8"/>
              <path d="M 65,35 L 85,45 M 65,35 L 80,40 M 65,35 L 75,48" stroke="var(--koi-eye)" stroke-width="0.5" opacity="0.3"/>
            </g>
            <path d="M 50,10 C 70,25 75,55 50,100 C 25,55 30,25 50,10 Z" fill="var(--koi-base)"/>
            <g clip-path="url(#${clipId})">
              ${patches}
              <path d="M 40,30 Q 50,40 60,30 M 42,40 Q 50,50 58,40 M 45,50 Q 50,60 55,50 M 45,60 Q 50,70 55,60" fill="none" stroke="var(--koi-eye)" stroke-width="0.5" opacity="0.15"/>
            </g>
            <circle cx="42" cy="18" r="2" fill="var(--koi-eye)" opacity="0.7"/>
            <circle cx="58" cy="18" r="2" fill="var(--koi-eye)" opacity="0.7"/>
            <path d="M 40,12 Q 35,5 30,10" fill="none" stroke="var(--koi-eye)" stroke-width="1" opacity="0.5"/>
            <path d="M 60,12 Q 65,5 70,10" fill="none" stroke="var(--koi-eye)" stroke-width="1" opacity="0.5"/>
          </svg>
        `;
        
        const bounds = this.container.getBoundingClientRect();
        this.x = Math.random() * (bounds.width || window.innerWidth);
        this.y = Math.random() * (bounds.height || window.innerHeight);
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        
        this.setNewTarget();
        this.container.appendChild(this.el);
      }
      
      setNewTarget() {
        const bounds = this.container.getBoundingClientRect();
        this.targetX = Math.random() * (bounds.width || window.innerWidth);
        this.targetY = Math.random() * (bounds.height || window.innerHeight);
      }
      
      update() {
        const bounds = this.container.getBoundingClientRect();
        if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;

        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distToTarget = Math.sqrt(dx*dx + dy*dy);
        
        if (distToTarget < 100) {
          this.setNewTarget();
        }
        
        let desiredVx = (dx / distToTarget) * this.speed;
        let desiredVy = (dy / distToTarget) * this.speed;
        
        let isFleeing = false;
        if (globalMouseX !== null && globalMouseY !== null) {
          const mx = globalMouseX - bounds.left;
          const my = globalMouseY - bounds.top;
          
          const mdx = this.x - mx;
          const mdy = this.y - my;
          const mDist = Math.sqrt(mdx*mdx + mdy*mdy);
          
          if (mDist < 250) { // Flee radius
            isFleeing = true;
            const force = (250 - mDist) / 250; 
            desiredVx = (mdx / mDist) * this.maxSpeed * force;
            desiredVy = (mdy / mDist) * this.maxSpeed * force;
            this.speed = Math.min(this.speed + 0.1, this.maxSpeed);
          }
        }
        
        if (!isFleeing) {
          this.speed = Math.max(this.speed - 0.02, this.baseSpeed);
        }
        
        const turnSpeed = isFleeing ? 0.08 : 0.02; // Turn faster when fleeing
        this.vx += (desiredVx - this.vx) * turnSpeed;
        this.vy += (desiredVy - this.vy) * turnSpeed;
        
        const currentSpeed = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
        if (currentSpeed > 0) {
          this.vx = (this.vx / currentSpeed) * this.speed;
          this.vy = (this.vy / currentSpeed) * this.speed;
        }
        
        this.x += this.vx;
        this.y += this.vy;
        
        const pad = 150;
        if (this.x < -pad) this.x = bounds.width + pad;
        if (this.x > bounds.width + pad) this.x = -pad;
        if (this.y < -pad) this.y = bounds.height + pad;
        if (this.y > bounds.height + pad) this.y = -pad;
        
        const angle = Math.atan2(this.vy, this.vx) * 180 / Math.PI + 90;
        
        this.el.style.transform = `translate(${this.x - this.size/2}px, ${this.y - this.size/2}px) rotate(${angle}deg)`;
      }
    }

    const allKoi = [];

    containers.forEach(container => {
      const numKoi = Math.floor(Math.random() * 5) + 6; // 6 to 10 koi
      for (let i = 0; i < numKoi; i++) {
        const koi = new Koi(container);
        allKoi.push(koi);
      }

      setInterval(() => {
        if (document.hidden) return;
        const bounds = container.getBoundingClientRect();
        if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;

        const numRipples = Math.floor(Math.random() * 4) + 2; // 2 to 5 ripples
        for (let r = 0; r < numRipples; r++) {
          const ripple = document.createElement('div');
          ripple.classList.add('water-ripple');
          
          const size = Math.random() * 120 + 30; // 30px to 150px
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const duration = Math.random() * 4 + 4; // 4s to 8s
          const delay = Math.random() * 3; // 0s to 3s
          
          ripple.style.width = `${size}px`;
          ripple.style.height = `${size}px`;
          ripple.style.top = `${top}%`;
          ripple.style.left = `${left}%`;
          ripple.style.animationDuration = `${duration}s`;
          ripple.style.animationDelay = `${delay}s`;
          
          container.appendChild(ripple);
          
          setTimeout(() => {
            if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
          }, (duration + delay) * 1000);
        }
      }, 800);
    });

    function animate() {
      allKoi.forEach(koi => koi.update());
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    // Interactive Click Ripples
    document.addEventListener('click', (e) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      
      const ignoredSelectors = ['a', 'button', 'nav', '.card', '.feature-card', '.content-card', '.season-card', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'li', 'td', 'th', 'input', 'textarea', 'select'];
      if (ignoredSelectors.some(selector => e.target.closest(selector))) return;
      
      const container = document.querySelector('.koi-container');
      if (!container) return;
      
      const bounds = container.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;
      
      const ripple = document.createElement('div');
      ripple.classList.add('water-ripple');
      
      const size = Math.random() * 60 + 80; // 80px to 140px
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.animationDuration = '3s';
      
      container.appendChild(ripple);
      
      setTimeout(() => {
        if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
      }, 3000);
    });
  }

  createWaterEffects();

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
