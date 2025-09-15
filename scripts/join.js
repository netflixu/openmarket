const JOIN_API = "https://api.wenivops.co.kr/services/open-market/";
const DOMElementArray = {
  tabList: document.querySelector(".tab-list"),
  // joinForm
  joinForm: document.getElementById("joinForm"),
  // user tpye
  userType: document.getElementById("userType"),
  // id
  userId: document.getElementById("userId"),
  userIdCheckBtn: document.getElementById("userIdCheckBtn"),
  userIdMessage: document.getElementById("userIdMessage"),
  // pw
  passwordWrap: document.getElementById("passwordWrap"),
  password: document.getElementById("password"),
  passwordMessage: document.getElementById("passwordMessage"),
  // pw confirm
  passwordConfirmWrap: document.getElementById("passwordConfirmWrap"),
  passwordConfirm: document.getElementById("passwordConfirm"),
  pwConfirmMessage: document.getElementById("pwConfirmMessage"),
  // name
  userName: document.getElementById("userName"),
  userNameMessage: document.getElementById("userNameMessage"),
  // phone
  phoneFirst: document.getElementById("phoneFirst"),
  phoneFirstSelectUl: document.getElementById("phoneFirstSelectUl"),
  phoneMiddle: document.getElementById("phoneMiddle"),
  phoneLast: document.getElementById("phoneLast"),
  phoneNumberMessage: document.getElementById("phoneNumberMessage"),
  // company_registration_number
  businessNumber: document.getElementById("businessNumber"),
  businessNumberCheckBtn: document.getElementById("businessNumberCheckBtn"),
  businessNumberMessage: document.getElementById("businessNumberMessage"),
  // store_name
  storeName: document.getElementById("storeName"),
  storeNameMessage: document.getElementById("storeNameMessage"),
  // checkbox
  privacyConsent: document.getElementById("privacyConsent"),
  privacyConsentLabel: document.getElementById("privacyConsentLabel"),
  // joinBtn
  joinBtn: document.getElementById("joinBtn"),
  // currentTab
  currentTab: document.querySelector("li:first-child button"),
};

// 매핑
let validationsMapping = {};
let sellerValidationsMapping = {};

// 돔 세팅
function loadJoinDOM() {
  // DOM
  // tab-list
  DOMElementArray.tabList = document.querySelector(".tab-list");
  // joinForm
  DOMElementArray.joinForm = document.getElementById("joinForm");
  // user tpye
  DOMElementArray.userType = document.getElementById("userType");
  // id
  DOMElementArray.userId = document.getElementById("userId");
  DOMElementArray.userIdCheckBtn = document.getElementById("userIdCheckBtn");
  DOMElementArray.userIdMessage = document.getElementById("userIdMessage");
  // pw
  DOMElementArray.passwordWrap = document.getElementById("passwordWrap");
  DOMElementArray.password = document.getElementById("password");
  DOMElementArray.passwordMessage = document.getElementById("passwordMessage");
  // pw confirm
  DOMElementArray.passwordConfirmWrap = document.getElementById(
    "passwordConfirmWrap",
  );
  DOMElementArray.passwordConfirm = document.getElementById("passwordConfirm");
  DOMElementArray.pwConfirmMessage =
    document.getElementById("pwConfirmMessage");
  // name
  DOMElementArray.userName = document.getElementById("userName");
  DOMElementArray.userNameMessage = document.getElementById("userNameMessage");
  // phone
  DOMElementArray.phoneFirst = document.getElementById("phoneFirst");
  DOMElementArray.phoneFirstSelectUl =
    document.getElementById("phoneFirstSelectUl");
  DOMElementArray.phoneMiddle = document.getElementById("phoneMiddle");
  DOMElementArray.phoneLast = document.getElementById("phoneLast");
  DOMElementArray.phoneNumberMessage =
    document.getElementById("phoneNumberMessage");
  // company_registration_number
  DOMElementArray.businessNumber = document.getElementById("businessNumber");
  DOMElementArray.businessNumberCheckBtn = document.getElementById(
    "businessNumberCheckBtn",
  );
  DOMElementArray.businessNumberMessage = document.getElementById(
    "businessNumberMessage",
  );
  // store_name
  DOMElementArray.storeName = document.getElementById("storeName");
  DOMElementArray.storeNameMessage =
    document.getElementById("storeNameMessage");
  // checkbox
  DOMElementArray.privacyConsent = document.getElementById("privacyConsent");
  DOMElementArray.privacyConsentLabel = document.getElementById(
    "privacyConsentLabel",
  );
  // joinBtn
  DOMElementArray.joinBtn = document.getElementById("joinBtn");

  // currentTab
  DOMElementArray.currentTab = DOMElementArray.tabList.querySelector(
    "li:first-child button",
  );

  validationsMapping = {
    userId: {
      input: DOMElementArray.userId,
      message: DOMElementArray.userIdMessage,
      isCheck: false,
    },
    password: {
      input: DOMElementArray.password,
      message: DOMElementArray.passwordMessage,
      isCheck: false,
    },
    passwordConfirm: {
      input: DOMElementArray.passwordConfirm,
      message: DOMElementArray.pwConfirmMessage,
      isCheck: false,
    },
    userName: {
      input: DOMElementArray.userName,
      message: DOMElementArray.userNameMessage,
    },
    phoneNumber: {
      input: [
        DOMElementArray.phoneFirst,
        DOMElementArray.phoneMiddle,
        DOMElementArray.phoneLast,
      ],
      message: DOMElementArray.phoneNumberMessage,
    },
  };
  sellerValidationsMapping = {
    businessNumber: {
      input: DOMElementArray.businessNumber,
      message: DOMElementArray.businessNumberMessage,
      isCheck: false,
    },
    storeName: {
      input: DOMElementArray.storeName,
      message: DOMElementArray.storeNameMessage,
    },
  };
}

