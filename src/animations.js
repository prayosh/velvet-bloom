// Velvet Bloom - Scroll Reveal and Premium Fluid Animations

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Reveal (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-10');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    // Initial State class assignments
    el.classList.add('transition-all', 'duration-700', 'ease-out', 'opacity-0', 'translate-y-10');
    revealOnScroll.observe(el);
  });

  // 2. Statistics Counter Animation
  const statsSection = document.getElementById('stats-section');
  const countElements = document.querySelectorAll('.counter-val');

  if (statsSection && countElements.length > 0) {
    let triggered = false;
    
    const countUpObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !triggered) {
        triggered = true;
        countElements.forEach(el => {
          const target = parseInt(el.getAttribute('data-target') || '0', 10);
          const duration = 2000; // 2 seconds animation
          const stepTime = Math.abs(Math.floor(duration / target));
          let current = 0;
          
          const timer = setInterval(() => {
            current += Math.ceil(target / 50); // Increment chunk size
            if (current >= target) {
              el.textContent = target;
              clearInterval(timer);
            } else {
              el.textContent = current;
            }
          }, 30);
        });
      }
    }, { threshold: 0.2 });

    countUpObserver.observe(statsSection);
  }

  // 3. Falling Rose Petals effect inside Hero or main page content
  const heroSection = document.getElementById('hero-main');
  if (heroSection) {
    for (let i = 0; i < 8; i++) {
      createPetal(heroSection);
    }
  }
});

function createPetal(container) {
  const petal = document.createElement('div');
  petal.className = 'absolute w-3 h-3 md:w-4 md:h-4 bg-rose-pink/20 rounded-t-full rounded-br-full pointer-events-none z-0';
  
  // Random initialization dimensions
  const startX = Math.random() * 100; // Percentage horizontal
  const startDelay = Math.random() * 8; // delay in seconds
  const fallDuration = 10 + Math.random() * 15; // duration in seconds
  const rotation = Math.random() * 360;
  
  petal.style.left = `${startX}%`;
  petal.style.top = `-20px`;
  petal.style.transform = `rotate(${rotation}deg)`;
  petal.style.animation = `fall ${fallDuration}s linear infinite`;
  petal.style.animationDelay = `${startDelay}s`;
  
  // Custom custom stylesheet animation injection
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes fall {
      0% {
        top: -10px;
        transform: rotate(0deg) translateX(0);
        opacity: 0;
      }
      10% {
        opacity: 0.6;
      }
      90% {
        opacity: 0.6;
      }
      100% {
        top: 105%;
        transform: rotate(360deg) translateX(50px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  container.appendChild(petal);
}
