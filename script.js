// Close dropdown on second click (mobile)
document.addEventListener('DOMContentLoaded', () => {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const dropdown = document.querySelector('.dropdown');
  
    dropdownToggle.addEventListener('click', function (e) {
      e.preventDefault();
      dropdown.classList.toggle('show');
      dropdownMenu.classList.toggle('show');
    });
  
    // Close dropdown if clicking outside
    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
        dropdownMenu.classList.remove('show');
      }
    });
  
    // 🔆 Navbar glow on scroll
    const nav = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        nav.style.boxShadow = '0 6px 16px rgba(255, 105, 180, 0.4)';
      } else {
        nav.style.boxShadow =
          '0 4px 12px rgba(255, 105, 180, 0.3), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.1)';
      }
    });
  });
  