const JOIN_API = "https://api.wenivops.co.kr/services/open-market/";

// DOM
// tab-list
const tabList = document.querySelector(".tab-list");
// joinForm
const joinForm = document.getElementById("joinForm");
// user tpye
const userType = document.getElementById("userType");
// id
const userId = document.getElementById("userId");
const userIdCheckBtn = document.getElementById("userIdCheckBtn");
const userIdMessage = document.getElementById("userIdMessage");
// pw
const passwordWrap = document.getElementById("passwordWrap");
const password = document.getElementById("password");
const passwordMessage = document.getElementById("passwordMessage");
// pw confirm
const passwordConfirmWrap = document.getElementById("passwordConfirmWrap");
const passwordConfirm = document.getElementById("passwordConfirm");
const pwConfirmMessage = document.getElementById("pwConfirmMessage");
// name
const userName = document.getElementById("userName");
const userNameMessage = document.getElementById("userNameMessage");
// phone
const phoneFirst = document.getElementById("phoneFirst");
const phoneFirstSelectUl = document.getElementById("phoneFirstSelectUl");
const phoneMiddle = document.getElementById("phoneMiddle");
const phoneLast = document.getElementById("phoneLast");
const phoneNumberMessage = document.getElementById("phoneNumberMessage");
// company_registration_number
const businessNumber = document.getElementById("businessNumber");
const businessNumberCheckBtn = document.getElementById(
  "businessNumberCheckBtn",
);
const businessNumberMessage = document.getElementById("businessNumberMessage");
// store_name
const storeName = document.getElementById("storeName");
const storeNameMessage = document.getElementById("storeNameMessage");
// checkbox
const privacyConsent = document.getElementById("privacyConsent");
const privacyConsentLabel = document.getElementById("privacyConsentLabel");
// joinBtn
const joinBtn = document.getElementById("joinBtn");

// 매핑
const validationsMapping = {
  userId: {
    input: userId,
    message: userIdMessage,
    isCheck: false,
  },
  password: {
    input: password,
    message: passwordMessage,
    isCheck: false,
  },
  passwordConfirm: {
    input: passwordConfirm,
    message: pwConfirmMessage,
    isCheck: false,
  },
  userName: {
    input: userName,
    message: userNameMessage,
  },
  phoneNumber: {
    input: [phoneFirst, phoneMiddle, phoneLast],
    message: phoneNumberMessage,
  },
};
const sellerValidationsMapping = {
  businessNumber: {
    input: businessNumber,
    message: businessNumberMessage,
    isCheck: false,
  },
  storeName: {
    input: storeName,
    message: storeNameMessage,
  },
};

// style.css 스타일 불러오기
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "./styles/style.css";
document.head.appendChild(link);

// 전체 확인
document.addEventListener("keyup", () => {
  const isDisabled = isInputBlank("all", false);
  joinBtn.disabled = isDisabled;
});

// 유효성 검사

//1. id 확인
userId.addEventListener("keydown", () => {
  resetError(userId, userIdMessage, () => {
    validationsMapping.userId.isCheck = false;
  });
});
userIdCheckBtn.addEventListener("click", checkUserId);

// API: accounts/validate-username/
async function checkUserId() {
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
      validationsMapping.userId.isCheck = false;
    });

    userId.focus();
    return;
  }

  showSuccess(userIdMessage, "멋진 아이디네요 :)", () => {
    validationsMapping.userId.isCheck = true;
  });

  userId.focus();
}

//2. 비밀번호 확인
password.addEventListener("focus", () => {
  isInputBlank("password");
});
password.addEventListener("keydown", (e) => {
  resetError(password, passwordMessage, () => {
    validationsMapping.password.isCheck = false;
  });
  passwordConfirm.value = "";
  passwordConfirmWrap.classList.remove("check-password");
});
password.addEventListener("keyup", (e) => {
  const passwordValue = e.target.value;
  // 8자 이상, 영문 대 소문자, 숫자, 특수문자를 사용하세요
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
  if (!regex.test(passwordValue)) {
    showError(
      password,
      passwordMessage,
      "8자 이상, 영문 대 소문자, 숫자, 특수문자를 사용하세요.",
      () => {
        passwordWrap.classList.remove("check-password");
        validationsMapping.password.isCheck = false;
      },
    );
    password.focus();

    return;
  }

  // check 표시
  validationsMapping.password.isCheck = true;
  passwordWrap.classList.add("check-password");
});
passwordConfirm.addEventListener("focus", () => {
  isInputBlank("passwordConfirm");
});
passwordConfirm.addEventListener("keydown", () => {
  resetError(passwordConfirm, pwConfirmMessage, () => {
    validationsMapping.passwordConfirm.isCheck = false;
  });
});
passwordConfirm.addEventListener("keyup", (e) => {
  const passwordConfirmValue = e.target.value;
  const passwordValue = password.value;

  // 값이 없으면 return
  if (passwordConfirmValue === "") return;

  // 비밀번호가 일치하지 않습니다.
  if (passwordValue !== passwordConfirmValue) {
    showError(
      passwordConfirm,
      pwConfirmMessage,
      "비밀번호가 일치하지 않습니다.",
      () => {
        passwordConfirmWrap.classList.remove("check-password");
        validationsMapping.passwordConfirm.isCheck = false;
      },
    );
    passwordConfirm.focus();

    return;
  }

  // check 표시
  validationsMapping.passwordConfirm.isCheck = true;
  passwordConfirmWrap.classList.add("check-password");
});

