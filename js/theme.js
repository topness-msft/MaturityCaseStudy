(function(){
  const KEY = 'sarahchen.theme';
  const root = document.documentElement;
  const stored = localStorage.getItem(KEY);
  const apply = (theme) => {
    if (theme === 'dark') root.classList.add('dark-mode');
    else root.classList.remove('dark-mode');
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      const isDark = theme === 'dark';
      btn.querySelector('.theme-toggle-icon').textContent = isDark ? '☀' : '☾';
      btn.querySelector('.theme-toggle-text').textContent = isDark ? 'Light' : 'Dark';
    }
  };
  apply(stored === 'dark' ? 'dark' : 'light');
  document.addEventListener('DOMContentLoaded', () => {
    apply(stored === 'dark' ? 'dark' : 'light');
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const next = root.classList.contains('dark-mode') ? 'light' : 'dark';
      localStorage.setItem(KEY, next);
      apply(next);
    });
  });
})();
