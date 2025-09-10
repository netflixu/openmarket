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
