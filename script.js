const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

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

// ヒーローのパララックス
const hero = document.querySelector('.neon-hero');
if (hero) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.3;
    hero.style.backgroundPosition = `center calc(50% + ${offset}px)`;
  });
}

// トピックフィルタ
const chips = document.querySelectorAll('.chip-group .chip');
const articles = document.querySelectorAll('.article-list .article-card');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const topic = chip.dataset.topic;
    articles.forEach(a => {
      const topics = a.dataset.topic.split(' ');
      a.style.display = topic === 'all' || topics.includes(topic) ? '' : 'none';
    });
  });
});
