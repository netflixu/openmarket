# SPA 오픈마켓 서비스

## 1. 목표와 기능

### 1.1 목표

#### 1.1.1 팀 목표

- 싸우지말고 다함께 으쌰으쌰 하여 서로 도와주며 행복하게 프로젝트 마무리하기.

#### 1.1.2 프로젝트 목표

- **바닐라 JS**를 사용하여 판매자와 구매자를 구별하는 **오픈마켓 서비스 개발**.

### 1.2 기능

- 제공된 백엔드 서버 API를 활용한 **SPA(Single Page Application)**오픈마켓 서비스
  - 로그인/로그아웃
  - 회원가입
  - 상품목록
  - 상품상세
- 판매자가 상품을 등록, 판매하며 구매자는 상품을 구매하는 마켓 플랫폼

### 1.3 팀 구성

<table>
	<tr>
		<th>팀장</th>
		<th>팀원</th>
		<th>팀원</th>
		<th>팀원</th>
	</tr>
 	<tr>
		<td>임영후</td>
		<td>허지은</td>
		<td>김규호</td>
		<td>안민</td>
	</tr>
</table>

### 1.4 SPA 도입 배경

본 프로젝트는 **SPA(Single Page Application)** 구조를 채택하였습니다.

SPA 도입 이유는 다음과 같습니다:

- **더 빠른 사용자 경험**  
  페이지 전체를 다시 로딩하지 않고 필요한 부분만 동적으로 렌더링하여,
  더 빠른 화면 전환과 부드러운 사용자 경험을 제공합니다.

- **프론트엔드 중심의 라우팅 처리**  
  서버에서 매번 HTML 파일을 전달받는 전통적인 방식이 아니라,
  `/#경로` 형태의 해시 기반 라우팅을 사용하여 **단일 index.html에서 모든 페이지 전환을 처리**합니다.

- **템플릿, 스크립트 구조의 명확한 분리와 관리**  
  각 페이지별로 템플릿(`templates/*.html`)과 스크립트(`scripts/*.js`)를 나누어 관리하여
  **유지보수와 협업이 용이**합니다.

- **백엔드 의존성 최소화**  
  정적 호스팅 환경(GitHub Pages)에서도 동작 가능하도록, SPA 구조로 구축하여
  **서버 없이도 완전한 프론트엔드 서비스 구현**이 가능합니다.

## 2. 개발 환경 및 배포 URL

### 2.1 개발 환경 및 도구

- JavaScript, TailwindCSS
- Node.js, GitHub Page

### 2.2 배포 URL

- https://netflixu.github.io/openmarket/
- 테스트용 계정
  ```
  - 구매자(buyer)
    - ID : buyer1 PW: weniv1234
    - ID : buyer2 PW: weniv1234
    - ID : buyer3 PW: weniv1234
  - 판매자(seller)
    - ID : seller1 PW : weniv1234
    - ID : seller2 PW : weniv1234
    - ID : seller3 PW : weniv1234
  ```

### 2.3 URL 구조

| App  | URL             | Views Function | Template File Name         | Note          |
| ---- | --------------- | -------------- | -------------------------- | ------------- |
| main | '/'             |                | index.html                 | 홈 화면       |
| main | '/#join'        | join           | templates/join.html        | 회원가입 화면 |
| main | '/#login'       | login          | templates/login.html       | 로그인 화면   |
| main | '/#productList' | productList    | templates/productList.html | 상품목록 화면 |
| main | '/#product'     | product        | templates/product.html     | 상품상세 화면 |
| main | '/#404'         | 404            | templates/404.html         | 404 화면      |

### 2.4 네이밍 컨벤션

| 분류         | 규칙                   | 예시                                |
| ------------ | ---------------------- | ----------------------------------- |
| CSS 클래스명 | kebab-case             | .product-item, .gnb-button          |
| CSS 아이디명 | camelCase              | #productList, #loginForm            |
| JS 변수명    | camelCase              | productList, isLoggedIn             |
| JS 함수명    | camelCase              | handleLogin(), fetchProducts()      |
| JS 클래스명  | PascalCase             | UserService, ProductCard            |
| 파일명       | kebab-case, .js 확장자 | login-page.js, cart-page.js, gnb.js |

### 2.5 Git 관리

#### 2.5.1 깃 브랜치 전략

Github flow + develop branch

| Branch Name   | 규칙                                                                                      |
| ------------- | ----------------------------------------------------------------------------------------- |
| main          | **최종 배포 코드**. 개발 완료된 코드만 올라갈 수 있도록 한다. 삭제하지 않는 브랜치.       |
| dev           | 개발 branch로 이 브랜치를 기준으로 각자 작업한 기능을 병합한다. 삭제하지 않는 브랜치.     |
| 기능별 branch | 기능 단위로 만들어지는 branch로 dev 브랜치에서 생성하며, dev 브랜치로 병합한 후 삭제한다. |

