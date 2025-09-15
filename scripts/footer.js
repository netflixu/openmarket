function el(tag, classNames = "", attrs = {}, text = "") {
  const $el = document.createElement(tag);
  if (classNames) {
    // 공백 포함된 클래스 문자열을 그대로 적용 (Tailwind 임의 변형 사용 가능)
    $el.setAttribute("class", classNames);
  }
  for (const [k, v] of Object.entries(attrs)) {
    if (v !== undefined && v !== null) $el.setAttribute(k, v);
  }
  if (text) $el.textContent = text;
  return $el;
}

/**
 * 옵션으로 푸터 내용을 커스터마이즈할 수 있습니다.
 * @param {Object} options
 * @param {string} [options.maxWidth="max-w-6xl"]
 * @param {string} [options.instagram="#"]
 * @param {string} [options.facebook="#"]
 * @param {string} [options.youtube="#"]
 * @param {string} [options.iconInsta="./images/icon-insta.svg"]
 * @param {string} [options.iconFb="./images/icon-fb.svg"]
 * @param {string} [options.iconYt="./images/icon-yt.svg"]
 * @param {string} [options.company="(주)HODU SHOP"]
 * @param {string} [options.address="제주특별자치도 제주시 동광고 137 제주코딩베이스캠프"]
 * @param {string} [options.bizno="사업자 번호 : 000-0000-0000 | 통신판매업"]
 * @param {string} [options.ceo="대표 : 김호두"]
 * @returns {HTMLElement} footer element
 */
export function createFooter(options = {}) {
  const {
    maxWidth = "max-w-6xl",
    instagram = "#",
    facebook = "#",
    youtube = "#",
    iconInsta = "./images/icon-insta.svg",
    iconFb = "./images/icon-fb.svg",
    iconYt = "./images/icon-yt.svg",
    company = "(주)HODU SHOP",
    address = "제주특별자치도 제주시 동광고 137 제주코딩베이스캠프",
    bizno = "사업자 번호 : 000-0000-0000 | 통신판매업",
    ceo = "대표 : 김호두",
  } = options;

  // <footer>
  const $footer = el("footer", "bg-gray-100", { role: "contentinfo" });

  // container
  const $container = el("div", `mx-auto ${maxWidth} px-8 py-10`);
  $footer.appendChild($container);

  // top row: nav + icons
  const $topRow = el("div", "flex items-center justify-between text-sm");
  $container.appendChild($topRow);

  // nav
  const $nav = el("nav", "", { "aria-label": "푸터 링크" });
  $topRow.appendChild($nav);

  // ul with separators via pseudo-element
  const ulClasses = [
    "flex flex-wrap items-center text-gray-700",
    "[&>li+li]:before:content-['|']",
    "[&>li+li]:before:mx-3",
    "[&>li+li]:before:text-gray-300",
  ].join(" ");
  const $ul = el("ul", ulClasses);

  const linkItems = [
    { label: "호두샵 소개", href: "#" },
    { label: "이용약관", href: "#" },
    { label: "개인정보처리방침", href: "#", class: "font-semibold text-black" },
    { label: "전자금융거래약관", href: "#" },
    { label: "청소년보호정책", href: "#" },
    { label: "제휴문의", href: "#" },
  ];

  linkItems.forEach(({ label, href, class: cls }) => {
    const $li = el("li");
    const $a = el(
      "a",
      ["hover:text-black", cls || "text-inherit"].filter(Boolean).join(" "),
      { href },
      label,
    );
    $li.appendChild($a);
    $ul.appendChild($li);
  });

  $nav.appendChild($ul);

  // social icons
  const $icons = el("div", "flex items-center gap-4");
  const social = [
    { href: instagram, label: "Instagram", src: iconInsta },
    { href: facebook, label: "Facebook", src: iconFb },
    { href: youtube, label: "YouTube", src: iconYt },
  ];
  social.forEach(({ href, label, src }) => {
    const $a = el("a", "", { href, "aria-label": label });
    const $img = el("img", "h-7 w-7", { src, alt: "" });
    $a.appendChild($img);
    $icons.appendChild($a);
  });
  $topRow.appendChild($icons);

  // divider
  $container.appendChild(el("hr", "mt-5 border-gray-300"));

  // address
  const $addr = el(
    "address",
    "mt-6 text-sm leading-relaxed text-gray-500 not-italic",
  );
  $addr.appendChild(el("p", "font-semibold text-gray-500", {}, company));
  $addr.appendChild(el("p", "mt-1", {}, address));
  $addr.appendChild(el("p", "mt-1", {}, bizno));
  $addr.appendChild(el("p", "mt-1", {}, ceo));
  $container.appendChild($addr);

  return $footer;
}

/**
 * 타겟 노드에 푸터를 렌더링하고, 생성된 footer 요소를 반환합니다.
 * @param {Element} [target=document.body]
 * @param {Object} [options] createFooter 옵션
 * @returns {HTMLElement}
 */
export function renderFooter(target = document.body, options = {}) {
  const $footer = createFooter(options);
  target.appendChild($footer);
  return $footer;
}

export default renderFooter;
