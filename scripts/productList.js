/** =========================
 *  설정
 *  ========================= */
const OVERRIDES_BY_ID = {
  // 예: 5: { title: '버그를 Java라 버그잡는 개리씨 키링 개발자키링', price: 29000, seller: '파이썬스쿨' },
};
const ORDER_WHEN_OVERRIDDEN = "desc";
const FETCH_TIMEOUT = 8000;
const SYNC_TO_SERVER = false;
const AUTH_TOKEN = null;
const ABOVE_THE_FOLD = 6;

/** =========================
 *  유틸
 *  ========================= */
const API_BASE = "https://api.wenivops.co.kr/services/open-market";
const PRODUCTS_URL = `${API_BASE}/products/`;
const KRW = (n) => new Intl.NumberFormat("ko-KR").format(Number(n || 0));
const toHttps = (u) => (u || "").replace(/^http:\/\//i, "https://");
const hasOverrides = Object.keys(OVERRIDES_BY_ID).length > 0;

function whenImageReady(img) {
  if (img.decode) return img.decode().catch(() => {});
  if (img.complete && img.naturalWidth > 0) return Promise.resolve();
  return new Promise((res) =>
    img.addEventListener("load", res, { once: true }),
  );
}

/** =========================
 *  내비게이션 (해시 라우팅)
 *  ========================= */
const DETAIL_HASH_PREFIX = "#product?id=";
const toDetailHash = (id) => `${DETAIL_HASH_PREFIX}${encodeURIComponent(id)}`;

/** =========================
 *  서버 동기화(선택)
 *  ========================= */
async function putProduct(id, patch) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (AUTH_TOKEN) headers.Authorization = `Bearer ${AUTH_TOKEN}`;
  const res = await fetch(`${API_BASE}/products/${id}/`, {
    method: "PUT",
    headers,
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} (id:${id})`);
  return res.json();
}
async function syncOverridesToServer(map) {
  for (const [idStr, o] of Object.entries(map)) {
    const payload = {};
    if (o?.title !== undefined) payload.name = String(o.title);
    if (o?.price !== undefined) payload.price = Number(o.price);
    if (!Object.keys(payload).length) continue;
    await putProduct(Number(idStr), payload);
  }
}

/** =========================
 *  데이터 정규화
 *  ========================= */
function buildItem(raw, idx) {
  const id = raw?.id ?? idx;
  const o = hasOverrides ? OVERRIDES_BY_ID[id] : undefined;
  const title = o?.title ?? raw?.title ?? raw?.name ?? "상품명";
  const price = o?.price ?? Number(raw?.price ?? 0);
  const seller =
    o?.seller !== undefined
      ? String(o.seller)
      : (raw?.seller?.store_name ??
        raw?.seller?.name ??
        raw?.store_name ??
        raw?.store ??
        "");
  return {
    id,
    title: String(title),
    seller: String(seller || ""),
    price,
    image: toHttps(raw?.image ?? ""),
    stock: raw?.stock ?? 999,
  };
}
function getIdComparator(order = "desc") {
  return (a, b) => {
    const A = +a.id || 0,
      B = +b.id || 0;
    return order === "asc" ? A - B : B - A;
  };
}

/** =========================
 *  카드 생성
 *  ========================= */
function createCard(p, i) {
  const el = document.createElement("article");
  el.dataset.id = p.id;
  el.className =
    "rounded-2xl p-4 bg-transparent cursor-pointer " +
    "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#21BF48]/40";

  const fig = document.createElement("figure");
  fig.className = "relative";

  const img = document.createElement("img");
  img.className = "w-full aspect-square object-cover";
  img.alt = p.title || "상품 이미지";
  img.src = p.image;

  if (i < ABOVE_THE_FOLD) {
    img.loading = "eager";
    img.setAttribute("fetchpriority", "high");
  } else {
    img.loading = "lazy";
  }
  img.width = 512;
  img.height = 512;

  fig.appendChild(img);

  const meta = document.createElement("p");
  meta.className = "mt-3 text-[13px] text-gray-400";
  if (p.seller) meta.textContent = p.seller;

  const title = document.createElement("h3");
  title.className = "mt-1 text-base leading-snug text-gray-900";
  title.style.display = "-webkit-box";
  title.style.webkitLineClamp = "2";
  title.style.webkitBoxOrient = "vertical";
  title.style.overflow = "hidden";
  title.textContent = p.title;

  const priceWrap = document.createElement("p");
  priceWrap.className = "mt-3 flex items-baseline flex-wrap gap-x-2 gap-y-1";
  const strong = document.createElement("span");
  strong.className = "text-2xl font-extrabold text-gray-900 align-baseline";
  strong.textContent = KRW(p.price);
  const won = document.createElement("span");
  won.className = "ml-1 text-gray-900 align-baseline";
  won.textContent = "원";
  priceWrap.append(strong, won);

  // 상세 페이지로 이동
  const url = toDetailHash(p.id);
  el.setAttribute("role", "link");
  el.setAttribute("aria-label", `${p.title} 상세보기`);
  el.tabIndex = 0;
  el.addEventListener("click", () => {
    location.href = url;
  });
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      location.href = url;
    }
  });

  el.append(fig, meta, title, priceWrap);
  return el;
}

/** =========================
 *  메인 로드
 *  ========================= */
let _loading = false;
async function main() {
  const grid = document.getElementById("grid");
  const errorEl = document.getElementById("error");
  if (!grid || _loading) return;
  _loading = true;

  // 스켈레톤 (최초만)
  if (!grid.querySelector("[data-skel]")) {
    const skelTpl = document.getElementById("skeleton")?.content;
    if (skelTpl) {
      const frag = document.createDocumentFragment();
      for (let i = 0; i < 8; i++) {
        const clone = skelTpl.cloneNode(true);
        clone.firstElementChild?.setAttribute?.("data-skel", "1");
        frag.appendChild(clone);
      }
      grid.replaceChildren(frag);
    }
  }

  // 타임아웃 fetch
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort("timeout"), FETCH_TIMEOUT);

  try {
    const res = await fetch(PRODUCTS_URL, {
      headers: { Accept: "application/json" },
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error("HTTP " + res.status);

    const data = await res.json();
    const rawList = Array.isArray(data) ? data : data.results || [];
    if (!Array.isArray(rawList)) throw new Error("Invalid payload");

    const items = [];
    for (let i = 0; i < rawList.length; i++)
      items.push(buildItem(rawList[i], i));
    if (hasOverrides) items.sort(getIdComparator(ORDER_WHEN_OVERRIDDEN));

    const frag = document.createDocumentFragment();
    for (let i = 0; i < items.length; i++)
      frag.appendChild(createCard(items[i], i));
    grid.replaceChildren(frag);

    if (SYNC_TO_SERVER && hasOverrides)
      await syncOverridesToServer(OVERRIDES_BY_ID);

    const imgs = grid.querySelectorAll("img");
    for (let i = 0; i < Math.min(imgs.length, ABOVE_THE_FOLD); i++)
      whenImageReady(imgs[i]);

    if (errorEl) {
      errorEl.textContent = "";
      errorEl.classList.add("hidden");
    }
  } catch (err) {
    clearTimeout(timer);
    if (grid) grid.innerHTML = "";
    if (errorEl) {
      errorEl.textContent = `상품 정보를 불러오지 못했습니다. (${err.message || err})`;
      errorEl.classList.remove("hidden");
    }
    console.error("[shop:error]", err);
  } finally {
    _loading = false;
  }
}

/** =========================
 *  마운트(호출부) — 동적 주입 대응
 *  ========================= */
function forceEagerAboveTheFold() {
  const gridEl = document.getElementById("grid");
  if (!gridEl) return;
  const imgs = gridEl.querySelectorAll("img");
  imgs.forEach((img, i) => {
    if (i < ABOVE_THE_FOLD) {
      img.loading = "eager";
      img.setAttribute("fetchpriority", "high");
    }
  });
}
function gridHasCards() {
  return !!document.querySelector("#grid article");
}

// 동적으로 주입될 때를 대비해, 그리드가 생길 때까지 재시도
let _mountScheduled = false;
function scheduleMount(tries = 0) {
  if (_mountScheduled) return;
  _mountScheduled = true;

  const tryMount = () => {
    const gridEl = document.getElementById("grid");
    if (gridEl) {
      _mountScheduled = false;
      forceEagerAboveThe_FoldSafe();
      if (!gridHasCards()) main();
      return;
    }
    if (tries < 20) {
      tries += 1;
      setTimeout(tryMount, 50); // 50ms 간격으로 최대 1초 재시도
    } else {
      _mountScheduled = false;
    }
  };
  tryMount();
}
// 오타 방지용 wrapper
function forceEagerAboveThe_FoldSafe() {
  try {
    forceEagerAboveTheFold();
  } catch (_) {}
}

/** =========================
 *  이벤트 바인딩 + 즉시 마운트
 *  ========================= */
document.addEventListener("DOMContentLoaded", () => {
  scheduleMount();
});
window.addEventListener("pageshow", () => {
  scheduleMount();
});
window.addEventListener("hashchange", () => {
  scheduleMount();
});

// ★ 동적으로 script가 삽입된 경우를 위해, 로드 즉시 한 번 시도
scheduleMount();
