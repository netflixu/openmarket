const tabBuyer = document.getElementById("tab-buyer");
const tabSeller = document.getElementById("tab-seller");
const panel = document.getElementById("panel");
const loginError = document.getElementById("login-error");
const username = document.getElementById("username");
const password = document.getElementById("password");
const loginForm = document.getElementById("login-form");
const loginErrorPlace = document.getElementById("login-error-place");
const loginButton = document.getElementById("login-button");

function switchTab(activeTab, inactiveTab) {
  activeTab.classList.add("active");
  activeTab.setAttribute("aria-selected", "ture");
  activeTab.setAttribute("tabindex", "0");

  inactiveTab.classList.remove("active");
  inactiveTab.setAttribute("aria-selected", "false");
  inactiveTab.setAttribute("tabindex", "-1");

  panel.setAttribute("aria-labelledby", activeTab.id);
}

tabBuyer.addEventListener("click", () => {
  switchTab(tabBuyer, tabSeller);
});

tabSeller.addEventListener("click", () => {
  switchTab(tabSeller, tabBuyer);
});

// 키보드 이벤트 리스너 (접근성)
function handleKeydown(event) {
  const currentTab = event.target;
  let targetTab = null;

  switch (event.key) {
    case "ArrowLeft":
    case "ArrowUp":
      targetTab = currentTab === tabBuyer ? tabSeller : tabBuyer;
      break;
    case "ArrowRight":
    case "ArrowDown":
      targetTab = currentTab === tabBuyer ? tabSeller : tabBuyer;
      break;
    case "Home":
      targetTab = tabBuyer;
      break;
    case "End":
      targetTab = tabSeller;
      break;
    default:
      return;
  }

  event.preventDefault();

  if (targetTab === tabBuyer) {
    switchTab(tabBuyer, tabSeller);
  } else {
    switchTab(tabSeller, tabBuyer);
  }

  // 포커스 이동
  targetTab.focus();
}

// 두 탭에 키보드 이벤트 추가
tabBuyer.addEventListener("keydown", handleKeydown);
tabSeller.addEventListener("keydown", handleKeydown);

// 로그인
// [로그인] 버튼 클릭 오류 메시지

// 아이디, 비밀번호 입력란 모두 공란일 경우, 비밀번호만 입력했을 경우 : 아이디를 입력해 주세요.
// 아이디만 입력했을 경우 : 비밀번호를 입력해 주세요.
// 아이디, 비밀번호가 일치하지 않을 경우 : 아이디 또는 비밀번호가 일치하지 않습니다.

function showError(message) {
  loginError.textContent = message;
  loginErrorPlace.classList.remove("hidden");
  loginButton.classList.remove("mt-9");
  loginButton.classList.add("mt-[26px]");
}

function hideError() {
  loginError.textContent = "";
}

// 일단 공란인지 아닌지 확인 해야한다.
loginForm.addEventListener("submit", (event) => {
  event.preventDefault(); // 폼 실제 제출 막기
  console.log("아이디", username.value);
  console.log("비밀번호", password.value);

  hideError();

  if (!username.value && !password.value) {
    console.log("아이디를 입력해주세요");
    showError("아이디를 입력해 주세요.");
    username.focus();
    return;
  }

  if (!username.value) {
    console.log("아이디를 입력해주세요");
    showError("아이디를 입력해 주세요.");
    username.focus();
    return;
  }

  if (!password.value) {
    console.log("비밀번호를 입력해주세요");
    showError("비밀번호를 입력해 주세요.");
    password.focus();
    return;
  }

  // 여기서 아이디/비밀번호가 모두 입력된 경우 추가 검증
  console.log("아이디 또는 비밀번호가 일치하지 않습니다.");
});
