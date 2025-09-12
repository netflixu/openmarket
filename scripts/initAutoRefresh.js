import { getAccess, loadRefresh, startTokenAutoRefresh } from "./tokenStore.js";

function initAutoRefresh() {
  console.log("=== initAutoRefresh 함수 실행됨 ===");
  const accessToken = getAccess();
  const refreshToken = loadRefresh();

  if (accessToken && refreshToken) {
    console.log("기존 로그인 상태 감지 - 자동 갱신 시작");
    startTokenAutoRefresh();
  }
}

if (document.readyState !== "loading") {
  // 이미 DOM 준비됨
  initAutoRefresh();
} else {
  // 아직 로딩 중이면 이벤트로 기다림
  document.addEventListener("DOMContentLoaded", initAutoRefresh);
}
