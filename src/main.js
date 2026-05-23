// Velvet Bloom - Main Interactive JS Handler

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation Blur with Scroll
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('bg-plum-black/90', 'shadow-md', 'backdrop-blur-md');
        header.classList.remove('bg-plum-black/75');
      } else {
        header.classList.add('bg-plum-black/75');
        header.classList.remove('bg-plum-black/90', 'shadow-md', 'backdrop-blur-md');
      }
    });
  }

  // 2. Mobile Menu Drawer Toggling
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-menu-drawer');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.remove('translate-y-[-100%]');
      drawer.classList.add('translate-y-0');
      document.body.style.overflow = 'hidden'; // Disable scroll under screen
    });
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.add('translate-y-[-100%]');
      drawer.classList.remove('translate-y-0');
      document.body.style.overflow = ''; // Re-enable scroll
    });
  }

  // Auto-close drawer on menu option clicks
  const drawerLinks = drawer ? drawer.querySelectorAll('a') : [];
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (drawer) {
        drawer.classList.add('translate-y-[-100%]');
        drawer.classList.remove('translate-y-0');
        document.body.style.overflow = '';
      }
    });
  });

  // 3. Highlight currently active Navigation Link matching current page filename
  const navLinks = document.querySelectorAll('.nav-link');
  const path = window.location.pathname;
  const pageName = path.substring(path.lastIndexOf('/') + 1);

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (pageName === href || (pageName === '' && href === 'index.html')) {
      link.classList.remove('text-lavender-white/75');
      link.classList.add('text-rose-pink', 'border-b', 'border-rose-pink/50', 'pb-1');
    }
  });
});