document.addEventListener("mousedown", (e) => {
  // 외부 눌러도 드롭다운
  if (
    !DOMElementArray.phoneFirst.contains(e.target) &&
    !DOMElementArray.phoneFirstSelectUl.contains(e.target)
  )
    DOMElementArray.phoneFirstSelectUl.style.display = "none";
});

// 유효성 검사
document.addEventListener("keyup", () => {
  handleInputCheck();
});

// 전체 확인
function eventSetting() {
  //1. id 확인
  DOMElementArray.userId.addEventListener("keydown", (e) => {
    if (e.key === "Tab") return;

    resetError(DOMElementArray.userId, DOMElementArray.userIdMessage, () => {
      validationsMapping.userId.isCheck = false;
    });
  });
  DOMElementArray.userIdCheckBtn.addEventListener("click", () =>
    checkUserId(
      DOMElementArray.userId,
      DOMElementArray.userIdMessage,
      validationsMapping,
    ),
  );

  //2. 비밀번호/비밀번호 확인
  DOMElementArray.password.addEventListener("focus", () => {
    isInputBlank("password");
  });
  DOMElementArray.password.addEventListener("keyup", (e) => {
    if (e.key === "Tab") return;

    // 비밀번호 확인 input 리셋
    resetError(
      DOMElementArray.password,
      DOMElementArray.passwordMessage,
      () => {
        validationsMapping.password.isCheck = false;
      },
    );
    DOMElementArray.passwordConfirm.value = "";
    DOMElementArray.passwordConfirmWrap.classList.remove("check-password");

    // 비밀번호 유효성 검사
    const passwordValue = e.target.value;
    // 8자 이상, 영문 대 소문자, 숫자, 특수문자를 사용하세요
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!regex.test(passwordValue)) {
      showError(
        DOMElementArray.password,
        DOMElementArray.passwordMessage,
        "8자 이상, 영문 대 소문자, 숫자, 특수문자를 사용하세요.",
        () => {
          DOMElementArray.passwordWrap.classList.remove("check-password");
          validationsMapping.password.isCheck = false;
        },
      );
      DOMElementArray.password.focus();

      return;
    }

    // check 표시
    validationsMapping.password.isCheck = true;
    DOMElementArray.passwordWrap.classList.add("check-password");
  });
  DOMElementArray.passwordConfirm.addEventListener("focus", () => {
    isInputBlank("passwordConfirm");
  });
  DOMElementArray.passwordConfirm.addEventListener("keyup", (e) => {
    if (e.key === "Tab") return;

    resetError(passwordConfirm, pwConfirmMessage, () => {
      validationsMapping.passwordConfirm.isCheck = false;
    });

    const passwordConfirmValue = e.target.value;
    const passwordValue = password.value;

    // 값이 없으면 return
    if (passwordConfirmValue === "") return;

    // 비밀번호가 일치하지 않습니다.
    if (passwordValue !== passwordConfirmValue) {
      showError(
        DOMElementArray.passwordConfirm,
        DOMElementArray.pwConfirmMessage,
        "비밀번호가 일치하지 않습니다.",
        () => {
          DOMElementArray.passwordConfirmWrap.classList.remove(
            "check-password",
          );
          validationsMapping.passwordConfirm.isCheck = false;
        },
      );
      DOMElementArray.passwordConfirm.focus();

      return;
    }

    // check 표시
    validationsMapping.passwordConfirm.isCheck = true;
    DOMElementArray.passwordConfirmWrap.classList.add("check-password");
  });

  //3. 이름
  DOMElementArray.userName.addEventListener("focus", () => {
    isInputBlank("userName");
  });
  DOMElementArray.userName.addEventListener("keyup", (e) => {
    if (e.key === "Tab") return;

    resetError(userName, userNameMessage);
  });

  //4. 휴대폰번호
  DOMElementArray.phoneFirst.addEventListener("focus", (e) => {
    e.stopPropagation();

    isInputBlank("phoneNumber");

    resetError(null, phoneNumberMessage);
    DOMElementArray.phoneFirstSelectUl.style.display = "block";

    e.target.classList.add("outline-main");
  });
  DOMElementArray.phoneFirstSelectUl.addEventListener("mousedown", (e) => {
    if (e.target.dataset.value === "") return;

    handleSelectbox(e);
  });
  DOMElementArray.phoneFirstSelectUl.addEventListener("keydown", (e) => {
    const active = document.activeElement;
    const items = DOMElementArray.phoneFirstSelectUl.querySelectorAll("li");
    const currentIndex = Array.from(items).indexOf(active);

    if (e.key === "ArrowDown") {
      e.preventDefault(); // 스크롤 방지
      const next = items[currentIndex + 1] || items[0];
      next.focus();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = items[currentIndex - 1] || items[items.length - 1];
      prev.focus();
    }

    if (e.key === "Tab" && active === items[items.length - 1]) {
      DOMElementArray.phoneFirstSelectUl.style.display = "none";
      return;
    }

    if (e.key !== "Enter") return;

    handleSelectbox(e);
  });
  DOMElementArray.phoneMiddle.addEventListener("focus", () => {
    resetError(null, DOMElementArray.phoneNumberMessage);
    isInputBlank("phoneNumber");
  });
  DOMElementArray.phoneLast.addEventListener("focus", () => {
    resetError(null, DOMElementArray.phoneNumberMessage);
    isInputBlank("phoneNumber");
  });

  //7. 사업자등록번호
  DOMElementArray.businessNumber.addEventListener("focus", () => {
    isInputBlank("businessNumber");
  });
  DOMElementArray.businessNumber.addEventListener("keyup", (e) => {
    if (e.key === "Tab") return;

    resetError(
      DOMElementArray.businessNumber,
      DOMElementArray.businessNumberMessage,
      () => {
        sellerValidationsMapping.businessNumber.isCheck = false;
      },
    );
  });
  DOMElementArray.businessNumberCheckBtn.addEventListener("click", async () => {
    let url = "accounts/seller/validate-registration-number/";
    // 사업자등록번호 검증
    const data = {
      company_registration_number: DOMElementArray.businessNumber.value,
    };
    const result = await postData(url, data);
    if (result.error) {
      showError(
        DOMElementArray.businessNumber,
        DOMElementArray.businessNumberMessage,
        result.error,
        () => {
          sellerValidationsMapping.businessNumber.isCheck = false;
        },
      );
    } else {
      resetError(
        DOMElementArray.businessNumber,
        DOMElementArray.businessNumberMessage,
      );
      showSuccess(DOMElementArray.businessNumberMessage, result.message, () => {
        sellerValidationsMapping.businessNumber.isCheck = true;
      });
    }
  });

  //8. 스토어이름
  DOMElementArray.storeName.addEventListener("focus", () => {
    isInputBlank("storeName");
  });
  DOMElementArray.storeName.addEventListener("keyup", (e) => {
    if (e.key === "Tab") return;

    resetError(DOMElementArray.storeName, DOMElementArray.storeNameMessage);
  });

  //5. 체크박스
  DOMElementArray.privacyConsent.addEventListener("change", (e) => {
    if (e.target.checked) {
      DOMElementArray.privacyConsentLabel.classList.add("check");
    } else {
      DOMElementArray.privacyConsentLabel.classList.remove("check");
    }
    isInputBlank("checkbox");

    handleInputCheck();
  });
  DOMElementArray.privacyConsent.addEventListener("keyup", (e) => {
    if (e.key !== "Enter") return;

    if (e.target.checked) {
      e.target.checked = false;
      DOMElementArray.privacyConsentLabel.classList.remove("check");
      return;
    }

    e.target.checked = true;
    DOMElementArray.privacyConsentLabel.classList.add("check");
  });

  // label 안쪽 a태그 이동 이벤트 막기
  const policyArray = DOMElementArray.privacyConsentLabel.querySelectorAll("a");
  policyArray.forEach((policy) => {
    policy.addEventListener("click", (e) => {
      e.preventDefault();
      alert("준비중입니다.");
    });
  });

  //6. 가입하기
  DOMElementArray.joinForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // 전송 막기

    // 회원가입 진행
    const result = await join();

    if (!result.user_type) {
      if (result.username) {
        showError(
          DOMElementArray.userId,
          DOMElementArray.userIdMessage,
          result.username,
        );
      }
      if (result.name) {
        showError(
          DOMElementArray.userName,
          DOMElementArray.userNameMessage,
          result.name,
        );
      }
      if (result.phone_number) {
        showError(
          null,
          DOMElementArray.phoneNumberMessage,
          result.phone_number,
        );
      }
      if (result.company_registration_number) {
        showError(
          DOMElementArray.businessNumber,
          DOMElementArray.businessNumberMessage,
          result.company_registration_number,
        );
      }
      if (result.store_name) {
        showError(
          DOMElementArray.storeName,
          DOMElementArray.storeNameMessage,
          result.store_name,
        );
      }
      return;
    }

    // 회원가입 성공 시 로그인페이지로
    alert("회원가입이 완료되었습니다. 로그인 해주세요!");
    location.hash = "#login";
  });

  // tabList
  DOMElementArray.tabList.addEventListener("click", (e) => {
    e.stopPropagation(); // 이벤트 버블링 차단

    handleTabChange(e);
  });
  DOMElementArray.tabList.addEventListener("keyup", (e) => {
    e.stopPropagation(); // 이벤트 버블링 차단

    if (e.key !== "Enter") return;

    handleTabChange(e);
    handleInputCheck();
  });
}

