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


// 需要と供給のインタラクティブなグラフ
const demandShiftSlider = document.getElementById('demand-shift');
const supplyShiftSlider = document.getElementById('supply-shift');
const demandCurve = document.getElementById('demand-curve');
const supplyCurve = document.getElementById('supply-curve');
const eqPoint = document.getElementById('eqPoint');
const eqPriceEl = document.getElementById('eq-price');
const eqQuantityEl = document.getElementById('eq-quantity');
const revenueEl = document.getElementById('revenue');

// グラフの描画領域に関する定数
const SVG_WIDTH = 200;
const SVG_HEIGHT = 200;
const PADDING = 10; // 軸の余白
const MAX_PRICE = 100;
const MAX_QUANTITY = 100;

// P = a - bQ (需要曲線)
// P = c + dQ (供給曲線)
const b = 1; // 需要曲線の傾き
const d = 1; // 供給曲線の傾き

function updateSupplyDemandChart() {
  const demandShift = Number(demandShiftSlider.value); // -50 to 50
  const supplyShift = Number(supplyShiftSlider.value); // -50 to 50

  // シフト値から切片を計算
  const a = 150 + demandShift; // 需要曲線のP切片(価格軸)
  const c = 50 + supplyShift;  // 供給曲線のP切片(価格軸)

  // 均衡点を計算
  // a - bQ = c + dQ  => a - c = (b+d)Q
  let eqQuantity = (a - c) / (b + d);
  let eqPrice = a - b * eqQuantity;

  // 描画範囲内に収める
  eqQuantity = Math.max(0, Math.min(MAX_QUANTITY, eqQuantity));
  eqPrice = Math.max(0, Math.min(MAX_PRICE, eqPrice));

  // SVG座標に変換
  // Y軸は上が0なので反転させる
  const plotX = (q) => PADDING + (q / MAX_QUANTITY) * (SVG_WIDTH - PADDING * 2);
  const plotY = (p) => SVG_HEIGHT - PADDING - (p / MAX_PRICE) * (SVG_HEIGHT - PADDING * 2);

  // 均衡点の座標
  const eqX = plotX(eqQuantity);
  const eqY = plotY(eqPrice);

  // 曲線の端点を計算して描画
  // 需要曲線: (0, a) to (a/b, 0)
  let dq1 = 0, dp1 = a;
  let dq2 = a/b, dp2 = 0;
  demandCurve.setAttribute('x1', plotX(dq1));
  demandCurve.setAttribute('y1', plotY(dp1));
  demandCurve.setAttribute('x2', plotX(dq2));
  demandCurve.setAttribute('y2', plotY(dp2));

  // 供給曲線: (0, c) to (MAX_Q, c+d*MAX_Q)
  let sq1 = 0, sp1 = c;
  let sq2 = MAX_QUANTITY, sp2 = c + d * MAX_QUANTITY;
  supplyCurve.setAttribute('x1', plotX(sq1));
  supplyCurve.setAttribute('y1', plotY(sp1));
  supplyCurve.setAttribute('x2', plotX(sq2));
  supplyCurve.setAttribute('y2', plotY(sp2));

  // 均衡点を更新
  eqPoint.setAttribute('cx', eqX);
  eqPoint.setAttribute('cy', eqY);

  // 結果を表示
  const revenue = Math.floor(eqPrice * eqQuantity);
  eqPriceEl.textContent = `均衡価格: ¥${Math.floor(eqPrice)}`;
  eqQuantityEl.textContent = `均衡数量: ${Math.floor(eqQuantity)}`;
  revenueEl.textContent = `総売上: ¥${revenue}`;
}


if (demandShiftSlider && supplyShiftSlider) {
  demandShiftSlider.addEventListener('input', updateSupplyDemandChart);
  supplyShiftSlider.addEventListener('input', updateSupplyDemandChart);
  // 初期表示
  updateSupplyDemandChart();
}