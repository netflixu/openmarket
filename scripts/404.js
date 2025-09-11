document.querySelector('[data-back]')?.addEventListener('click', (e) => {
  e.preventDefault();
  if (history.length > 1) history.back();
  else location.href = '/';
}, { passive: false });