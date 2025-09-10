import {
  getAccess,
  loadRefresh,
  saveRefresh,
  setAccess,
} from "./tokenStore.js";

// DOM 요소들을 함수 내에서 가져오도록 수정
function initializeLogin() {
  const tabBuyer = document.getElementById("tab-buyer");
  const tabSeller = document.getElementById("tab-seller");
  const panel = document.getElementById("panel");
  const loginError = document.getElementById("login-error");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const loginForm = document.getElementById("login-form");
  const loginErrorPlace = document.getElementById("login-error-place");
  const loginButton = document.getElementById("login-button");

  // 요소들이 존재하지 않으면 리턴
  if (!tabBuyer || !tabSeller || !loginForm) {
    console.warn("로그인 페이지 요소를 찾을 수 없습니다.");
    return;
  }

  function switchTab(activeTab, inactiveTab) {
    // 활성 탭 설정
    activeTab.classList.add("active");
    activeTab.classList.remove("bg-disabled-li");
    activeTab.setAttribute("aria-selected", "true");
    activeTab.setAttribute("tabindex", "0");

    // 비활성 탭 설정
    inactiveTab.classList.remove("active");
    inactiveTab.classList.add("bg-disabled-li");
    inactiveTab.setAttribute("aria-selected", "false");
    inactiveTab.setAttribute("tabindex", "-1");

    panel.setAttribute("aria-labelledby", activeTab.id);
    console.log("동작중");
  }

  function showError(message) {
    loginError.textContent = message;
    loginErrorPlace.classList.remove("hidden");
    loginButton.classList.remove("mt-9");
    loginButton.classList.add("mt-[26px]");
  }

  function hideError() {
    loginError.textContent = "";
  }

  function getLoginType() {
    return tabBuyer.getAttribute("aria-selected") === "true"
      ? tabBuyer.dataset.id
      : tabSeller.dataset.id;
  }

  function login() {
    fetch("https://api.wenivops.co.kr/services/open-market/accounts/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    })
      .then((response) => {
        // 응답이 실패면 에러 메시지 추출
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw errorData;
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        let loginType = getLoginType();
        if (loginType !== data.user.user_type) {
          if (loginType === "BUYER") {
            showError("판매회원 로그인을 해주세요");
          } else if (loginType === "SELLER") {
            showError("구매회원 로그인을 해주세요");
          }
          return;
        }
        // 엑세스토큰 저장
        setAccess(data.access);
        // 리프레시 토큰저장
        saveRefresh(data.refresh);

        // SPA 환경에서는 해시만 변경
        location.hash = "#productList";
      })
      .catch((error) => {
        showError(error.error);
        password.value = "";
      });
  }

  // 이벤트 리스너 등록
  tabBuyer.addEventListener("click", () => {
    switchTab(tabBuyer, tabSeller);
  });

  tabSeller.addEventListener("click", () => {
    switchTab(tabSeller, tabBuyer);
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault(); // 폼 실제 제출 막기
    event.stopPropagation(); // 추가

    hideError();

    if (!username.value && !password.value) {
      showError("아이디를 입력해 주세요.");
      username.focus();
      return;
    }

    if (!username.value) {
      showError("아이디를 입력해 주세요.");
      username.focus();
      return;
    }

    if (!password.value) {
      showError("비밀번호를 입력해 주세요.");
      password.focus();
      return;
    }

    login();
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
}

// DOM이 준비되면 초기화 실행
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeLogin);
} else {
  initializeLogin();
  console.log("로딩완료");
}

// SPA 환경을 위한 추가 초기화 (router에서 호출될 수 있도록)
setTimeout(initializeLogin, 100);
