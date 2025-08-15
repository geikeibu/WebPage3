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

// 検索バーの先読みサジェスト
const keywords = ['囚人のジレンマ','価格弾力性','ナッシュ均衡','ゲーム理論','限界費用','期待効用'];
const searchBar = document.querySelector('.search-bar');
if(searchBar){
  const input = searchBar.querySelector('#search-input');
  const list = searchBar.querySelector('#suggestions');
  input.addEventListener('input', () => {
    const q = input.value.trim();
    if(!q){ list.innerHTML=''; searchBar.classList.remove('open'); return; }
    const matches = keywords.filter(k => k.includes(q));
    list.innerHTML = matches.map(m => `<li>${m}</li>`).join('');
    searchBar.classList.toggle('open', matches.length>0);
  });
  list.addEventListener('click', e => {
    if(e.target.tagName === 'LI'){
      input.value = e.target.textContent;
      list.innerHTML='';
      searchBar.classList.remove('open');
    }
  });
}

// 離脱時モーダル表示
const exitModal = document.getElementById('exit-modal');
let modalShown = false;
if(exitModal){
  document.addEventListener('mouseleave', e => {
    if(e.clientY <= 0 && !modalShown){
      exitModal.classList.add('show');
      modalShown = true;
    }
  });
  document.getElementById('modal-close').addEventListener('click', () => {
    exitModal.classList.remove('show');
  });
}


// ミニ実験：価格と数量で売上を表示
const priceInput = document.getElementById('price');
const qtyInput = document.getElementById('quantity');
const revenue = document.getElementById('revenue');
const eqPoint = document.getElementById('eqPoint');
function updateLab(){
  const price = Number(priceInput.value);
  const qty = Number(qtyInput.value);
  revenue.textContent = `売上: ¥${price * qty}`;
  const x = (qty / 100) * 200;
  const y = 200 - (price / 100) * 200;
  eqPoint.setAttribute('cx', x);
  eqPoint.setAttribute('cy', y);
}
if(priceInput && qtyInput && eqPoint){
  priceInput.addEventListener('input', updateLab);
  qtyInput.addEventListener('input', updateLab);
  updateLab();
}