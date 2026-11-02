const root = document.documentElement;
const button = document.getElementById('theme-toggle');
function setTheme(value) {
  const theme = value === 'light' ? 'light' : 'dark';
  root.dataset.theme = theme;
  if (button) {
    button.textContent = theme === 'dark' ? '☼' : '☾';
    button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    button.setAttribute('aria-pressed', String(theme === 'light'));
  }
}
let saved;
try { saved = localStorage.getItem('pokemon-theme'); } catch {}
setTheme(saved);
button?.addEventListener('click', () => {
  setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  try { localStorage.setItem('pokemon-theme', root.dataset.theme); } catch {}
});
window.addEventListener('storage', event => { if (event.key === 'pokemon-theme') setTheme(event.newValue); });
