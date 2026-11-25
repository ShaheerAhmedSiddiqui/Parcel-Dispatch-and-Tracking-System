
/* =========================================
   ParcelTrack - Shared JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  // Mobile public navigation
  const navToggle = document.getElementById('publicNavToggle');
  const navLinks = document.getElementById('publicNavLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');

      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute(
        'aria-label',
        isOpen ? 'Close navigation menu' : 'Open navigation menu'
      );

      navToggle.innerHTML = isOpen
        ? '<span aria-hidden="true">&times;</span>'
        : '<span aria-hidden="true">&#9776;</span>';
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation menu');
        navToggle.innerHTML = '<span aria-hidden="true">&#9776;</span>';
      });
    });
  }

  // Show / hide password
  document.querySelectorAll('[data-toggle-password]').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-toggle-password');
      const passwordInput = document.getElementById(targetId);

      if (!passwordInput) return;

      const shouldShow = passwordInput.type === 'password';

      passwordInput.type = shouldShow ? 'text' : 'password';
      button.textContent = shouldShow ? 'Hide' : 'Show';
      button.setAttribute(
        'aria-label',
        shouldShow ? 'Hide password' : 'Show password'
      );
    });
  });

  // Dismissible alerts
  document.querySelectorAll('[data-dismiss-alert]').forEach((button) => {
    button.addEventListener('click', () => {
      const alert = button.closest('.alert');

      if (alert) {
        alert.remove();
      }
    });
  });

  // Automatic footer year
  const yearElement = document.getElementById('currentYear');

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Homepage tracking form
  const trackingForm = document.getElementById('homeTrackingForm');

  if (trackingForm) {
    const trackingInput = document.getElementById('homeTrackingNumber');
    const trackingError = document.getElementById('trackingFormError');

    trackingForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const trackingNumber = trackingInput.value.trim();

      if (!trackingNumber) {
        trackingError.textContent = 'Please enter your tracking number.';
        trackingInput.focus();
        return;
      }

      trackingError.textContent = '';

      window.location.href =
        '/track/' + encodeURIComponent(trackingNumber);
    });

    trackingInput.addEventListener('input', () => {
      trackingError.textContent = '';
    });
  }

});
