import { logout } from "./auth.js";
import { getUserInfo } from "./getUserInfo.js";
import { showModal } from "./modal.js";
import { saveReturnUrl } from "./returnUrl.js";

let isDropdown = null;

// 아이콘 들어갈 위치 (오른쪽 상단)
function findIconWrap() {
  const iconWrap = document.querySelector(".icon-wrap");

  return iconWrap ? iconWrap : null;
}

function checkLogin() {
  const user = getUserInfo();

  // 세션에서 로그인 정보 확인
  const loginType = user ? user.user_type : "";

  return loginType;
}

export function setIcons() {
  const loginType = checkLogin();

  // iconWrap이 있는지 확인
  const iconWrap = findIconWrap();
  if (!iconWrap) return;
  console.log("아이콘 세팅!");

  // 로그아웃 시 하고 다시 아이콘 세팅할 때 기존 아이콘들 초기화
  iconWrap.innerHTML = "";

  // 이미 DOM 로드된 상태이니 바로 실행
  // 아이콘 만들어서 가져오기
  let iconArray = null;
  if (loginType === "") {
    iconArray = makeIcon([
      {
        type: "cart",
        text: "장바구니",
        hash: "#",
        callback: () => {
          saveReturnUrl(location.hash);
          console.log(location.hash, "저장된 url");
          document.body.append(
            showModal(
              "로그인 필요",
              "로그인이 필요한 서비스입니다.<br>로그인 하시겠습니까?",
              () => {
                location.hash = "#login";
              },
            ),
          );
        },
      },
      {
        type: "login",
        text: "로그인",
        callback: () => {
          saveReturnUrl(location.hash);
          location.hash = "#login";
        },
      },
    ]);
  } else if (loginType === "BUYER") {
    iconArray = makeIcon([
      {
        type: "cart",
        text: "장바구니",
        hash: "#cart",
        callback: () => {
          alert("준비중입니다.");
        },
      },
      {
        type: "mypage",
        text: "마이페이지",
        dropdown: [
          {
            text: "마이페이지",
            hash: "#mypage",
            callback: () => {
              alert("준비중입니다.");
            },
          },
          {
            text: "로그아웃",
            callback: () => {
              logout();
              setIcons();
              location.reload();
            },
          },
        ],
      },
    ]);
  } else if (loginType === "SELLER") {
    iconArray = makeIcon([
      {
        type: "mypage",
        text: "마이페이지",
        dropdown: [
          {
            text: "마이페이지",
            hash: "#mypage",
            callback: () => {
              alert("준비중입니다.");
            },
          },
          {
            text: "로그아웃",
            callback: () => {
              logout();
              setIcons();
              location.reload();
            },
          },
        ],
      },
      {
        type: "seller",
        text: "판매자 센터",
        hash: "#seller",
        callback: () => {
          alert("준비중입니다.");
        },
      },
    ]);
  }

  // iconWrap에 매달기
  iconArray.forEach((icon) => {
    console.log(icon + " 추가");
    iconWrap.append(icon);
  });

  // SELLER 는 간격 수정
  if (loginType === "SELLER") {
    iconWrap.classList.remove("gap-6.5");
    iconWrap.classList.add("gap-7.5");
  }
}

function makeIcon(array) {
  // 만들 아이콘을 담을 배열
  const iconArray = [];

  // 아이콘 만들기 반복
  array.forEach((item) => {
    // const a = document.createElement("a");
    let icon = document.createElement("a");
    // hash 값이 없으면 이동하지 않으니 이동 막기
    if (!item.hash) {
      icon = document.createElement("button");
      icon.addEventListener("click", (e) => e.preventDefault());
      icon.classList.add("cursor-pointer");
    } else {
      // hash 있으면 href에 값 매달기
      icon.href = item.hash;
    }

    // 값 세팅 및 스타일 적용
    icon.id = `${item.type}Btn`;
    icon.dataset.type = item.type;
    icon.classList.add(
      "flex",
      "flex-col",
      "items-center",
      "text-xs",
      "text-font-gray",
      "shrink-0",
      "select-none",
      `${item.type}`,
    );

    // 판매자센터 버튼 스타일링
    if (item.type === "seller") {
      icon.classList.add("center-btn"); // style.css에 작성
    }

    // 아이콘 하단 텍스트
    const span = document.createElement("span");
    span.classList.add("mt-1");
    span.innerText = item.text;

    // a 태그에 매달기
    icon.append(span);

    // 드롭다운 있는 경우
    let arrayPush = icon;
    if (item.dropdown) {
      const wrap = document.createElement("div");
      wrap.classList.add("relative");
      wrap.append(icon);
      // a.append(dropdownWrap);

      // 클릭 시 아이콘 색 바꾸기
      icon.addEventListener("click", (e) => {
        e.stopPropagation(); // 버블링 막기!

        const clickBtn = e.currentTarget;
        clickBtn.classList.toggle("active-icon");

        // 드롭다운 가져오기
        const dropdownWrap = document.querySelector(".dropdown-wrap");

        if (dropdownWrap) {
          // 있으면 삭제
          dropdownWrap.remove();
          isDropdown = null;
        } else {
          // 없으면 생성 후 이벤트 달기
          const dropdownWrap = document.createElement("ul");

          item.dropdown.forEach((li) => {
            const list = document.createElement("li");
            let dropdownItem = document.createElement("a");

            if (li.hash) dropdownItem.href = li.hash;
            else {
              dropdownItem = document.createElement("button");
              dropdownItem.type = "button";
              dropdownItem.classList.add("cursor-pointer");
            }

            dropdownItem.innerText = li.text;

            if (li.callback) {
              // dropdownItem.href = "#";
              dropdownItem.addEventListener("click", (e) => {
                e.preventDefault();
                li.callback();
              });
            }

            list.append(dropdownItem);
            dropdownWrap.append(list);
          });
          dropdownWrap.classList.add("dropdown-wrap"); // style.css에 구현

          wrap.append(dropdownWrap);
          isDropdown = dropdownWrap;
        }
      });

      arrayPush = wrap;
    }

    // 버튼을 눌렀을 때 실행해야 하는 함수가 있는 경우 실행
    if (item.callback) {
      icon.addEventListener("click", (e) => {
        e.preventDefault();
        item.callback();
      });
    }

    iconArray.push(arrayPush);
  });

  // 배열 리턴
  return iconArray;
}

// 문서 전체 클릭 시 드롭다운 닫기
document.addEventListener("click", (e) => {
  if (isDropdown && !isDropdown.contains(e.target)) {
    const activeIcon = document.querySelector(".active-icon");
    if (activeIcon) {
      activeIcon.classList.toggle("active-icon");
      isDropdown.remove();
      isDropdown = null;
    }
  }
});
