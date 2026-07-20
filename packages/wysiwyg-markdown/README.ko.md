# WYSIWYG Markdown

[English](./README.md) | 한국어

SideNote가 내부에서 사용하는 WYSIWYG Markdown 에디터입니다. Lit과
ProseMirror로 만든 확장 가능한 Web Component이며 SideNote npm workspace 안에서
함께 관리합니다.

## SideNote 루트에서 개발하기

```powershell
npm.cmd install
npm.cmd run typecheck
npm.cmd run test:editor
npm.cmd run build:editor
```

독립 데모 앱은 다음 명령으로 실행합니다.

```powershell
npm.cmd run demo --workspace @sidenote/wysiwyg-markdown
```

프로덕션 번들은
`packages/wysiwyg-markdown/dist/wysiwyg-markdown.js`에 생성됩니다. SideNote
루트의 `npm run build`가 에디터를 먼저 빌드한 뒤 Chrome/Firefox 확장에 바로
포함하므로 수동 복사나 별도 저장소가 필요하지 않습니다.

## 기본 사용법

```html
<script type="module" src="./wysiwyg-markdown.js"></script>
<wysiwyg-markdown id="editor"></wysiwyg-markdown>
```

```js
const editor = document.querySelector('#editor');
editor.value = '# Hello';
editor.addEventListener('input', (event) => {
  console.log(event.detail.markdown);
});
```

기본적으로 WYSIWYG 문서를 더블클릭하면 문서 전체를 수정하는 Markdown source
모드로 전환됩니다. `Ctrl/Cmd + Enter`로 돌아갈 수 있습니다. 블록 단위 source
편집은 `source-edit-scope="block"`을 지정할 때만 사용합니다.

호스트 앱은 `themeCss`로 신뢰할 수 있는 CSS를 전달하고 코드 헤더와 줄 번호를
설정하며 공개 확장 API로 command/input rule을 등록할 수 있습니다. 편집 가능한
문법 강조는 `codeHighlighter` 콜백과 ProseMirror decoration을 사용하므로 편집
DOM을 다시 작성하지 않습니다.

구조와 확장 지점은 [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md)를
참고하세요.
