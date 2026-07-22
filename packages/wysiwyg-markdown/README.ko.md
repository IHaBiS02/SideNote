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
포함하고 Firefox 심사용 원본 소스 ZIP까지 생성하므로 수동 복사나 별도
저장소가 필요하지 않습니다.

같은 빌드 과정에서 확장 프로그램과 에디터의 전체 런타임 의존성 그래프를
기준으로 루트 `LIBRARY_LICENSES.md`를 다시 생성합니다. Lit, ProseMirror,
Markdown-it 및 각각의 전이 런타임 의존성도 여기에 포함됩니다.

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

## 공개 API

Markdown 문자열은 `value`, `getMarkdown()`, `setMarkdown()`으로 읽고
설정합니다. `setMode('wysiwyg' | 'source' | 'readonly')`로 모드를 바꿉니다.

편집 메서드는 `focus()`, `undo()`, `redo()`, `execute()`, `insertText()`,
`insertMarkdown()`, `replaceSelection()`, `insertImage()`, `scrollToImage()`를
제공합니다. 마지막 메서드는 저장된 Markdown 이미지 경로로 이미지를 찾아
Shadow DOM 내부를 외부에 노출하지 않고 화면 안으로 스크롤합니다. `use()`로
확장을 설치하고 `removeExtension()`으로 제거합니다.

호스트 통합 훅은 다음과 같습니다.

- `themeCss`: Shadow DOM에 적용할 신뢰 가능한 호스트 CSS
- `codeHighlighter`: 문법 강조 토큰 범위와 CSS 클래스
- `uploadImage`: 붙여넣은 이미지 저장
- `imageResolver`: 저장된 Markdown 이미지 경로 해석
- `transformPastedText`: plain text 붙여넣기 변환
- `showCodeBlockHeader`, `showCodeLineNumbers`: 코드 블럭 UI 설정

컴포넌트는 Shadow DOM 밖에서도 받을 수 있는 `input`, `change`,
`mode-change`, `selection-change`, `image-activate`, `editor-error` 이벤트를
발생시킵니다. `input`과 `change`의 최신 Markdown은
`event.detail.markdown`에 있습니다. 렌더링된 이미지를 클릭하면 발생하는
`image-activate`에는 저장된 `source`와 화면 표시용 `displaySource`가 있습니다.

확장은 command, shortcut, input rule을 추가할 수 있습니다.

```js
editor.use({
  name: 'insert-date',
  shortcuts: {
    'Mod-Shift-d': ({ state, dispatch }) => {
      if (!dispatch) return true;
      dispatch(state.tr.insertText(new Date().toISOString().slice(0, 10)));
      return true;
    },
  },
});
```

기본적으로 WYSIWYG 문서를 더블클릭하면 문서 전체를 수정하는 Markdown source
모드로 전환되며, source 커서는 더블클릭한 내용에 대응하는 Markdown 위치로
이동합니다. 문서의 위·아래 경계가 허용하는 범위에서는 해당 커서가 화면 중앙에
오도록 스크롤됩니다. `Ctrl/Cmd + Enter`로 돌아가면 source 커서 위치를 다시
WYSIWYG 위치로 변환하고 그 커서도 중앙에 배치합니다. 블록 단위 source 편집은
`source-edit-scope="block"`을 지정할 때만 사용합니다.

커서가 빈 제목에 있을 때 `Backspace`를 누르면 일반 문단으로 돌아가며 Markdown
값에서도 해당 `#` 제목 표시가 제거됩니다.

호스트 앱은 `themeCss`로 신뢰할 수 있는 CSS를 전달할 수 있습니다. 편집 가능한
문법 강조는 ProseMirror decoration을 사용하므로 편집 DOM을 다시 작성하지
않습니다. fenced code 내용의 내부 여백은 `--editor-code-content-padding`
(기본값 `5px`)으로 설정할 수 있습니다. 줄 번호가 있는 블록은 번호 영역과 코드
본문에 같은 상하 여백을 적용해 각 줄을 정렬합니다. 컴포넌트의 본문 및 제목
줄 높이 기본값은 `1.5`이며, 전체 문서 plain-text 모드와 fenced code block의 줄 높이는
`1.2`입니다. 호스트는 `--editor-line-height`, `--editor-heading-line-height`,
`--editor-source-line-height`, `--editor-code-line-height`로 각각 재정의할 수
있습니다. 브라우저별 UA 스타일을 상속하지 않도록 제목 크기·굵기·여백도
명시적으로 정의합니다. 글머리 기호와 번호 목록 마커는
`--editor-list-marker-color`를 사용합니다. 기본값은 현재 글자색에서 연한 색을
계산하며, 호스트는 라이트·다크 테마별 색상을 직접 지정할 수 있습니다. Markdown
표의 각 셀에는 겹치지 않는 1px 테두리가 표시되며, 색상은 기본적으로 현재
글자색을 따르는 `--editor-table-border-color`로 재정의할 수 있습니다. Markdown
정렬 표시가 없는 열의 셀 내용은 기본적으로 가운데 정렬되며, 왼쪽·가운데·오른쪽
정렬을 명시한 열은 해당 설정을 그대로 따릅니다. 왼쪽 및 오른쪽 정렬 셀은 정렬
방향의 테두리에서 `--editor-table-aligned-cell-padding`만큼 떨어지며 기본값은
`5px`입니다.

현재 구조와 확장 지점은 [`ARCHITECTURE.md`](./ARCHITECTURE.md)를
참고하세요. WYSIWYG 모드의 기본 Markdown 입력 규칙, 단축키, 붙여넣기 동작은
[`WYSIWYG_INPUT_BEHAVIORS.ko.md`](./WYSIWYG_INPUT_BEHAVIORS.ko.md)에 정리되어
있습니다.
지원하는 모든 노드와 인라인 서식을 한 번에 렌더링하고 상호작용까지 점검하려면
[`MARKDOWN_SYNTAX_TEST.md`](./MARKDOWN_SYNTAX_TEST.md)를 테스트 노트로 사용하세요.