#### 2.5.2 커밋 컨벤션

깃모지 없이 깔끔하게 텍스트로만 구성

```bash
git commit -m 'type: 구현내용'
```

| type     | 설명                                                                       |
| -------- | -------------------------------------------------------------------------- |
| feat     | 기능 구현                                                                  |
| fix      | 버그 수정                                                                  |
| docs     | 문서 수정                                                                  |
| style    | 코드 formatting, 세미콜론 추가 등 코드 내용 수정이 아닌 코드 스타일만 수정 |
| refactor | 코드 리팩토링                                                              |
| test     | 테스트 코드 추가, 테스트 코드 리팩토링                                     |
| chore    | 빌드, 패키지 매니저 등 코드 내용 수정이 아닌 그 이외 사항 수정             |

### 2.6 프로젝트 초기화 및 설치

#### 2.6.1 TailwindCSS 설정 방법 (CLI 방식)

1. 프로젝트 초기화 및 설치

```bash
npm install tailwindcss @tailwindcss/cli
```

2. Tailwind input 파일 생성

`./src/input.css`

```css
@import "tailwindcss";
```

3. 빌드 및 watch 명령어 실행 (빌드시 output.css 생성, '--watch' 모드는 실시간 빌드모드)

```bash
npx tailwindcss -i ./src/input.css -o ./src/output.css --watch
```

4. HTML에서 연결

`index.html` 등

```html
<link href="./src/output.css" rel="stylesheet" />
```

---

#### 2.6.2 Prettier 설정 (Tailwind 플러그인 포함)

1. Prettier 플러그인 설치

```bash
npm install -D prettier prettier-plugin-tailwindcss
```

2. 설정 파일 추가

`prettier.config.js`

```js
module.exports = {
  plugins: [require("prettier-plugin-tailwindcss")],
};
```

3. VSCode Prettier 설정 및 사용법

- Extentions에서 Prettier - Code formatter 확장 설치

- 프로젝트 루트에 설정 파일 생성

`.vscode/settings.json`

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "prettier.plugins": ["prettier-plugin-tailwindcss"]
}
```

```
• 저장 시 자동 정렬: Ctrl + S(저장)할 때마다 Tailwind 클래스가 자동 정렬됩니다.
• 명령어로 실행: Cmd/Ctrl + Shift + P → Format Document 입력 후 실행
```

---

#### 2.6.3 .gitignore 설정

`.gitignore`

```
node_modules/
src/output.css
package-lock.json
.DS_Store
```

## 3. 요구사항 명세와 기능 명세

[요구사항 명세 링크](https://paullabworkspace.notion.site/2-231ebf76ee8a810aad87edf6e9ca290a#231ebf76ee8a81ea848ff4ec9d75788b)

### 로그인

빈값·불일치 → 입력 아래 경고, 포커스 이동

경고 표시 중엔 로그인 불가

성공 시 이전 페이지로 이동(리턴 URL)

구매자 탭 선택 시 구매자, 판매자 탭 선택 시 판매자로 로그인

### 회원가입

필수값 + 약관 동의 체크 시만 가입

아이디와 사업자 등록번호는 중복 시 경고 표시

완료 후 로그인 페이지로 이동

구매자 탭에서 가입 시 구매자, 판매자 탬에서 가입 시 판매자로 등록

회원가입 유효성 오류 메시지 참고 ([링크](https://paullabworkspace.notion.site/231ebf76ee8a81668148d00182700338))

### 상품 목록

판매자/상품명/가격 표시

카드 클릭 → 상세 이동

### 상품 상세

productId 로드

수량은 +/− 버튼만 변경, 재고 초과 시 + 비활성 (판매 회원은 구매와 관련된 모든 버튼 비활성화)

옵션 반영 총 가격 표시

동일 상품 중복 추가 방지 - 도전과제

### GNB

비로그인/구매회원: 검색 + 장바구니

비로그인 상태에서 장바구니/바로구매 클릭 → 로그인 모달

판매회원: 마이페이지 + 판매자센터

### 마이페이지 드롭다운

아이콘 클릭 시 메인컬러, 드롭다운 열기/외부 클릭 닫기

항목: 마이페이지(UI만), 로그아웃

### 푸터

시멘틱 태그를 고려하여 시안 구현

## 4. 프로젝트 구조와 개발 일정

### 4.1 프로젝트 구조

```
project
├─ components
│  ├─ footer.html
│  └─ header.html
├─ images/
├─ index.html
├─ package.json
├─ prettier.config.js
├─ README.md
├─ scripts
│  ├─ 404.js
│  ├─ auth.js
│  ├─ footer.js
│  ├─ getUserInfo.js
│  ├─ header.js
│  ├─ initAutoRefresh.js
│  ├─ join.js
│  ├─ login.js
│  ├─ modal.js
│  ├─ product.js
│  ├─ productList.js
│  ├─ returnUrl.js
│  ├─ router.js
│  └─ tokenStore.js
├─ src
│  ├─ input.css
│  └─ output.css
├─ styles
│  └─ style.css
└─ templates
   ├─ 404.html
   ├─ join.html
   ├─ login.html
   ├─ product.html
   └─ productList.html
