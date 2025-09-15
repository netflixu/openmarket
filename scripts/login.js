import { saveUserInfo } from "./getUserInfo.js";
import { clearReturnUrl, getReturnUrl } from "./returnUrl.js";
import { saveRefresh, setAccess, startTokenAutoRefresh } from "./tokenStore.js";

function initLoginPage() {
  // DOM
  const tabBuyer = document.getElementById("tab-buyer");
  const tabSeller = document.getElementById("tab-seller");
  const panel = document.getElementById("panel");
  const loginError = document.getElementById("login-error");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const loginForm = document.getElementById("login-form");
  const loginErrorPlace = document.getElementById("login-error-place");
  const loginButton = document.getElementById("login-button");
  const findPassword = document.getElementById("find-password");

  if (!tabBuyer || !tabSeller || !loginForm) {
    console.warn("로그인 페이지 요소를 찾을 수 없습니다.");
    return;
  }

  // z-index 정책: 패널 z-10, 활성 탭 z-20, 비활성 탭 z-0
  const ACTIVE = ["z-20", "bg-white"];
  const INACTIVE = ["z-0", "bg-gray-100", "text-gray-800"];

  // 상태 전환: z-index만으로 겹침 제어 (보더 투명 처리 사용 안 함)
  function setBuyerActive() {
    // buyer 활성
    tabBuyer.classList.add(...ACTIVE);
    tabBuyer.classList.remove("z-0", "bg-gray-100", "text-gray-800");

    // seller 비활성 (보더 투명 처리 제거)
    tabSeller.classList.add(...INACTIVE);
    tabSeller.classList.remove("z-20", "bg-white");

    tabBuyer.classList.add("active");
    tabSeller.classList.remove("active");

    tabBuyer.setAttribute("aria-selected", "true");
    tabBuyer.setAttribute("tabindex", "0");
    tabSeller.setAttribute("aria-selected", "false");
    tabSeller.setAttribute("tabindex", "-1");

    panel.setAttribute("aria-labelledby", "tab-buyer");
    panel.classList.remove("rounded-tr-none");
    panel.classList.add("rounded-tl-none");
  }

  function setSellerActive() {
    // seller 활성
    tabSeller.classList.add(...ACTIVE);
    tabSeller.classList.remove(
      "z-0",
      "bg-gray-100",
      "text-gray-800",
      "border-r-transparent",
      "border-l-transparent",
    );

    // buyer 비활성 (보더 투명 처리 제거)
    tabBuyer.classList.add(...INACTIVE);
    tabBuyer.classList.remove(
      "z-20",
      "bg-white",
      "border-b-transparent",
      "border-l-transparent",
      "border-r-transparent",
    );

    tabSeller.classList.add("active");
    tabBuyer.classList.remove("active");

    tabSeller.setAttribute("aria-selected", "true");
    tabSeller.setAttribute("tabindex", "0");
    tabBuyer.setAttribute("aria-selected", "false");
    tabBuyer.setAttribute("tabindex", "-1");

    panel.setAttribute("aria-labelledby", "tab-seller");
    panel.classList.remove("rounded-tl-none");
    panel.classList.add("rounded-tr-none");
  }

  function switchTab(active) {
    if (active === tabBuyer) setBuyerActive();
    else setSellerActive();
  }

  // 에러 UI
  function showError(message) {
    if (loginError) loginError.textContent = message || "";
    if (loginErrorPlace) loginErrorPlace.classList.remove("hidden");
    if (loginButton) loginButton.classList.add("mt-[26px]");
  }
  function hideError() {
    if (loginError) loginError.textContent = "";
    if (loginErrorPlace) loginErrorPlace.classList.add("hidden");
    if (loginButton) loginButton.classList.remove("mt-[26px]");
  }

  function getLoginType() {
    return tabBuyer.getAttribute("aria-selected") === "true"
      ? tabBuyer.dataset.id // "BUYER"
      : tabSeller.dataset.id; // "SELLER"
  }

  function login() {
    fetch("https://api.wenivops.co.kr/services/open-market/accounts/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw errorData;
          });
        }
        return response.json();
      })
      .then((data) => {
        const { access, refresh, user } = data;

        const loginType = getLoginType();
        if (loginType !== user.user_type) {
          showError(
            loginType === "BUYER"
              ? "판매회원 로그인을 해주세요"
              : "구매회원 로그인을 해주세요",
          );
          return;
        }

        setAccess(access);
        saveRefresh(refresh);
        saveUserInfo(user);
        startTokenAutoRefresh();

        const returnUrl = getReturnUrl();
        if (returnUrl && returnUrl !== "#login") {
          clearReturnUrl();
          location.hash = returnUrl;
        } else {
          location.hash = "#productList";
        }
      })
      .catch((error) => {
        showError(error?.error || "로그인에 실패했습니다.");
        password.value = "";
      });
  }

  // 초기 상태: 구매 활성
  setBuyerActive();

  // 클릭 이벤트
  tabBuyer.addEventListener("click", () => switchTab(tabBuyer));
  tabSeller.addEventListener("click", () => switchTab(tabSeller));

  // 제출
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    hideError();

    if (!username.value) {
      showError("아이디를 입력해주세요");
      username.focus();
      return;
    }
    if (!password.value) {
      showError("비밀번호를 입력해주세요");
      password.focus();
      return;
    }

    login();
  });

  // 접근성: 키보드 탭 이동
  function handleKeydown(event) {
    switch (event.key) {
      case "ArrowLeft":
      case "ArrowUp":
      case "Home":
        event.preventDefault();
        setBuyerActive();
        tabBuyer.focus();
        break;
      case "ArrowRight":
      case "ArrowDown":
      case "End":
        event.preventDefault();
        setSellerActive();
        tabSeller.focus();
        break;
      default:
        break;
    }
  }
  tabBuyer.addEventListener("keydown", handleKeydown);
  tabSeller.addEventListener("keydown", handleKeydown);

  // 비밀번호 찾기(임시)
  if (findPassword) {
    findPassword.addEventListener("click", (event) => {
      event.preventDefault();
      alert("비밀번호 찾기 페이지는 준비중입니다");
    });
  }
}

window.initLoginPage = initLoginPage;
