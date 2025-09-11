

/** =========================
 *  설정
 *  ========================= */
// 프런트 표기용 오버라이드 (비어있으면 API 그대로 사용)
const OVERRIDES_BY_ID = {
  // 예시: 실제 id/문구에 맞춰 수정하세요. 비워두면 {} 그대로 두면 됨.
  // 5: { title: '버그를 Java라 버그잡는 개리씨 키링 개발자키링',price: 29000, seller: '파이썬스쿨' },
  // 4: { title: '우당탕탕 라이캣의 실험실 스티커 팩',price: 29000, seller: '코딩앤유' },
  // 3: { title: '딥러닝 개발자 무릎 담요',price: 29000, seller: '백엔드글로벌' },
  // 2: { title: '네 개발잡니다 개발자키링 금속키링',price: 29000, seller: '제주코딩베이스캠프' },
  // 1: { title: 'Hack Your Life 개발자 노트북 파우치', price: 29000, seller: '우당탕탕 라이캣의 실험실' },
};

// 오버라이드가 있을 때만 정렬을 적용 (asc | desc)
const ORDER_WHEN_OVERRIDDEN = 'desc';

// 네트워크 타임아웃(ms)
const FETCH_TIMEOUT = 8000;

// 서버 반영(PUT)은 기본 비활성화
const SYNC_TO_SERVER = false;
const AUTH_TOKEN = null;

/** =========================
 *  유틸
 *  ========================= */
const API_BASE = 'https://api.wenivops.co.kr/services/open-market';
const PRODUCTS_URL = `${API_BASE}/products/`;
const KRW = n => new Intl.NumberFormat('ko-KR').format(Number(n || 0));
const toHttps = u => (u || '').replace(/^http:\/\//i, 'https://');
const hasOverrides = Object.keys(OVERRIDES_BY_ID).length > 0;

// PUT 유틸 (선택)
async function putProduct(id, patch) {
  const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
  if (AUTH_TOKEN) headers.Authorization = `Bearer ${AUTH_TOKEN}`;
  const res = await fetch(`${API_BASE}/products/${id}/`, {
    method: 'PUT', headers, body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} (id:${id})`);
  return res.json();
}
async function syncOverridesToServer(map) {
  for (const [idStr, o] of Object.entries(map)) {
    const payload = {};
    if (o?.title !== undefined) payload.name = String(o.title); // 서버 필드명 name
    if (o?.price !== undefined) payload.price = Number(o.price);
    if (!Object.keys(payload).length) continue;
    await putProduct(Number(idStr), payload);
  }
}

// 최종 아이템 생성(정규화 + 오버라이드까지 한 번에)
function buildItem(raw, idx) {
  const id = raw?.id ?? idx;
  const o  = hasOverrides ? OVERRIDES_BY_ID[id] : undefined;
  const title  = o?.title  ?? raw?.title ?? raw?.name ?? '상품명';
  const price  = o?.price  ?? Number(raw?.price ?? 0);
  const seller = (o?.seller !== undefined)
    ? String(o.seller)
    : (raw?.seller?.store_name ?? raw?.seller?.name ?? raw?.store_name ?? raw?.store ?? '');
  return {
    id,
    title: String(title),
    seller: String(seller || ''),
    price,
    image: toHttps(raw?.image ?? ''),
    stock: raw?.stock ?? 999,
  };
}

// 정렬 비교함수 (id 기준)
function getIdComparator(order = 'desc') {
  return (a, b) => {
    const A = +a.id || 0, B = +b.id || 0;
    return order === 'asc' ? A - B : B - A;
  };
}

/** =========================
 *  렌더
 *  ========================= */
function createCard(p) {
  const el = document.createElement('article');
  el.dataset.id = p.id;
  el.className = 'rounded-2xl p-4 bg-transparent';

  const fig = document.createElement('figure');
  fig.className = 'relative overflow-hidden rounded-[14px] border border-gray-300';

  const img = document.createElement('img');
  img.className = 'w-full aspect-square object-cover';
  img.alt = p.title || '상품 이미지';
  img.loading = 'lazy';
  img.src = p.image;
  fig.appendChild(img);

  const meta = document.createElement('p');
  meta.className = 'mt-3 text-[13px] text-gray-400';
  if (p.seller) meta.textContent = p.seller;

  const title = document.createElement('h3');
  title.className = 'mt-1 text-base leading-snug text-gray-900';
  title.style.display = '-webkit-box';
  title.style.webkitLineClamp = '2';
  title.style.webkitBoxOrient = 'vertical';
  title.style.overflow = 'hidden';
  title.textContent = p.title;

  const priceWrap = document.createElement('p');
  priceWrap.className = 'mt-3 flex items-baseline flex-wrap gap-x-2 gap-y-1';
  const strong = document.createElement('span');
  strong.className = 'text-2xl font-extrabold text-gray-900 align-baseline';
  strong.textContent = KRW(p.price);
  const won = document.createElement('span');
  won.className = 'ml-1 text-gray-900 align-baseline';
  won.textContent = '원';
  priceWrap.append(strong, won);

  el.append(fig, meta, title, priceWrap);
  return el;
}

// 스켈레톤 & 컨테이너
const grid = document.getElementById('grid');
const skelTpl = document.getElementById('skeleton')?.content;
if (skelTpl) for (let i = 0; i < 8; i++) grid.appendChild(skelTpl.cloneNode(true));

/** =========================
 *  엔트리
 *  ========================= */
async function main() {
  const errorEl = document.getElementById('error');

  // 타임아웃이 있는 fetch
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort('timeout'), FETCH_TIMEOUT);

  try {
    const res = await fetch(PRODUCTS_URL, { headers: { Accept: 'application/json' }, signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error('HTTP ' + res.status);

    const data = await res.json();
    const rawList = Array.isArray(data) ? data : (data.results || []);
    if (!Array.isArray(rawList)) throw new Error('Invalid payload');

    // 단일 for 루프로 정규화(+오버라이드) 수행
    const items = [];
    for (let i = 0; i < rawList.length; i++) {
      items.push(buildItem(rawList[i], i));
    }

    // 오버라이드가 있을 때만 정렬 실행(불필요한 비교 최소화)
    if (hasOverrides) items.sort(getIdComparator(ORDER_WHEN_OVERRIDDEN));

    // 배치 삽입으로 리플로우 최소화
    const frag = document.createDocumentFragment();
    for (let i = 0; i < items.length; i++) {
      frag.appendChild(createCard(items[i]));
    }
    grid.replaceChildren(frag);

    // 선택: 서버에 실제 반영
    if (SYNC_TO_SERVER && hasOverrides) {
      await syncOverridesToServer(OVERRIDES_BY_ID);
    }

  } catch (err) {
    clearTimeout(timer);
    grid.innerHTML = '';
    errorEl.textContent = `상품 정보를 불러오지 못했습니다. (${err.message || err})`;
    errorEl.classList.remove('hidden');
    console.error('[shop:error]', err);
  }
}

main();