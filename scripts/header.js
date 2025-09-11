import { getUserInfo } from "./getUserInfo.js";
import { showModal } from "./modal.js";

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

  // 이미 DOM 로드된 상태이니 바로 실행
  // 아이콘 만들어서 가져오기
  let iconArray = null;
  if (loginType === "") {
    iconArray = makeIcon([
      {
        type: "cart",
        text: "장바구니",
        callback: () =>
          document.body.append(
            showModal(
              "로그인 필요",
              "로그인이 필요한 서비스입니다.<br>로그인 하시겠습니까?",
              () => {
                location.hash = "#login";
              },
            ),
          ),
      },
      { type: "login", text: "로그인", hash: "#login" },
    ]);
  } else if (loginType === "BUYER") {
    iconArray = makeIcon([
      { type: "cart", text: "장바구니", hash: "#cart" },
      {
        type: "mypage",
        text: "마이페이지",
        dropdown: [
          {
            text: "마이페이지",
            hash: "#mypage",
          },
          {
            text: "로그아웃",
            hash: "#logout",
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
          },
          {
            text: "로그아웃",
            hash: "#logout",
          },
        ],
      },
      { type: "seller", text: "판매자 센터", hash: "#seller" },
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
    const a = document.createElement("a");
    // hash 값이 없으면 이동하지 않으니 이동 막기
    if (!item.hash) {
      a.addEventListener("click", (e) => e.preventDefault());
      a.classList.add("cursor-pointer");
    } else a.href = `#${item.type}`; // hash 있으면 href에 값 매달기
    // 값 세팅 및 스타일 적용
    a.id = `${item.type}Btn`;
    a.dataset.type = item.type;
    a.classList.add(
      "flex",
      "flex-col",
      "items-center",
      "text-xs",
      "text-font-gray",
      `${item.type}`,
    );

    // 판매자센터 버튼 스타일링
    if (item.type === "seller") {
      a.classList.add("center-btn"); // style.css에 작성
    }

    // 아이콘 하단 텍스트
    const span = document.createElement("span");
    span.classList.add("mt-1");
    span.innerText = item.text;

    // a 태그에 매달기
    a.append(span);

    // 드롭다운 있는 경우
    if (item.dropdown) {
      const dropdownWrap = document.createElement("ul");
      item.dropdown.forEach((li) => {
        const list = document.createElement("li");
        const a = document.createElement("a");
        a.innerText = li.text;
        a.href = li.hash;
        list.append(a);

        dropdownWrap.append(list);
      });
      a.classList.add("relative");
      dropdownWrap.classList.add("dropdown-wrap"); // style.css에 구현
      a.append(dropdownWrap);

      // 클릭 시 아이콘 색 바꾸기
      a.addEventListener("click", (e) => {
        const clickBtn = e.currentTarget;
        clickBtn.classList.toggle("active-icon");
      });
    }

    // 버튼을 눌렀을 때 실행해야 하는 함수가 있는 경우 실행
    if (item.callback) {
      a.addEventListener("click", () => {
        item.callback();
      });
    }

    iconArray.push(a);
  });

  // 배열 리턴
  return iconArray;
}
