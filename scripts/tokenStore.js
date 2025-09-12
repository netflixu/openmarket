import { refreshAccessToken } from "./auth.js";

let accessToken = null; // 메모리 보관

export function setAccess(t) {
  accessToken = t;
}
export function getAccess() {
  return accessToken;
}
export function clearAccess() {
  accessToken = null;
}

export function saveRefresh(t) {
  if (t) sessionStorage.setItem("refreshToken", t);
  else sessionStorage.removeItem("refreshToken");
}
export function loadRefresh() {
  return sessionStorage.getItem("refreshToken");
}

// 자동 갱신 4분마다 엑세스 토큰 재발급
export function startTokenAutoRefresh() {
  if (window.refreshInterval) {
    clearInterval(window.refreshInterval);
    window.refreshInterval = null;
  }

  window.refreshInterval = setInterval(
    async () => {
      try {
        const newAccessToken = await refreshAccessToken();
        setAccess(newAccessToken);
        console.log("엑세스 토큰 갱신 완료");
        console.log(getAccess());
      } catch (error) {
        console.log("자동 갱신 실패 - 로그인 필요");

        stopTokenAutoRefresh();
        clearAccess();
        saveRefresh(null);
        location.hash = "#login";
      }
    },
    4 * 60 * 1000,
  ); // 4분마다
}

export function stopTokenAutoRefresh() {
  if (window.refreshInterval) {
    clearInterval(window.refreshInterval);
    window.refreshInterval = null;
  }
}