// 상단 탭 요소
function handleTabChange(e) {
  const type = e.target.dataset.type;
  if (!type) return; // type 없는 요소 클릭했을 때 방지

  const inputWrap = document.getElementById("inputWrap");
  DOMElementArray.userType.value = type;
  if (type === "buyer") {
    document.getElementById("sellerData").style.display = "none";
    inputWrap.classList.remove("rounded-tr-none");
    inputWrap.classList.add("rounded-tl-none");
  } else if (type == "seller") {
    document.getElementById("sellerData").style.display = "flex";
    inputWrap.classList.remove("rounded-tl-none");
    inputWrap.classList.add("rounded-tr-none");
  }

  DOMElementArray.currentTab.classList.remove("active");
  DOMElementArray.currentTab = e.target;
  DOMElementArray.currentTab.classList.add("active");

  // 선택하면 아이디 입력창으로 포커스
  DOMElementArray.userId.focus();
}

// 샐랙트박스 요소
function handleSelectbox(e) {
  const phoneFirstValue = e.target.dataset.value;
  DOMElementArray.phoneFirst.value = phoneFirstValue;

  DOMElementArray.phoneFirstSelectUl.style.display = "none";
}

// 전체 값 체크
function handleInputCheck() {
  const isDisabled = isInputBlank("all", false);
  DOMElementArray.joinBtn.disabled = isDisabled;
}

