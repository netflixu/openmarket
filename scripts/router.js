import { setIcons } from "./header.js";
import { renderFooter } from "./footer.js";

// SPA 진입 포인트: 라우팅이 이루어질 루트 DOM 요소
const root = document.getElementById("app");

// 동적 스크립트 로더 (중복 로드 방지 + 에러 처리)
function loadScript(src, id) {
  return new Promise((resolve, reject) => {
    // 같은 id가 이미 있으면 재로드하지 않음
    if (id) {
      const existing = document.getElementById(id);
      if (existing) return resolve();
    }

    const s = document.createElement("script");
    if (id) s.id = id;
    s.src = src;
    s.type = "module"; // ESM 사용 중이면 유지
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`SCRIPT_LOAD_FAILED: ${src}`));
    document.body.appendChild(s); // head에 넣어도 OK
  });
}

// 1. 페이지 템플릿 및 JS 로딩 함수 (비동기)
async function loadPage(hash) {
  // 예: #product?id=2 → product
  const rawPage = hash || "productList";
  const page = rawPage.split("?")[0];

  try {
    // [1] HTML 템플릿 로딩 (+ 실패 시 throw)
    const res = await fetch(`./templates/${page}.html`);
    if (!res.ok) throw new Error(`TEMPLATE_NOT_FOUND: ${page}`);
    const html = await res.text();
    root.innerHTML = html;

    // [2] 공통 Header 로딩 (있을 때만)
    const headerContainer = document.getElementById("header");
    if (headerContainer) {
      const headerRes = await fetch("./components/header.html");
      if (headerRes.ok) {
        headerContainer.innerHTML = await headerRes.text();
        setIcons();
      }
    }

    const FooterContainer = document.getElementById("footer");
    if (FooterContainer) {
      try {
        // 상대경로 권장: 현재 페이지 기준
        const footerRes = await fetch("./components/footer.html");
        if (!footerRes.ok) throw new Error(`Footer HTTP ${footerRes.status}`);
        FooterContainer.innerHTML = await footerRes.text();
      } catch (err) {
        console.warn("Footer HTML load failed, fallback to JS component:", err);
        FooterContainer.innerHTML = "";
        // JS 컴포넌트 방식 (footer.js)
        renderFooter(FooterContainer); // 옵션 필요시 두 번째 인자로 전달
      }
    }

    // [3] 해당 페이지 JS 로딩 (+ 실패 시 throw → 404 폴백)
    await loadScript(`./scripts/${page}.js`, `page-script-${page}`);

    window.scrollTo(0, 0);
  } catch (err) {
    // [4] 로딩 실패(템플릿/스크립트) → 404 페이지로 폴백
    const res404 = await fetch("./templates/404.html");
    const html404 = res404.ok
      ? await res404.text()
      : `<p style="text-align:center; margin-top:10rem;">페이지를 불러오는 중 오류가 발생했습니다.</p>`;
    root.innerHTML = html404;

    // 404의 '이전 페이지' 버튼 동작 스크립트 로드
    await loadScript("./scripts/404.js", "page-script-404");
    window.scrollTo(0, 0);
  }
}

// 2. 해시 변경 감지 → 페이지 로딩 및 init 함수 실행
function handleHashChange() {
  const hash = location.hash.replace("#", ""); // ex: product?id=2
  const page = hash.split("?")[0];
  const params = new URLSearchParams(hash.split("?")[1]);
  const id = params.get("id");

  //[비동기] 페이지 로딩 후 init 함수 호출
  loadPage(hash).then(() => {
    // 각 페이지별 초기화 함수 패턴
    const initFunctions = {
      product: () => window.initProductPage?.(id),
      join: () => window.joinDOM?.init?.(),
      login: () => window.initLoginPage?.(),
      productList: () => window.initProductListPage?.(),
      // 새로운 페이지 추가 시 여기에만 추가하면 됨
    };

    // 해당 페이지의 초기화 함수 실행
    if (initFunctions[page]) {
      try {
        initFunctions[page]();
        console.log(`${page} 페이지 초기화 완료`);
      } catch (error) {
        console.error(`${page} 페이지 초기화 실패:`, error);
      }
    }
  });
}

// 3. 이벤트 연결 (초기 진입 또는 해시 변경 시 라우터 실행)
window.addEventListener("hashchange", () => {
  handleHashChange(); // 사용자가 페이지 내 이동하거나 브라우저 뒤로가기 등
});

window.addEventListener("DOMContentLoaded", () => {
  handleHashChange(); // 최초 진입 시에도 URL 해시를 기준으로 렌더링
});
