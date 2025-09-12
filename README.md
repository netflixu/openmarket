# openmarket

오픈마켓 2차프로젝트

## TailwindCSS 설정 방법 (CLI 방식)

1. 프로젝트 초기화 및 설치

```bash
npm install tailwindcss @tailwindcss/cli
```

2. Tailwind input 파일 생성

`src/input.css`

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

## Prettier 설정 (Tailwind 플러그인 포함)

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

## .gitignore 설정

`.gitignore`

```
node_modules/
src/output.css
package-lock.json
.DS_Store
```
