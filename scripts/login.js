const tabBuyer = document.getElementById("tab-buyer");
const tabSeller = document.getElementById("tab-seller");
const panel = document.getElementById("panel");
const loginError = document.getElementById("login-error");

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