async function join() {
  if (!DOMElementArray.joinForm.checkValidity()) {
    DOMElementArray.joinForm.reportValidity();
    return;
  }

  let url = "accounts/buyer/signup/";
  const data = {
    username: DOMElementArray.userId.value, // 아이디
    password: DOMElementArray.password.value,
    name: DOMElementArray.userName.value, // 이름
    phone_number: `${DOMElementArray.phoneFirst.value}${DOMElementArray.phoneMiddle.value}${DOMElementArray.phoneLast.value}`, // 전화번호는 010으로 시작하는 10~11자리 숫자
  };
  if (DOMElementArray.userType === "seller") {
    url = "accounts/seller/signup/";
    data.company_registration_number = DOMElementArray.businessNumber.value;
    data.store_name = DOMElementArray.storeName.value;
  }

  return await postData(url, data);
}

// API: accounts/validate-username/
async function checkUserId(userId, userIdMessage, validationsMapping) {
  const username = userId.value;
  // 값이 없는 경우
  if (username === "") {
    userId.focus();
    return;
  }

  // 20자 이내의 영문 소문자, 대문자, 숫자만 사용 가능합니다.
  const regex = /^[a-zA-Z0-9]{4,20}$/;
  if (!regex.test(username)) {
    showError(
      userId,
      userIdMessage,
      "20자 이내의 영문 소문자, 대문자, 숫자만 사용 가능합니다.",
      () => {
        validationsMapping.userId.isCheck = false;
      },
    );
    userId.focus();
    return;
  }

  const data = { username };

  const result = await postData("accounts/validate-username/", data);

  if (result.error) {
    showError(userId, userIdMessage, result.error, () => {
      userId.isCheck = false;
    });

    userId.focus();
    return;
  }

  showSuccess(userIdMessage, "멋진 아이디네요 :)", () => {
    validationsMapping.userId.isCheck = true;
  });

  DOMElementArray.password.focus();
}

