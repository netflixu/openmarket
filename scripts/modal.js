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
  );

  const modal = document.createElement("div");
  modal.classList.add(
    "absolute",
    "top-1/2",
    "left-1/2",
    "-translate-1/2",
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

  // h2 타이틀
  const modalTitle = document.createElement("h2");
  modalTitle.innerHTML = h2;
  modalTitle.classList.add("sr-only");

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
  closeBtn.addEventListener("click", () => {
    modalWrap.remove();
  });

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
  noBtn.addEventListener("click", () => {
    modalWrap.remove();
  });
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
    modalWrap.remove();
  });
  btnWrap.append(noBtn, yesBtn);

  modal.append(modalTitle, closeBtn, modalText, btnWrap);
  modalWrap.append(modal);
  return modalWrap;
}
