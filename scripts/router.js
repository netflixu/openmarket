const routes = {
  productList: () => import("../templates/productList.html"),
  product: () => import("../templates/product.html"),
  login: () => import("../templates/login.html"),
  join: () => import("../templates/join.html"),
};

const root = document.getElementById("app"); // index.html 안에 id="app" 영역에서 각 페이지 렌더링

export async function navigate() {
  const hash = location.hash.replace("#", "") || "productList";
  const route = routes[hash];

  if (route) {
    try {
      const res = await fetch(`./templates/${hash}.html`);
      const html = await res.text();
      root.innerHTML = html;
      window.scrollTo(0, 0);
    } catch (err) {
      root.innerHTML = `<p>페이지를 불러오는 중 오류가 발생했습니다.</p>`;
    }
  } else {
    root.innerHTML = `<p>해당 페이지를 찾을 수 없습니다.</p>`;
  }
}

async function loadHeader() {
  const headerEl = document.getElementById("header");
  const res = await fetch("/components/Header.html");
  const html = await res.text();
  headerEl.innerHTML = html;

  headerEl.addEventListener("click", (e) => {
    const target = e.target.closest("a[href^='#']");
    if (target) {
      e.preventDefault();
      const hash = target.getAttribute("href");
      if (hash) {
        location.hash = hash;
      }
    }
  });
}

// 해시가 변경될 때마다 navigate 실행
window.addEventListener("hashchange", navigate);
window.addEventListener("DOMContentLoaded", () => {
  loadHeader();
  navigate(); // 기존 라우터 함수 호출
});