// 빈 input 체크
function isInputBlank(name, errorCheck = true) {
  // join 페이지인 경우에만 실행
  if (location.hash !== "#join") return;

  if (name === "") return;

  const requiredText = "필수 정보입니다.";

  let isBlank = false;
  for (const key in validationsMapping) {
    if (key === name && errorCheck) return;

    if (key === "phoneNumber") {
      // 휴대폰 번호인 경우 특별하게 판단
      validationsMapping[key].input.forEach((item) => {
        if (item.value === "") {
          if (errorCheck)
            showError(null, validationsMapping[key].message, requiredText);
          isBlank = true;
        }
      });
    } else if (!validationsMapping[key].input.value) {
      // input 태그가 비어있는지 확인
      if (errorCheck)
        showError(
          validationsMapping[key].input,
          validationsMapping[key].message,
          requiredText,
        );
      isBlank = true;
    } else if (validationsMapping[key].hasOwnProperty("isCheck")) {
      // check 해야 하는 값 확인 (userId, password, passwordConfirm)
      let text = "";
      switch (key) {
        case "userId":
          text = "아이디 중복 확인 해주세요.";
          break;
        case "password":
          text = "비밀번호 입력을 확인해주세요.";
          break;
        case "passwordConfirm":
          text = "비밀번호가 일치하는지 확인해주세요.";
          break;
      }

      if (!validationsMapping[key].isCheck) {
        if (errorCheck)
          showError(
            validationsMapping[key].input,
            validationsMapping[key].message,
            text,
          );
        isBlank = true;
      }
    }
  }

  // 판매자인경우 추가 체크
  if (DOMElementArray.userType.value === "seller") {
    for (const key in sellerValidationsMapping) {
      if (key === name && errorCheck) return;

      if (!sellerValidationsMapping[key].input.value) {
        if (errorCheck)
          showError(
            sellerValidationsMapping[key].input,
            sellerValidationsMapping[key].message,
            requiredText,
          );
        isBlank = true;
      } else if (key === "businessNumber") {
        // check 해야 하는 값 확인 (businessNumber)
        if (!sellerValidationsMapping[key].isCheck) {
          if (errorCheck)
            showError(
              sellerValidationsMapping[key].input,
              sellerValidationsMapping[key].message,
              "사업자번호 중복 확인 해주세요.",
            );
          isBlank = true;
        }
      }
    }
  }

  if (!privacyConsent.checked) {
    isBlank = true;
  }

  if (name === "all") return isBlank;
}

// 에러 메시지 표시
function showError(element, messageElement, text, callback = null) {
  if (typeof element === "string") {
    element = document.getElementById(element);
  }

  if (element != null) element.classList.add("error");
  messageElement.classList.add("error-message");
  messageElement.innerText = text;

  if (callback) callback();
}

// 에러 지우기
function resetError(element, messageElement, callback = null) {
  if (typeof element === "string") {
    element = document.getElementById(element);
  }

  if (element != null) element.classList.remove("error");
  messageElement.classList.remove("error-message");
  messageElement.innerText = "";

  if (callback) callback();
}

// 성공 메시지 표시
function showSuccess(messageElement, text, callback = null) {
  messageElement.innerText = text;

  if (callback) callback();
}

// API 값 가져오기
async function postData(url = "", data = {}) {
  try {
    const res = await fetch(JOIN_API + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (e) {
    console.log(e);
    return e;
  }
}

// 매핑 데이터 리셋
function resetMappingData() {
  for (const key in validationsMapping) {
    if (validationsMapping[key].isCheck)
      validationsMapping[key].isCheck = false;
  }

  for (const key in sellerValidationsMapping) {
    if (sellerValidationsMapping[key].isCheck)
      sellerValidationsMapping[key].isCheck = false;
  }
}

// joinDOM 세팅 - router에서 호출
window.joinDOM = {
  init: () => {
    // 이벤트 바인딩, DOM 조작 등
    loadJoinDOM();
    resetMappingData();
    eventSetting();
  },
};

// 최초 실행 => 라우터에서 실행하니 안해도 됨
// window.joinDOM.init();
