// modal.js (업데이트)
// 추후 class 형식으로 바꿔서 사용하는 방향 고민

/**
 *
 * @param {string} h2 - 모달의 타이틀입니다. sr-only를 이용하여 스크린리더만 읽을 수 있습니다.
 * @param {string} text - 모달에 표시될 텍스트입니다. html 태그를 이용하여 작성 가능합니다.
 * @param {function} yesFunc - 예 버튼을 눌렀을 때 실행할 함수를 작성합니다.
 * @returns modal DOM 객체를 리턴합니다. 원하는 위치에 append 해서 사용하실 수 있습니다.
 */
export function showModal(h2, text, yesFunc = null) {
  const modalWrap = document.createElement("section");
  modalWrap.classList.add(
    "fixed",
    "top-0",
    "left-0",
    "bottom-0",
    "right-0",
    "bg-[#000000B2]",
    "z-50",
  );
  modalWrap.setAttribute("aria-hidden", "false");

  const modal = document.createElement("div");
  modal.classList.add(
    "absolute",
    "top-1/2",
    "left-1/2",
    "-translate-1/2", // 프로젝트 유틸 유지
    "bg-white",
    "border",
    "border-gray-border",
    "px-4.5",
    "py-4.5",
    "flex",
    "flex-col",
    "items-center",
    "text-center",
    "gap-2.5",
    "w-90",
  );
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("tabindex", "-1"); // 프로그램으로 포커스 가능

  // h2 타이틀
  const modalTitle = document.createElement("h2");
  modalTitle.innerHTML = h2;
  modalTitle.classList.add("sr-only");
  // aria-labelledby 연결
  const titleId = `modal-title-${Date.now()}`;
  modalTitle.id = titleId;
  modal.setAttribute("aria-labelledby", titleId);

  // 닫기 버튼
  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.classList.add(
    "w-5.5",
    "h-5.5",
    "bg-[url(../images/icon-delete.svg)]",
    "self-end",
    "cursor-pointer",
  );
  closeBtn.addEventListener("click", () => close());

  // 보여줄 텍스트
  const modalText = document.createElement("p");
  modalText.innerHTML = text;

  // 하단 버튼
  const btnWrap = document.createElement("div");
  btnWrap.classList.add("flex", "gap-2.5", "font-medium", "mt-5", "text-x");
  const noBtn = document.createElement("button");
  noBtn.classList.add(
    "border",
    "border-gray-border",
    "rounded-[5px]",
    "py-2",
    "w-25",
    "cursor-pointer",
  );
  noBtn.innerHTML = "아니오";
  noBtn.addEventListener("click", () => close());
  const yesBtn = document.createElement("button");
  yesBtn.classList.add(
    "text-white",
    "bg-main",
    "rounded-[5px]",
    "py-2",
    "w-25",
    "cursor-pointer",
  );
  yesBtn.innerHTML = "예";
  yesBtn.addEventListener("click", () => {
    if (yesFunc) yesFunc();
    close();
  });
  btnWrap.append(noBtn, yesBtn);

  modal.append(modalTitle, closeBtn, modalText, btnWrap);
  modalWrap.append(modal);

  // === 접근성/상호작용 추가 ===
  // 1) 오버레이 외부 클릭으로 닫기
  const onOverlayMouseDown = (e) => {
    if (e.target === modalWrap) close();
  };
  modalWrap.addEventListener("mousedown", onOverlayMouseDown);

  // 2) ESC로 닫기 + Tab 포커스 트랩
  const previouslyFocused = document.activeElement;

  const getFocusables = () => {
    return modal.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );
  };

  const onKeyDown = (e) => {
    // ESC 닫기
    if (e.key === "Escape") {
      e.stopPropagation();
      e.preventDefault();
      close();
      return;
    }
    // Tab 포커스 트랩
    if (e.key === "Tab" && modalWrap.isConnected) {
      const focusables = Array.from(getFocusables());
      if (focusables.length === 0) {
        // 포커스 이동 막기
        e.preventDefault();
        modal.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      // Shift+Tab on first -> last
      if (e.shiftKey && (active === first || !modal.contains(active))) {
        e.preventDefault();
        last.focus();
      }
      // Tab on last -> first
      else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
      // 모달 바깥에서 Tab 시작 시 -> first
      else if (!modal.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    }
  };
  document.addEventListener("keydown", onKeyDown, true);

  // 3) 초기 포커스(모달이 DOM에 append 된 직후 적용)
  //   - 사용자가 즉시 append 하는 전형적인 케이스를 고려해 다음 프레임에 포커스
  requestAnimationFrame(() => {
    if (!modalWrap.isConnected) return;
    const focusables = Array.from(getFocusables());
    (focusables[0] || modal).focus();
  });

  // 4) 정리 함수
  function close() {
    document.removeEventListener("keydown", onKeyDown, true);
    modalWrap.removeEventListener("mousedown", onOverlayMouseDown);
    if (modalWrap.isConnected) modalWrap.remove();
    // 이전 포커스 복귀
    if (previouslyFocused && previouslyFocused.focus) {
      previouslyFocused.focus();
    }
  }

  return modalWrap;
}
