(() => {
  const root = document.documentElement;
  const preference = matchMedia('(prefers-color-scheme: dark)');
  const storageKey = 'industrial-portfolio-theme';
  const valid = (value) => value === 'light' || value === 'dark';
  root.dataset.enhancing = '';
  let selected;
  let transition;
  try {
    const stored = localStorage.getItem(storageKey);
    if (valid(stored)) selected = stored;
  } catch { /* Continue using the active tab. */ }

  function apply() {
    const theme = selected ?? (preference.matches ? 'dark' : 'light');
    root.dataset.theme = theme;
    document.getElementById('theme-button')?.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme');
  }

  apply();
  preference.addEventListener('change', apply);

  document.addEventListener('DOMContentLoaded', () => {
    delete root.dataset.enhancing;
    const button = document.getElementById('theme-button');
    if (!button) return;
    apply();
    button.hidden = false;
    button.addEventListener('click', () => {
      selected = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.classList.add('theme-changing');
      clearTimeout(transition);
      apply();
      try { localStorage.setItem(storageKey, selected); } catch { /* Keep this selection in memory. */ }
      transition = setTimeout(() => root.classList.remove('theme-changing'), 300);
    });
  }, { once: true });
})();
