export function saveReturnUrl(url) {
  // 로그인 페이지는 저장하지 않음
  if (url && url !== "#login") {
    sessionStorage.setItem("returnUrl", url);
  }
}

export function getReturnUrl() {
  return sessionStorage.getItem("returnUrl");
}

export function clearReturnUrl() {
  sessionStorage.removeItem("returnUrl");
}
