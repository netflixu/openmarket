export function saveUserInfo(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUserInfo() {
  const userString = localStorage.getItem("user");
  return userString ? JSON.parse(userString) : null;
}
