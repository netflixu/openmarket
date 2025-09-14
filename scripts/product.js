import { showModal } from "./modal.js";
import { getUserInfo } from "./getUserInfo.js";

function checkLogin() {
  const user = getUserInfo();

  const loginType = user ? user.user_type : "";

  return loginType;
}

function getProductIdFromHashOrSearch() {
  const hash = window.location.hash; // 예: "#product?id=3"
  const hashQuery = hash.includes("?") ? hash.split("?")[1] : null;
  const hashParams = new URLSearchParams(hashQuery);
  const idFromHash = hashParams.get("id");

  if (idFromHash && !isNaN(idFromHash)) {
    return idFromHash;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const idFromSearch = searchParams.get("id");

  if (idFromSearch && !isNaN(idFromSearch)) {
    return idFromSearch;
  }

  return null;
}

window.initProductPage = async function () {
  const productId = getProductIdFromHashOrSearch();

  if (!productId) {
    document.getElementById("app").innerHTML =
      `<p style="text-align:center; margin-top:10rem;">잘못된 상품 ID입니다.</p>`;
    return;
  }

  try {
    const res = await fetch(
      `https://api.wenivops.co.kr/services/open-market/products/${productId}`,
    );
    if (!res.ok) throw new Error("상품을 불러올 수 없습니다.");
    const product = await res.json();
    const stock = product.stock;
    const quantity = product.stock === 0 ? 0 : 1;

    renderProduct(product, stock, quantity);
    setupTabs(product);
  } catch (err) {
    document.getElementById("app").innerHTML =
      `<p style="text-align:center; margin-top:10rem;">상품 정보를 불러올 수 없습니다.</p>`;
  }
};

function renderProduct(product, stock, quantity) {
  setImage("product-image", product.image);
  setText("product-store-name", product.store_name);
  setText("product-name", product.product_name);
  setText("product-price", product.price.toLocaleString());
  setText(
    "product-shipping",
    product.shipping_method === "PARCEL" ? "택배배송" : "직접배송",
  );
  setHTML("tab-content", `<p>${product.product_info}</p>`);
  updateTotalPrice(product.price, quantity);
  setupQuantityControls(product.price, stock, quantity);
  setupTabs(product);

  const loginType = checkLogin();
  const buyBtn = document.getElementById("buy-now");
  const addToCartBtn = document.getElementById("add-to-cart");
  const decreaseBtn = document.getElementById("quantity-decrease");
  const increaseBtn = document.getElementById("quantity-increase");

  if (stock === 0) {
    if (buyBtn) {
      buyBtn.textContent = "재고 없음";
      buyBtn.classList.add("cursor-not-allowed", "opacity-50", "bg-gray-400");
      buyBtn.disabled = true;
    }
    if (addToCartBtn) {
      addToCartBtn.style.display = "none";
    }
    if (decreaseBtn) {
      decreaseBtn.classList.add("cursor-not-allowed", "opacity-50");
      decreaseBtn.disabled = true;
    }
    if (increaseBtn) {
      increaseBtn.classList.add("cursor-not-allowed", "opacity-50");
      increaseBtn.disabled = true;
    }
  } else {
    if (loginType === "") {
      if (buyBtn) {
        buyBtn.addEventListener("click", () => {
          document.body.append(
            showModal(
              "로그인 필요",
              "로그인이 필요한 서비스입니다.<br>로그인 하시겠습니까?",
              () => {
                location.hash = "#login";
              },
            ),
          );
        });
      }

      if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
          document.body.append(
            showModal(
              "로그인 필요",
              "로그인이 필요한 서비스입니다.<br>로그인 하시겠습니까?",
              () => {
                location.hash = "#login";
              },
            ),
          );
        });
      }
    } else {
      if (buyBtn) {
        buyBtn.addEventListener("click", () => {
          document.body.append(alert("구매 페이지를 준비중입니다."));
        });
      }

      if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
          document.body.append(
            showModal(
              "장바구니에 담기",
              "장바구니에 상품이 담겼습니다.<br>장바구니로 이동하시겠습니까?",
              () => {
                document.body.append(alert("장바구니 페이지를 준비중입니다."));
              },
            ),
          );
        });
      }
    }
  }
}

function setupQuantityControls(unitPrice, stock, quantity) {
  const quantityEl = document.getElementById("product-quantity");
  const totalPriceEl = document.getElementById("total-price");
  quantityEl.textContent = quantity;

  document
    .getElementById("quantity-decrease")
    ?.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        quantityEl.textContent = quantity;
        updateTotalPrice(unitPrice, quantity);
      }
    });

  document
    .getElementById("quantity-increase")
    ?.addEventListener("click", () => {
      if (quantity < stock) {
        quantity++;
        quantityEl.textContent = quantity;
        updateTotalPrice(unitPrice, quantity);
      }
    });
}

function updateTotalPrice(price, quantity) {
  const total = price * quantity;
  const totalEl = document.getElementById("total-price");
  if (totalEl) {
    totalEl.textContent = `${total.toLocaleString()}원`;
  }
}

function setupTabs(product) {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  const contentMap = {
    description: product.product_info || "상세 설명이 없습니다.",
    shipping: `
      <p><strong>배송방법:</strong> ${product.shipping_method === "PARCEL" ? "택배배송" : "직접배송"}</p>
      <p><strong>배송비:</strong> ${
        product.shipping_fee === 0
          ? "무료배송"
          : `${product.shipping_fee.toLocaleString()}원`
      }</p>
    `,
    review: "등록된 리뷰가 없습니다.",
    qna: "등록된 문의가 없습니다.",
  };

  tabButtons.forEach((button) => {
    const tabKey = button.dataset.tab;
    const contentEl = document.getElementById(`tab-${tabKey}`);
    if (!contentEl) return;
    button.addEventListener("click", () => {
      tabContents.forEach((el) => el.classList.add("hidden"));
      contentEl.classList.remove("hidden");
      contentEl.innerHTML = contentMap[tabKey] || "내용이 없습니다.";
      tabButtons.forEach((btn) => {
        btn.classList.remove("border-[#21BF48]", "text-[#21BF48]");
        btn.classList.add("border-gray-300", "text-gray-500");
      });
      button.classList.add("border-[#21BF48]", "text-[#21BF48]");
      button.classList.remove("border-gray-300", "text-gray-500");
    });
  });

  const defaultTab = tabButtons[0];
  if (defaultTab) defaultTab.click();
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setImage(id, src) {
  const el = document.getElementById(id);
  if (el) el.src = src;
}

function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}
