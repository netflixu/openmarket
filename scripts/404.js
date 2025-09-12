// /scripts/404.js
// "이전 페이지로 가기" 버튼 클릭 시, 404 직전 페이지로 이동(= history.back)

(function setup404BackHandler() {
  if (window.__404BackHandlerInstalled) return;
  window.__404BackHandlerInstalled = true;

  document.addEventListener(
    "click",
    (e) => {
      const btn = e.target.closest("[data-back]");
      if (!btn) return;

      e.preventDefault();

      // 가장 단순하고 정확한 방법: 바로 직전 히스토리로
      if (history.length > 1) {
        history.back();
        return;
      }

      // 히스토리가 없으면(새 탭 등) — 아주 단순 폴백
      try {
        if (
          document.referrer &&
          new URL(document.referrer).origin === location.origin
        ) {
          location.replace(document.referrer);
        } else {
          location.replace("#productList"); // 프로젝트 홈 해시로 바꿔도 됩니다
        }
      } catch {
        location.replace("#productList");
      }
    },
    { passive: false },
  );
})();
