// SPA 진입 포인트: 라우팅이 이루어질 루트 DOM 요소
const root = document.getElementById("app");

// 1. 페이지 템플릿 및 JS 로딩 함수 (비동기)
async function loadPage(hash) {
  // 예: #product?id=2 → product
  const rawPage = hash || "productList";
  const page = rawPage.split("?")[0];

  try {
    // [1] HTML 템플릿 로딩
    const res = await fetch(`/templates/${page}.html`);
    const html = await res.text();
    root.innerHTML = html;

    // [2] 공통 Header 로딩
    const headerContainer = document.getElementById("header");
    if (headerContainer) {
      const headerRes = await fetch("/components/header.html");
      const headerHTML = await headerRes.text();
      headerContainer.innerHTML = headerHTML;
    }

    // [3] 해당 페이지에 필요한 JS 파일 로딩
    const script = document.createElement("script");
    script.src = `/scripts/${page}.js`;
    script.async = true;

    // [4] script.onload로 로딩 완료 시점까지 보장 (init 함수 실행을 위해 필요)
    return new Promise((resolve) => {
      const scriptId = `page-script-${page}`;
      const existingScript = document.getElementById(scriptId);

      if (existingScript) {
        resolve(); // 이미 script가 로드되어 있으면 그대로 init 함수만 실행
        window.scrollTo(0, 0);
        return;
      }

      const script = document.createElement("script");
      script.id = scriptId; // script 식별자 부여
      script.src = `/scripts/${page}.js`;
      script.async = true;

      script.onload = () => {
        resolve();
        window.scrollTo(0, 0);
      };

      document.body.appendChild(script);
    });
  } catch (err) {
    // [5] 로딩 실패 (404 등) → 예외 페이지 처리
    const res404 = await fetch("/templates/404.html");
    const html = res404.ok
      ? await res404.text()
      : `<p style="text-align:center; margin-top:10rem;">페이지를 불러오는 중 오류가 발생했습니다.</p>`;
    root.innerHTML = html;
  }
}

// 2. 해시 변경 감지 → 페이지 로딩 및 init 함수 실행
function handleHashChange() {
  const hash = location.hash.replace("#", ""); // ex: product?id=2
  const page = hash.split("?")[0];
  const params = new URLSearchParams(hash.split("?")[1]);
  const id = params.get("id");

  // [비동기] 페이지 로딩 후 init 함수 호출
  loadPage(hash).then(() => {
    // 페이지가 'product'일 경우 → 전역 초기화 함수 실행
    if (page === "product" && typeof window.initProductPage === "function") {
      window.initProductPage(id); // id = 2 같은 값 전달
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