```

### 4.1 개발 일정(WBS)

```
- 개발기간
    : 2025년 9월 8일 회의
    : 2025년 9월 9일 ~ 15일(주말 제외 5일)
```

![개발 일정](./images/readme/wbs.png)

## 5. 역할 분담

- 임영후(팀장)
  - 로그인 페이지
  - 토큰 관리
  - 팀원 업무 및 일정 관리
- 허지은
  - 회원가입 페이지
  - 헤더GNB
  - 전반적인 반응형 작업
  - 노션 관리
- 김규호
  - 상품상세 페이지
  - 프로젝트 초기 설정 (폴더 구조, 깃 설정 등)
  - 라우터 기초 작업
  - 페이지 배포 관리
  - 헤더 컴포넌트 분리 작업
- 안민
  - 상품목록 페이지
  - 404페이지 구현
  - 라우터 에러 체크
  - 푸터 구현 및 컴포넌트 분리 작업

## 6. 와이어프레임 / UI

[피그마 링크](https://www.figma.com/design/rbi8px4O2GrnXN4gK0ZaLv/WENIV_FE_%EC%8B%A4%EC%8A%B5-%EC%98%88%EC%A0%9C?node-id=49-1791&p=f&t=NlVsrGvdZ10glS7b-0)

### 6.1 와이어프레임

![와이어프레임](./images/readme/wireframe.png)

### 6.2 UI

<table>
    <tbody>
        <tr>
            <td>메인(비로그인)</td>
            <td>로그인</td>
        </tr>
        <tr>
            <td>
		<img src="./images/readme/no-login.png" width="100%">
            </td>
            <td>
                <img src="./images/readme/login.png" width="100%">
            </td>
        </tr>
        <tr>
            <td>회원가입(구매자)</td>
            <td>회원가입(판매자)</td>
        </tr>
        <tr>
            <td>
                <img src="./images/readme/buyer-join.png" width="100%">
            </td>
            <td>
                <img src="./images/readme/seller-join.png" width="100%">
            </td>
        </tr>
        <tr>
            <td>메인(구매자)</td>
            <td>메인(판매자)</td>
        </tr>
        <tr>
            <td>
                <img src="./images/readme/buyer-main.png" width="100%">
            </td>
            <td>
                <img src="./images/readme/seller-main.png" width="100%">
            </td>
        </tr>
        <tr>
            <td>상품 상세(구매자)</td>
            <td>상품 상세(판매자)</td>
        </tr>
        <tr>
            <td>
				        <img src="./images/readme/buyer-product.png" width="100%">
            </td>
            <td>
                <img src="./images/readme/seller-product.png" width="100%">
            </td>
        </tr>
        <tr>
            <td>404 에러페이지</td>
            <td>모달 및 드롭다운</td>
        </tr>
        <tr>
            <td>
                <img src="./images/readme/404.png" width="100%">
            </td>
            <td>
                <img src="./images/readme/modal.png" width="100%">
                <img src="./images/readme/mypage-dropdown.png" width="50%">
            </td>
        </tr>
    </tbody>
</table>

## 7. 메인 기능

- **SPA(라우터)**

- 정규화

- CLI를 이용한 Tailwind CSS 사용
  - 프로젝트에 Tailwind CSS를 사용하기로 결정
  - 스타일 class 작성 순서에 대해 고민 -> Tailwind CSS의 순서를 자동으로 정렬해주는 Prettier 패키지를 설치
  - Tailwind CSS 또한 CLI로 설치 후 output.css 파일을 뽑아 스타일 적용

- 회원가입
  - userType을 이용하여 구매자/판매자 회원가입을 구분한다. (조건에 따른 폼 변화)
  - 제공된 API를 이용하여 아이디, 사업자 등록번호 중복을 체크한다.
  - 각 input의 조건에 따라 유효성 검사를 진행하며, 모든 조건을 충족해야 가입하기 버튼이 활성화 된다.
  - 실시간으로 유효성 검사를 진행하도록 한다.
  - 키보드만으로도 모든 항목을 접근할 수 있도록 한다. (Tab 접근성)
  - select 태그가 아닌 ul li 태그를 이용하여 샐랙트 박스 커스텀 디자인을 적용한다.

- 로그인/로그아웃
  - Access Token은 localStorage에, Refresh Token은 sessionStorage에 저장해 사용했습니다.
  - 현재는 Access Token을 4분마다 주기적으로 갱신하고 있습니다. 앞으로는 호출 빈도를 줄이기 위해, 필요한 시점(만료 임박 또는 인증 실패 시)에만 Refresh Token으로 Access Token을 재발급받도록 개선할 예정입니다.

- 상품목록

- 상품상세(:id)

- GNB 로그인에 따른 상태 관리
  - 로그인 상태를 확인하여 아이콘 영역에 바로 반영한다. (아이콘 영역 세팅 함수 이용)
  - 마이페이지 드롭다운 영역을 구현한다. (키보드로도 접근할 수 있도록 구현)

## 8. 에러와 에러 해결

### 8.1 JavaScript가 로드 되지 않는 문제

#### 원인

기본 페이지에서 다른 페이지로 이동했다가 돌아오면 기능이 동작하지 않는 문제가 있었습니다.
HTML만 갱신되고 JavaScript가 재실행되지 않아 이벤트가 등록되지 않은 것이 원인이었습니다.

#### 해결

페이지가 바뀔 때마다 해당 페이지에 필요한 스크립트를 동적으로 로드하고 초기화하도록 변경하여 문제를 해결했습니다.

### 8.2 라우터 갱신 오류

### 8.3 페이지별 메타 태그(og:title, description 등) 처리

#### 문제

index.html 파일 하나에서 JS를 이용하여 template 파일과 script를 불러와 동적으로 적용하는 방식으로 구현이 되다보니 meta 태그를 직접 처리해줘야 하는 상황이 생겼다.

#### 해결

router.js에서 url의 정보를 받아 페이지를 구별한 후 meta 태그를 각 페이지에 맞는 정보로 업데이트 하는 방식으로 구현하였다.
이때 routeArray 변수를 만들어 각 라우터에 적용할 값을 미리 정의해두었다. 동적으로 내용이 변경되는 상품 상세 리스트의 경우, 해당 페이지를 로드할 때 meta 태그를 업데이트 하도록 구현하였다.

### 8.4 브라우저 히스토리 관리 복잡

### 8.5 회원가입 페이지 실시간 유효성 검사

#### 문제

회원가입 페이지에서 유효성 검사를 실시간으로 감지하여 가입하기 버튼의 상대를 변화시켜야 한다.

#### 해결

회원가입에 필요한 전체 input을 확인하는 함수를 생성하여 빈 값을 체크한다. 또한 필수로 유효한 값인지 체크가 필요한 input 정보는 check 여부를 함께 객체에 담아 관리한다. documet에 click, keyup 이벤트를 이용하여 사용자가 동작하는 것을 감지해 유효성 검사를 진행하여 가입하기 버튼의 상태에 반영한다.

## 9. 개발하며 느낀점

### 9.1 javascript로 구현한 SPA 도입의 한계

- 초기 로딩 속도 증가
- 모든 기능이 JS에 의존 → 오류 시 전체 페이지 사용 불가
- SEO 대응 어려움 -> meta 태그 동적 삽입만으로는 부족함

### 9.2 팀원 후기

1. 임영후

   서로 격려하며 프로젝트를 끝까지 마무리하는 것을 목표로 했고, 계획대로 잘 마무리되어 만족스럽습니다. 코드 리뷰를 통해 서로의 부족한 부분을 보완하고 기술적인 내용을 함께 배우는 시간이었습니다.

2. 허지은

   개인 프로젝트가 아닌 팀 프로젝트로 진행하면서 어떻게 여러 사람과 함께 개발해야 하는지를 배울 수 있는 기간이었던 거 같습니다.

   어떤 방식으로 프로젝트의 구조를 잡고 일정을 짜며 어떤 방식으로 코드를 작성할 지 상의하고 업무를 분담하는 모든 과정이 생소하지만 재미있었습니다.

   많은 기능을 구현하지는 못했지만 맡은 기능을 더 꼼꼼하게 확인하고 애정을 쏟는 시간이 되었다고 생각합니다. 바닐라 JS를 이용한 SPA 작업을 하면서 평소 접하지 못했던 문제들을 경험하는 기회도 있었습니다. 또한 git을 이용해서 협업하는 과정을 익힐 수 있어 좋았습니다.

   개인 프로젝트를 진행할 때도 느꼈지만, 꼭 다 했다 싶으면 오류들이 하나씩 삐져나오는 걸 보면서 끝날 때 까지 끝난게 아니구나 했습니다. 부족한 저와 같이 열심히 열내면서 작업한 팀원분들께 감사인사 드립니다!!

3. 김규호
4. 안민
