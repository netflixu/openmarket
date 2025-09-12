import {
  loadRefresh,
  stopTokenAutoRefresh,
  saveRefresh,
  clearAccess,
} from "./tokenStore.js";

// refresh로 accesstoken 재발급
export async function refreshAccessToken() {
  const refresh = loadRefresh();
  if (!refresh) throw new Error("NO_REFRESH");

  const res = await fetch(
    "https://api.wenivops.co.kr/services/open-market/accounts/token/refresh/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    },
  );

  if (!res.ok) {
    throw new Error("REFRESH_FAILED");
  }

  const data = await res.json(); // { access: "새로운 액세스 토큰" }

  const accessToken = data.access;

  return accessToken;
}

function removeUserInfo() {
  localStorage.removeItem("user");
}

export function logout() {
  clearAccess();

  saveRefresh(null);

  stopTokenAutoRefresh();

  removeUserInfo();

  console.log("로그아웃 완료");
}