//3. 이름
userName.addEventListener("focus", () => {
  isInputBlank("userName");
});
userName.addEventListener("keydown", () => {
  resetError(userName, userNameMessage);
});
//4. 휴대폰번호
phoneFirst.addEventListener("focus", (e) => {
  isInputBlank("phoneNumber");

  resetError(null, phoneNumberMessage);
  phoneFirstSelectUl.style.display = "block";

  e.target.classList.add("outline-main");
});
phoneFirstSelectUl.addEventListener("click", (e) => {
  if (e.target.dataset.value === "") return;

  const phoneFirstValue = e.target.dataset.value;
  phoneFirst.value = phoneFirstValue;

  phoneFirstSelectUl.style.display = "none";
});
phoneMiddle.addEventListener("focus", () => {
  resetError(null, phoneNumberMessage);
  isInputBlank("phoneNumber");
});
phoneLast.addEventListener("focus", () => {
  resetError(null, phoneNumberMessage);
  isInputBlank("phoneNumber");
});

//7. 사업자등록번호
businessNumber.addEventListener("focus", () => {
  isInputBlank("businessNumber");
});
businessNumber.addEventListener("keydown", () => {
  resetError(businessNumber, businessNumberMessage, () => {
    sellerValidationsMapping.businessNumber.isCheck = false;
  });
});
businessNumberCheckBtn.addEventListener("click", async () => {
  let url = "accounts/seller/validate-registration-number/";
  // 사업자등록번호 검증
  const data = {
    company_registration_number: businessNumber.value,
  };
  const result = await postData(url, data);
  if (result.error) {
    showError(businessNumber, businessNumberMessage, result.error, () => {
      sellerValidationsMapping.businessNumber.isCheck = false;
    });
  } else {
    resetError(businessNumber, businessNumberMessage);
    showSuccess(businessNumberMessage, result.message, () => {
      sellerValidationsMapping.businessNumber.isCheck = true;
    });
  }
});

//8. 스토어이름
storeName.addEventListener("focus", () => {
  isInputBlank("storeName");
});
storeName.addEventListener("keydown", () => {
  resetError(storeName, storeNameMessage);
});

//5. 체크박스
privacyConsent.addEventListener("change", (e) => {
  if (e.target.checked) {
    privacyConsentLabel.classList.add("check");
  } else {
    privacyConsentLabel.classList.remove("check");
  }
  isInputBlank("checkbox");

  const isDisabled = isInputBlank("all", false);
  joinBtn.disabled = isDisabled;
});

//6. 가입하기
joinForm.addEventListener("submit", async (e) => {
  event.preventDefault(); // 전송 막기

  if (!joinForm.checkValidity()) {
    joinForm.reportValidity();
    return;
  }

  let url = "accounts/buyer/signup/";
  const data = {
    username: userId.value, // 아이디
    password: password.value,
    name: userName.value, // 이름
    phone_number: `${phoneFirst.value}${phoneMiddle.value}${phoneLast.value}`, // 전화번호는 010으로 시작하는 10~11자리 숫자
  };
  if (userType === "seller") {
    url = "accounts/seller/signup/";
    data.company_registration_number = businessNumber.value;
    data.store_name = storeName.value;
  }
  const result = await postData(url, data);

  if (!result.user_type) {
    if (result.username) {
      showError(userId, userIdMessage, result.username);
    }
    if (result.name) {
      showError(userName, userNameMessage, result.name);
    }
    if (result.phone_number) {
      showError(null, phoneNumberMessage, result.phone_number);
    }
    if (result.company_registration_number) {
      showError(
        businessNumber,
        businessNumberMessage,
        result.company_registration_number,
      );
    }
    if (result.store_name) {
      showError(storeName, storeNameMessage, result.store_name);
    }
    return;
  }

  location.hash = "login";
});

// 빈 input 체크
function isInputBlank(name, errorCheck = true) {
  if (name === "" && errorCheck) return;

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
  if (userType.value === "seller") {
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

// tabList
let currentTab = tabList.querySelector("li:first-child button");
tabList.addEventListener("click", (e) => {
  e.stopPropagation(); // 이벤트 버블링 차단

  const type = e.target.dataset.type;
  if (!type) return; // type 없는 요소 클릭했을 때 방지

  userType.value = type;
  if (type === "buyer") {
    document.getElementById("sellerData").classList.add("hidden");
  } else if (type == "seller") {
    document.getElementById("sellerData").classList.remove("hidden");
  }

  currentTab.classList.remove("active");
  currentTab = e.target;
  currentTab.classList.add("active");
  const isDisabled = isInputBlank("all", false);
  joinBtn.disabled = isDisabled;
});

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
