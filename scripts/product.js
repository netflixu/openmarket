// scripts/detail.js

document.addEventListener("DOMContentLoaded", () => {
  const quantityInput = document.getElementById("product-quantity");
  const minusBtn = document.getElementById("quantity-minus");
  const plusBtn = document.getElementById("quantity-plus");
  const totalPriceEl = document.getElementById("total-price");
  const totalCountEl = document.getElementById("total-count");
  const buyBtn = document.getElementById("buy-button");
  const cartBtn = document.getElementById("cart-button");

  const UNIT_PRICE = 17500;

  const updateTotal = () => {
    const count = parseInt(quantityInput.value, 10);
    totalPriceEl.textContent = (count * UNIT_PRICE).toLocaleString() + "원";
    totalCountEl.textContent = count + "개";
  };

  minusBtn.addEventListener("click", () => {
    let value = parseInt(quantityInput.value, 10);
    if (value > 1) {
      quantityInput.value = value - 1;
      updateTotal();
    }
  });

  plusBtn.addEventListener("click", () => {
    let value = parseInt(quantityInput.value, 10);
    quantityInput.value = value + 1;
    updateTotal();
  });

  quantityInput.addEventListener("change", () => {
    let value = parseInt(quantityInput.value, 10);
    if (isNaN(value) || value < 1) {
      quantityInput.value = 1;
    }
    updateTotal();
  });

  buyBtn.addEventListener("click", () => {
    const count = quantityInput.value;
    alert(`${count}개 상품을 바로 구매합니다.`);
    // 추후 실제 결제 로직 연동 예정
  });

  cartBtn.addEventListener("click", () => {
    const count = quantityInput.value;
    alert(`${count}개 상품이 장바구니에 추가되었습니다.`);
    // 추후 로컬스토리지 또는 서버 연동 예정
  });

  // 페이지 로드 시 초기 금액 반영
  updateTotal();
});
