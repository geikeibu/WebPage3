document.getElementById('year').textContent = new Date().getFullYear();
// スクロールで .reveal 要素に .is-visible を付与
(() => {
  const targets = document.querySelectorAll('.reveal');

  // 古いブラウザ or 動きを減らす設定 → すぐ表示
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obs.unobserve(e.target); // 一度見えたら監視解除
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  targets.forEach(el => io.observe(el));
})();
