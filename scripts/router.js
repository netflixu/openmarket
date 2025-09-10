const root = document.getElementById("app"); // index.html 안에 id="app" 영역에서 각 페이지 렌더링

async function loadPage(hash) {
  const page = hash || "productList"; // 기본 페이지
  try {
    // 1. 메인 페이지 HTML templates 로드
    const res = await fetch(`/templates/${page}.html`);
    const html = await res.text();
    root.innerHTML = html;

    // 2. 공통 Header 컴포넌트 동적 로드
    const headerContainer = document.getElementById("header");
    if (headerContainer) {
      const headerRes = await fetch("/components/header.html");
      const headerHTML = await headerRes.text();
      headerContainer.innerHTML = headerHTML;
    }

    // 3. 페이지별 JS 동적 로드(html, js 파일명이 같을 경우)
    const script = document.createElement("script");
    script.src = `/scripts/${page}.js`;
    script.async = true;
    script.type = "module";
    document.body.appendChild(script);

    // 4. 페이지 이동 시 스크롤 맨 위로
    window.scrollTo(0, 0);
  } catch (err) {
    root.innerHTML = `<p>페이지를 불러오는 중 오류가 발생했습니다.</p>`;
  }
}

function handleHashChange() {
  const hash = location.hash.replace("#", "");
  loadPage(hash);
}

// 해시가 변경될 때마다 navigate 실행
window.addEventListener("hashchange", handleHashChange);
window.addEventListener("DOMContentLoaded", handleHashChange);
