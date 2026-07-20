# WYSIWYG Markdown Editor 구현 및 SideNote 통합 계획서

## 1. 문서 목적

이 문서는 재사용 가능한 WYSIWYG Markdown 에디터를 독립적인 Web Component로 개발하고, 현재 저장소의 `SideNote` 브라우저 확장에 통합하기 위한 구현 계획을 정의한다.

최종 목표는 다음과 같이 스크립트와 HTML 태그만으로 에디터를 사용할 수 있게 만드는 것이다.

```html
<script type="module" src="/wysiwyg-markdown.js"></script>

<wysiwyg-markdown
  name="content"
  placeholder="내용을 입력하세요"
></wysiwyg-markdown>
```

에디터는 SideNote에 종속되지 않는 별도 라이브러리로 만들고, SideNote는 얇은 어댑터를 통해 저장소, 이미지, 설정 기능을 연결한다.

---

## 2. 제품 목표

### 2.1 기본 편집 경험

- 기본 상태에서는 일반 문서 편집기처럼 바로 입력할 수 있다.
- 사용자는 화면에 Markdown 기호 대신 적용된 서식을 본다.
- 줄 시작에서 `# `, `## `, `- ` 같은 패턴을 입력하면 제목이나 목록으로 변환된다.
- 제목, 문단, 목록, 인용문, 링크, 이미지, 코드 등 Markdown 구조를 직접 편집할 수 있다.
- undo/redo, selection, 복사/붙여넣기, 한글 IME 입력이 안정적으로 작동한다.

### 2.2 Markdown 소스 편집

- WYSIWYG 문서를 더블클릭하면 전체 Markdown을 plain-text source로 수정할 수 있다.
- `Ctrl/Cmd + Enter` 또는 포커스 아웃으로 변경을 적용한다.
- `Escape`로 변경을 취소한다.
- 목록처럼 여러 항목이 하나의 구조를 이루는 경우 목록 전체를 소스 편집 단위로 취급한다.
- 필요하면 전체 문서를 Markdown 소스로 편집하는 모드도 제공한다.

### 2.3 확장 가능성

- 사용자가 키보드 단축키를 추가하거나 교체할 수 있다.
- 특정 문자열 입력을 문서 구조로 변환하는 규칙을 추가할 수 있다.
- 명령, 툴바 항목, 상태 표시, 커스텀 렌더링을 확장할 수 있다.
- 장기적으로 표, 수식, 멘션 같은 새 Markdown 문법도 추가할 수 있어야 한다.

### 2.4 배포 형태

- 순수 HTML에서 사용할 수 있다.
- React, Vue, Svelte 등에서도 동일한 Custom Element를 사용할 수 있다.
- npm 패키지와 브라우저용 단일 ESM 번들을 제공한다.
- Chrome/Firefox 확장 프로그램에 원격 코드 없이 로컬 번들로 포함할 수 있다.

### 2.5 데모 애플리케이션

- 에디터를 SideNote에 통합하기 전에 브라우저에서 독립적으로 실행하고 테스트할 수 있는 데모 앱을 제공한다.
- 별도 서버나 데이터베이스 없이 로컬 개발 서버에서 실행할 수 있어야 한다.
- WYSIWYG, 전체 소스 편집, readonly 모드를 한 화면에서 확인할 수 있어야 한다.
- 사용자 정의 단축키와 input rule을 직접 등록하고 결과를 확인할 수 있어야 한다.
- 현재 Markdown 값과 발생한 이벤트를 개발자가 실시간으로 확인할 수 있어야 한다.
- 이미지 붙여넣기와 이미지 resolver를 메모리 기반 어댑터로 시험할 수 있어야 한다.

---

## 3. 기술 선택

### 3.1 TypeScript

공개 API, 명령, 확장 규격, 문서 노드 타입을 명확하게 정의하기 위해 TypeScript를 사용한다. 최종 배포물은 브라우저에서 실행 가능한 JavaScript로 빌드한다.

### 3.2 Lit

Lit은 편집 엔진이 아니라 표준 Web Component를 만들기 위한 UI 라이브러리다. 다음 부분을 담당한다.

- `<wysiwyg-markdown>` Custom Element 등록
- 속성과 JavaScript 프로퍼티 동기화
- 컴포넌트 생명주기 관리
- 툴바와 소스 편집 UI 렌더링
- Shadow DOM과 스타일 캡슐화
- 외부로 전달할 이벤트 관리

Lit을 사용해도 결과물은 Lit 전용 컴포넌트가 아니라 브라우저 표준 Custom Element다. SideNote처럼 순수 JavaScript로 작성된 애플리케이션에서도 일반 HTML 요소처럼 사용할 수 있다.

Lit은 필수는 아니지만, SideNote 전용 위젯이 아니라 재사용 가능한 독립 라이브러리를 목표로 하므로 초기 구조를 안정적으로 유지하기 위해 사용한다.

### 3.3 ProseMirror

ProseMirror는 실제 편집 엔진을 담당한다.

- 구조화된 문서 모델
- selection 및 커서 관리
- transaction 기반 문서 변경
- undo/redo
- 키보드 단축키
- input rule
- 플러그인 상태
- 복사, 붙여넣기, 드래그 등 편집 동작

브라우저 `contenteditable`을 직접 제어하는 구현은 한글 IME, 중첩 목록, selection, undo/redo에서 복잡도가 급격히 증가하므로 사용하지 않는다.

### 3.4 Markdown parser 및 serializer

Markdown 문자열과 ProseMirror 문서 모델 사이를 변환한다.

```text
Markdown 문자열
    ⇅ parser / serializer
ProseMirror 문서 모델
    ⇅ transaction
WYSIWYG 화면
```

Markdown을 구조화된 모델로 변환한 뒤 다시 문자열로 직렬화하면 표기가 정규화될 수 있다. 예를 들어 같은 의미의 강조 문법이나 목록 기호가 다른 형태로 저장될 수 있다.

초기 버전에서는 다음 원칙을 적용한다.

- 문서의 의미와 렌더링 결과를 보존한다.
- 원본의 공백과 Markdown 기호 선택까지 완벽히 보존하는 것은 보장하지 않는다.
- serializer 결과를 정식 저장 Markdown으로 사용한다.

---

## 4. 전체 아키텍처

```text
SideNote
├─ 노트 및 이미지 IndexedDB
├─ 설정, import/export, 탐색
└─ SideNote Editor Adapter
      ↓ value / input / commands / image resolver

<wysiwyg-markdown>
├─ Lit 기반 Web Component 외부 API
├─ 툴바 및 소스 편집 UI
├─ 확장 레지스트리
└─ ProseMirror 편집 엔진
      ├─ Markdown 문서 모델
      ├─ parser / serializer
      ├─ commands
      ├─ keymaps
      └─ input rules
```

라이브러리 내부에서는 ProseMirror 문서 모델을 편집 상태의 기준으로 사용한다. 외부 애플리케이션과 데이터를 주고받을 때는 Markdown 문자열을 사용한다.

---

## 5. 프로젝트 구조

에디터는 현재 저장소 루트에 독립 프로젝트로 구성하고 `SideNote`는 소비자 프로젝트로 유지한다.

```text
wysiwyg-markdown/
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ src/
│  ├─ core/
│  │  ├─ schema.ts
│  │  ├─ parser.ts
│  │  ├─ serializer.ts
│  │  ├─ commands.ts
│  │  └─ editor-state.ts
│  ├─ element/
│  │  ├─ wysiwyg-markdown.ts
│  │  ├─ styles.ts
│  │  └─ form-control.ts
│  ├─ source-mode/
│  │  ├─ block-source-editor.ts
│  │  └─ document-source-editor.ts
│  ├─ extensions/
│  │  ├─ types.ts
│  │  ├─ registry.ts
│  │  ├─ keymap.ts
│  │  ├─ input-rules.ts
│  │  └─ standard.ts
│  └─ index.ts
├─ demo/
│  ├─ index.html
│  ├─ demo.ts
│  ├─ demo.css
│  ├─ sample-markdown.ts
│  └─ memory-image-adapter.ts
├─ tests/
│  ├─ unit/
│  └─ browser/
├─ dist/
│  └─ wysiwyg-markdown.js
└─ SideNote/
   ├─ src/editor/sidenote-editor-adapter.js
   └─ vendor/wysiwyg-markdown.js
```

초기에는 하나의 npm 패키지로 유지한다. 실제 외부 확장 생태계가 필요해질 때 `core`, `element`, `extensions` 패키지로 분리한다.

---

## 6. 공개 Web Component API

### 6.1 HTML 속성

```html
<wysiwyg-markdown
  name="content"
  placeholder="내용을 입력하세요"
  mode="wysiwyg"
  readonly
  disabled
></wysiwyg-markdown>
```

지원 대상 속성은 다음과 같다.

| 속성 | 설명 |
|---|---|
| `name` | form 제출 시 사용할 필드 이름 |
| `placeholder` | 빈 문서 안내 문구 |
| `mode` | `wysiwyg`, `source`, `readonly` |
| `readonly` | 내용 수정 방지 |
| `disabled` | 입력과 포커스 비활성화 |

긴 Markdown 문서는 HTML 속성보다 JavaScript의 `value` 프로퍼티로 전달한다.

### 6.2 JavaScript 프로퍼티 및 메서드

```ts
editor.value = '# Hello';
const markdown = editor.value;

editor.getMarkdown();
editor.setMarkdown(markdown);

editor.focus();
editor.undo();
editor.redo();

editor.setMode('wysiwyg');
editor.setMode('source');

editor.insertText('text');
editor.insertMarkdown('![Image](images/id.png)');
editor.replaceSelection('replacement');

editor.use(extension);
editor.removeExtension('extension-name');
editor.execute('toggleBold');
```

`value`, `input`, `focus()`는 SideNote의 기존 textarea 사용 코드를 쉽게 이전할 수 있도록 반드시 지원한다.

### 6.3 이벤트

모든 외부 이벤트는 Shadow DOM 밖에서도 받을 수 있도록 `bubbles: true`, `composed: true`로 발생시킨다.

| 이벤트 | 발생 시점 |
|---|---|
| `input` | 문서 내용이 변경될 때 |
| `change` | 편집이 확정되거나 포커스를 잃을 때 |
| `mode-change` | 편집 모드가 바뀔 때 |
| `selection-change` | 문서 선택 영역이 바뀔 때 |
| `editor-error` | 파싱 또는 확장 오류가 발생할 때 |
| `image-paste` | 이미지 파일이 붙여넣어졌을 때 |

`input` 이벤트의 `detail`에는 최신 Markdown과 변경 원인을 담는다.

```ts
type EditorInputDetail = {
  markdown: string;
  source: 'keyboard' | 'paste' | 'command' | 'source-edit' | 'api';
};
```

### 6.4 Form 연동

가능한 브라우저에서는 `ElementInternals` 기반 form-associated custom element로 동작하게 한다. 이를 통해 `name`, `disabled`, form reset, form 제출을 지원한다.

---

## 7. 편집 모드 설계

### 7.1 WYSIWYG 모드

- 초기 기본 모드다.
- 문서 구조를 시각적으로 보여주면서 바로 편집한다.
- Markdown 기호는 기본적으로 숨긴다.
- input rule과 shortcut extension이 활성화된다.

### 7.2 전체 문서 소스 모드

- WYSIWYG 또는 readonly 문서를 더블클릭하면 기본적으로 진입한다.
- 전체 Markdown 문자열을 textarea에서 수정한다.
- 적용 시 문서 전체를 다시 파싱한다.
- WYSIWYG로 돌아갈 때 현재 selection을 가능한 범위에서 복구한다.

### 7.3 선택적 블록 소스 모드

- `source-edit-scope="block"`을 지정한 경우에만 사용한다.
- 클릭한 최상위 편집 단위를 Markdown으로 직렬화해 textarea에 표시한다.
- 제목, 문단, 코드 블록은 해당 블록만 편집한다.
- 목록과 인용문은 구조가 깨지지 않도록 컨테이너 전체를 편집한다.
- 적용 전체를 하나의 undo transaction으로 기록한다.

### 7.4 Readonly 모드

- 문서를 렌더링하지만 수정할 수 없다.
- 링크, 이미지 확대, 코드 복사 같은 읽기 전용 상호작용은 허용한다.
- SideNote에서 기존 Preview 모드를 대체할 수 있다.

---

## 8. 확장 시스템

확장은 런타임 동작 확장과 문서 구조 확장으로 나눈다.

### 8.1 런타임 동작 확장

에디터 초기화 후에도 등록하거나 제거할 수 있다.

- 키보드 단축키
- 텍스트 입력 규칙
- 명령
- 툴바 항목
- decoration
- 상태 표시
- 이벤트 처리

```ts
editor.use({
  name: 'custom-heading',
  priority: 100,

  shortcuts: {
    'Mod-Shift-1': ({ commands }) => commands.setHeading(1),
  },

  inputRules: [
    {
      match: /^#\s$/,
      run: ({ commands }) => commands.setHeading(1),
    },
  ],
});
```

기본 제목 규칙은 `#` 하나가 아니라 줄 시작의 `# ` 입력이 완료됐을 때 작동하게 한다. 일반 `#` 입력과 충돌하지 않게 하기 위함이다. 사용자는 확장 설정으로 다른 동작을 선택할 수 있다.

### 8.2 문서 구조 확장

새 문법이나 블록을 추가할 때 사용한다.

- ProseMirror node 또는 mark
- Markdown parser 규칙
- Markdown serializer 규칙
- WYSIWYG renderer 또는 NodeView
- 필요할 경우 source editor 문법 지원

문서 스키마는 초기화 후 변경하기 어려우므로 구조 확장은 컴포넌트 초기화 전에 등록한다. 단축키나 input rule 같은 동작 확장만 런타임에 교체한다.

### 8.3 충돌 처리

- 높은 `priority`가 먼저 실행된다.
- 우선순위가 같으면 등록 순서를 따른다.
- 먼저 성공한 규칙에서 처리를 종료한다.
- 같은 이름의 확장을 중복 등록하지 않는다.
- 확장은 DOM을 직접 수정하지 않고 command와 transaction만 사용한다.
- 한글 IME 조합 중에는 텍스트 input rule을 실행하지 않는다.

---

## 9. MVP Markdown 지원 범위

1차 버전은 다음 문법을 대상으로 한다.

- 문단
- 제목 H1-H6
- 굵게
- 기울임
- 취소선
- 인라인 코드
- 코드 블록과 언어 정보
- 인용문
- 순서 목록
- 비순서 목록
- 체크리스트
- 링크
- 이미지
- 수평선
- 일반 줄바꿈과 hard break

다음 기능은 초기 MVP에서 제외하고 구조 확장 사례로 다룬다.

- 표
- 각주
- 수식
- 멘션
- 댓글
- 실시간 협업 편집
- 파일 업로드 자체의 영구 저장

이미지 파일의 영구 저장은 호스트 애플리케이션이 담당하고, 에디터는 콜백 또는 이벤트로 연결한다.

---

## 10. SideNote 현재 구조와 통합 전략

### 10.1 유지할 부분

SideNote는 노트 본문을 이미 Markdown 문자열로 저장하므로 다음 계층을 유지한다.

- IndexedDB 노트 데이터 형식
- 이미지 Blob 저장소
- 노트 CRUD
- 자동 제목 생성
- import/export
- 설정 저장
- 탐색 및 history

기존 `.snote` 및 `.snotes` 파일도 본문 형식을 바꿀 필요가 없다.

### 10.2 교체할 HTML

현재 `SideNote/sidepanel.html`의 다음 구조를 교체한다.

```html
<textarea id="markdown-editor"></textarea>
<div id="html-preview"></div>
```

교체 후 예상 구조는 다음과 같다.

```html
<wysiwyg-markdown
  id="markdown-editor"
  mode="readonly"
></wysiwyg-markdown>

<script
  type="module"
  src="vendor/wysiwyg-markdown.js"
></script>
```

초기 노트 열기는 읽기 모드로 시작하고, 편집 버튼 또는 더블클릭으로 WYSIWYG 모드에 진입하게 할 수 있다.

### 10.3 SideNote 어댑터

`SideNote/src/editor/sidenote-editor-adapter.js`를 추가해 애플리케이션과 에디터 사이의 책임을 분리한다.

어댑터의 역할은 다음과 같다.

- 노트 Markdown을 에디터에 설정
- `input` 이벤트를 받아 기존 자동 저장 호출
- 이미지 붙여넣기를 IndexedDB 저장과 연결
- `images/[id].png` 경로를 Blob URL로 변환
- 노트 전환 시 생성한 Blob URL 해제
- SideNote 설정을 컴포넌트 프로퍼티와 CSS 변수로 변환
- 기존 Preview/Edit 탐색 상태를 새 에디터 모드에 매핑

예상 인터페이스는 다음과 같다.

```js
export function connectSideNoteEditor(editor, dependencies) {
  const {
    saveContent,
    saveImage,
    getImage,
    getSettings,
  } = dependencies;

  // SideNote와 독립 에디터 사이의 이벤트 및 리소스 연결
}
```

### 10.4 자동 저장 연결

현재 SideNote의 `markdownEditor.addEventListener('input', ...)` 흐름은 유지한다. 새 컴포넌트의 `.value`가 최신 Markdown을 반환하게 해 기존 저장 로직의 변경 범위를 줄인다.

자동 저장은 키 입력마다 IndexedDB에 직접 쓰는 현재 동작을 우선 보존한다. 실제 입력 지연이 확인되면 별도의 작업으로 debounce 또는 저장 큐를 도입한다.

### 10.5 커서 삽입 API 교체

현재 SideNote의 `insertTextAtCursor()`는 textarea의 `selectionStart`와 `selectionEnd`에 의존한다. 이를 다음 컴포넌트 API 호출로 교체한다.

```js
editor.insertText(text);
editor.insertMarkdown(markdown);
editor.replaceSelection(markdown);
```

### 10.6 이미지 통합

이미지 붙여넣기 흐름은 다음과 같다.

```text
사용자 이미지 붙여넣기
  → 에디터가 image-paste 이벤트 발생
  → SideNote가 Blob을 IndexedDB에 저장
  → SideNote가 images/[id].png Markdown 경로 반환
  → 에디터가 이미지 노드 삽입
  → 에디터가 input 이벤트 발생
  → 노트 Markdown 자동 저장
```

이미지 렌더링은 호스트가 제공하는 resolver를 이용한다.

```js
editor.imageResolver = async (src) => {
  const imageId = parseImageId(src);
  const blob = await getImage(imageId);
  return blob ? URL.createObjectURL(blob) : null;
};
```

컴포넌트 또는 SideNote 어댑터는 노트 전환과 컴포넌트 제거 시 생성한 Blob URL을 반드시 해제한다.

### 10.7 체크박스 통합

현재 별도 preview DOM의 체크박스를 찾아 Markdown 문자열을 변경하는 로직은 제거한다.

새 흐름은 다음과 같다.

```text
체크박스 클릭
  → ProseMirror transaction
  → 체크리스트 노드 상태 변경
  → Markdown serializer 실행
  → input 이벤트
  → SideNote 자동 저장
```

### 10.8 코드 블록 통합

현재 preview에서 수행하는 highlight.js 처리, 언어 헤더, 복사 버튼을 코드 블록 NodeView 또는 decoration 확장으로 옮긴다.

초기 단계에서는 편집 중 단순 코드 블록만 제공하고 readonly 모드에서만 syntax highlighting을 적용하는 방식으로 범위를 줄일 수 있다.

### 10.9 글꼴 및 테마 통합

컴포넌트는 Shadow DOM 외부에서 설정할 수 있도록 CSS custom property와 `::part`를 제공한다.

```css
wysiwyg-markdown {
  --editor-background: #ffffff;
  --editor-color: #111111;
  --editor-font-size: 16px;
  --editor-code-background: #f5f5f5;
}

.dark-mode wysiwyg-markdown {
  --editor-background: #1e1e1e;
  --editor-color: #e0e0e0;
  --editor-code-background: #252525;
}

wysiwyg-markdown::part(editor) {
  padding: 10px;
}
```

SideNote의 `applyFontSize()`는 textarea와 preview의 스타일을 직접 바꾸는 대신 `--editor-font-size`를 설정하도록 변경한다.

### 10.10 빌드 통합

SideNote는 현재 소스와 vendor 파일을 Chrome/Firefox 빌드 폴더로 복사한다. 독립 에디터가 생성한 `dist/wysiwyg-markdown.js`를 SideNote의 `vendor/`로 복사하도록 `SideNote/build.js`를 확장한다.

브라우저 확장에서는 원격 CDN을 사용하지 않는다. Lit, ProseMirror 등 모든 런타임 의존성은 로컬 단일 ESM 번들에 포함한다.

---

## 11. 단계별 구현 계획

### 단계 0: 동작 명세 고정

#### 작업

- 문서 더블클릭 전체 source 전환 동작 정의
- readonly, WYSIWYG, 전체 source 모드 전환 규칙 정의
- Markdown 정규화 정책 문서화
- 기본 단축키와 input rule 목록 확정
- 확장 우선순위와 오류 처리 규칙 확정

#### 완료 기준

- 대표 사용자 흐름을 테스트 시나리오로 표현할 수 있다.
- MVP에 포함할 Markdown 문법과 제외할 문법이 확정된다.

### 단계 1: 독립 프로젝트 기반 구성

#### 작업

- TypeScript 및 라이브러리 빌드 설정
- Lit Custom Element 기본 구현
- 단일 ESM 번들 생성
- 데모 앱의 기본 화면과 개발 서버 구성
- 기본 단위 테스트 및 브라우저 테스트 환경 구성

#### 완료 기준

- 빌드 결과를 HTML에서 불러오면 `<wysiwyg-markdown>` 태그가 표시된다.
- `npm run demo` 또는 `npm run dev`로 데모 앱을 실행할 수 있다.
- 컴포넌트를 생성, 제거, 재연결해도 오류와 이벤트 누수가 없다.

### 단계 2: Markdown 편집 코어

#### 작업

- ProseMirror 스키마 정의
- Markdown parser/serializer 연결
- 기본 command 구현
- history, undo/redo 연결
- `.value`, `getMarkdown()`, `setMarkdown()` 구현
- `input`, `change`, `editor-error` 이벤트 구현

#### 완료 기준

- MVP 문법을 Markdown에서 WYSIWYG로 불러올 수 있다.
- 편집 후 Markdown 문자열을 얻을 수 있다.
- Markdown → 문서 모델 → Markdown 왕복 테스트가 통과한다.

### 단계 3: 기본 WYSIWYG 동작

#### 작업

- 제목, 목록, 인용문, 코드 블록 등 시각적 스타일 구현
- 기본 keymap 구성
- `# `, `## `, `- `, `1. ` 등의 input rule 구현
- undo input rule 구현
- 붙여넣기와 일반 텍스트 정규화
- 한글 IME composition 처리

#### 완료 기준

- 일반 입력이 자연스럽게 작동한다.
- input rule 변환 후 undo하면 입력한 원문으로 돌아간다.
- 한글 조합 중 문서 구조가 잘못 변환되지 않는다.

### 단계 4: 소스 편집 모드

#### 작업

- 문서 더블클릭 전체 source 전환 및 선택적 블록 편집 단위 탐색
- 블록 Markdown 직렬화
- 블록 source textarea UI
- 적용, 취소, 오류 표시
- 전체 문서 source 모드
- source 적용을 단일 undo transaction으로 기록

#### 완료 기준

- 제목, 문단, 목록, 인용문, 코드 블록을 소스로 수정할 수 있다.
- 잘못된 소스가 기존 문서를 손상하지 않는다.
- 적용과 취소의 selection 및 포커스 동작이 일관적이다.

### 단계 5: 확장 API

#### 작업

- extension 타입 정의
- command, keymap, input rule registry 구현
- priority 및 충돌 처리
- 런타임 등록과 제거
- 구조 확장 초기화 API 설계
- 예제 확장 작성

#### 예제 확장

- 사용자 정의 제목 입력 규칙
- `Mod-Shift-1` 제목 단축키
- 현재 날짜 삽입 명령
- SideNote 체크리스트 동작

#### 완료 기준

- 외부 코드가 에디터 코어를 수정하지 않고 단축키와 입력 규칙을 추가할 수 있다.
- 확장 제거 후 등록된 동작과 상태가 정리된다.

### 단계 6: 이미지와 호스트 연동 API

#### 작업

- `image-paste` 이벤트 또는 비동기 이미지 업로드 콜백 정의
- `imageResolver` 구현
- 이미지 Blob URL 생명주기 관리
- `insertText()`, `insertMarkdown()`, `replaceSelection()` 구현
- 실패 및 누락 이미지 표시

#### 완료 기준

- 독립 데모에서 메모리 기반 이미지 어댑터가 작동한다.
- URL 생성과 해제가 테스트로 검증된다.

### 단계 7: Web Component 완성

#### 작업

- Shadow DOM 스타일 정리
- CSS custom property 및 `::part` 제공
- readonly, disabled, placeholder 지원
- form-associated custom element 지원
- 접근성 속성 및 키보드 탐색
- focus와 selection 공개 API 정리

#### 완료 기준

- 순수 HTML과 프레임워크 환경에서 같은 API로 사용할 수 있다.
- 외부 CSS로 크기, 색상, 글꼴을 설정할 수 있다.

### 단계 8: 독립 데모 애플리케이션 완성

#### 목적

SideNote 통합 전에 에디터의 기능과 공개 API를 실제 브라우저에서 사람이 직접 검증하고, 버그를 재현할 수 있는 독립 실행 환경을 만든다. 데모 앱은 제품용 노트 애플리케이션이 아니라 에디터 기능을 확인하는 개발·검증 도구로 유지한다.

#### 화면 구성

```text
┌────────────────────────────────────────────────────────────┐
│ 데모 툴바                                                  │
│ [WYSIWYG] [Source] [Readonly] [Undo] [Redo] [초기화]       │
├──────────────────────────────────┬─────────────────────────┤
│                                  │ 현재 Markdown           │
│ <wysiwyg-markdown>               │                         │
│                                  │ # Sample                │
│ 실제 편집 영역                   │                         │
│                                  │ 실시간 직렬화 결과      │
├──────────────────────────────────┴─────────────────────────┤
│ 이벤트 로그 / selection / 활성 확장 / 오류                │
└────────────────────────────────────────────────────────────┘
```

좁은 화면에서는 편집 영역과 Markdown 패널을 세로로 배치한다.

#### 제공 기능

- 샘플 Markdown 문서 불러오기
- 빈 문서로 초기화
- WYSIWYG, 전체 source, readonly 모드 전환
- 문서 더블클릭 전체 source 편집 확인
- undo/redo 버튼 및 키보드 단축키 확인
- 현재 Markdown 실시간 표시 및 복사
- 외부에서 Markdown을 수정해 에디터에 다시 적용
- `input`, `change`, `mode-change`, `selection-change`, `editor-error` 이벤트 로그
- 기본 input rule 활성화 여부 표시
- 예제 확장 등록과 제거
- 확장 priority 충돌 재현
- 다크/라이트 테마 전환
- 글꼴 크기와 주요 CSS custom property 변경
- readonly 및 disabled 상태 전환
- 이미지 붙여넣기와 미리보기
- 누락 이미지와 이미지 resolver 오류 상태 재현
- 긴 문서 샘플을 이용한 입력 성능 확인
- 한글 IME 테스트 안내 및 composition 상태 표시

#### 데모 전용 이미지 어댑터

SideNote의 IndexedDB 구현에 의존하지 않도록 데모 앱은 메모리 기반 이미지 저장소를 사용한다.

```ts
const images = new Map<string, Blob>();

editor.uploadImage = async (file) => {
  const id = crypto.randomUUID();
  images.set(id, file);
  return `memory-images/${id}`;
};

editor.imageResolver = async (src) => {
  const blob = images.get(parseMemoryImageId(src));
  return blob ? URL.createObjectURL(blob) : null;
};
```

생성한 Blob URL은 문서 초기화, 이미지 제거, 페이지 종료 시 해제한다.

#### 실행 명령

```powershell
npm run demo
```

또는 개발 서버와 동일한 명령을 사용할 경우 다음처럼 제공한다.

```powershell
npm run dev
```

데모 앱은 프로덕션 번들 결과도 확인할 수 있어야 한다.

```powershell
npm run build
npm run demo:dist
```

#### 구현 원칙

- 데모 앱은 에디터의 공개 API만 사용한다.
- 에디터 내부 클래스나 ProseMirror 인스턴스를 직접 참조하지 않는다.
- SideNote 전용 코드나 IndexedDB 코드를 가져오지 않는다.
- 데모에서 필요한 기능 때문에 제품 API를 우회하지 않는다.
- 브라우저 자동화 테스트가 데모 앱을 테스트 fixture로 재사용할 수 있게 한다.

#### 완료 기준

- 새로 프로젝트를 받은 사람이 한 명령으로 데모 앱을 실행할 수 있다.
- MVP의 모든 공개 기능을 데모 화면에서 수동으로 확인할 수 있다.
- 이벤트와 최신 Markdown 값을 화면에서 확인할 수 있다.
- 예제 확장을 코드 변경 없이 UI에서 켜고 끌 수 있다.
- 이미지 붙여넣기 및 resolver 흐름을 SideNote 없이 검증할 수 있다.
- Chrome, Firefox, Edge에서 데모의 핵심 기능이 작동한다.

### 단계 9: SideNote 1차 통합

#### 작업

- `sidepanel.html`의 textarea와 preview를 Web Component로 교체
- `dom.js` 참조 정리
- SideNote editor adapter 추가
- 노트 열기 및 자동 저장 연결
- 기존 Edit/Preview 상태를 editor mode에 연결
- build 스크립트에서 에디터 번들 복사

#### 완료 기준

- 기존 노트를 열고 편집하고 저장할 수 있다.
- SideNote 재실행 후 수정한 Markdown이 유지된다.
- Chrome과 Firefox 빌드에 에디터 번들이 포함된다.

### 단계 10: SideNote 기능 이전

#### 작업

- 이미지 붙여넣기 및 IndexedDB resolver 연결
- 체크박스 처리 이전
- 코드 블록 하이라이팅 및 복사 기능 이전
- 글꼴 크기와 다크 모드 연결
- 기존 preview 렌더러 의존 제거 또는 export 전용으로 축소
- legacy line break와 tilde 처리 정책 적용

#### 완료 기준

- 기존 SideNote의 편집 관련 핵심 기능이 새 에디터에서 작동한다.
- 이전 버전에서 저장한 노트와 이미지가 정상적으로 표시된다.

### 단계 11: 검증 및 배포 준비

#### 작업

- 단위 및 브라우저 테스트 확충
- 데모 앱을 이용한 공개 API 브라우저 테스트
- 브라우저 확장 수동 테스트
- 번들 크기 및 긴 문서 성능 측정
- README와 공개 API 문서 작성
- 순수 HTML, SideNote, React, Vue 예제 작성
- 라이선스 목록 갱신

#### 완료 기준

- 자동 테스트와 SideNote 빌드가 모두 통과한다.
- Chrome과 Firefox side panel에서 기능을 확인한다.
- 새 노트와 기존 노트 모두 데이터 손실 없이 편집된다.

---

## 12. 테스트 계획

### 12.1 단위 테스트

- Markdown parser/serializer 왕복
- command 실행 결과
- input rule 패턴과 예외
- extension 우선순위
- 확장 등록과 제거
- 이미지 경로 파싱
- source 편집 적용과 취소

### 12.2 브라우저 테스트

`contenteditable`, selection, IME는 jsdom만으로 충분히 검증하기 어려우므로 실제 브라우저 테스트를 추가한다.

- 일반 입력과 커서 이동
- 한글 IME 조합
- 제목과 목록 자동 변환
- undo/redo
- 문서 더블클릭 전체 source 전환
- 붙여넣기
- 이미지 삽입
- Shadow DOM 이벤트 전파
- readonly와 disabled
- form 제출
- 컴포넌트 제거 후 이벤트와 Blob URL 정리

브라우저 테스트는 가능하면 데모 앱을 공통 fixture로 사용한다. 자동화 테스트가 데모 UI를 통해서만 검증해야 한다는 뜻은 아니며, 에디터 공개 API를 직접 사용하는 전용 테스트 fixture도 병행한다.

### 12.3 데모 앱 수동 점검

- 샘플 문서와 빈 문서
- 모든 편집 모드 전환
- Markdown 실시간 직렬화 결과
- 전체 문서 source 편집 적용 및 복귀
- 확장 등록, 제거, 충돌
- 한글 IME 조합
- 이미지 붙여넣기와 누락 이미지
- 라이트/다크 테마
- 긴 문서 입력 반응성
- 개발 빌드와 프로덕션 번들의 동작 일치

### 12.4 SideNote 회귀 테스트

- 노트 생성, 수정, 삭제
- 자동 제목 생성
- 노트 정렬과 핀 고정
- 기존 Markdown 노트 열기
- 이미지가 포함된 기존 노트 열기
- 체크리스트 수정
- import/export
- 글꼴 크기
- 라이트/다크 모드
- Chrome/Firefox 빌드

기존 SideNote Vitest 테스트는 유지하고, 어댑터 로직을 별도 단위 테스트 대상으로 추가한다.

---

## 13. 주요 위험과 대응

### 13.1 Markdown 표기 정규화

**위험:** WYSIWYG 편집 후 원문의 기호나 공백 형태가 바뀔 수 있다.

**대응:** 의미 보존을 공식 정책으로 명시하고, parser/serializer golden test로 예상 출력 형태를 고정한다.

### 13.2 한글 IME

**위험:** 조합 중 input rule이나 key handler가 실행되면 문자가 분리되거나 구조가 잘못 변환될 수 있다.

**대응:** composition 상태에서는 변환 규칙을 실행하지 않고 실제 브라우저에서 테스트한다.

### 13.3 SideNote 이미지

**위험:** Blob URL을 계속 생성하면 메모리 누수가 발생할 수 있다.

**대응:** 노트별 URL registry를 두고 문서 변경, 노트 전환, 컴포넌트 해제 시 revoke한다.

### 13.4 Shadow DOM 스타일

**위험:** SideNote의 기존 CSS가 컴포넌트 내부에 적용되지 않는다.

**대응:** 공개 CSS 변수와 `::part` 계약을 만들고 SideNote 설정은 그 계약만 사용한다.

### 13.5 자동 저장 빈도

**위험:** transaction마다 Markdown 전체 직렬화와 IndexedDB 저장이 발생하면 긴 문서에서 입력 지연이 생길 수 있다.

**대응:** 먼저 성능을 측정한다. 문제가 확인되면 serializer 캐시, debounce, 저장 큐를 단계적으로 적용한다.

### 13.6 기존 preview 전용 기능

**위험:** 코드 블록, 체크박스, 이미지 확대처럼 preview DOM에 직접 연결된 기능이 사라질 수 있다.

**대응:** 기능별 이전 체크리스트를 두고 기존 renderer를 한 번에 삭제하지 않는다. 새 구현이 검증된 기능부터 교체한다.

### 13.7 브라우저 확장 정책

**위험:** 원격 코드나 번들되지 않은 의존성은 Manifest V3 환경에서 문제가 될 수 있다.

**대응:** 모든 런타임 코드를 단일 로컬 ESM 번들로 만들고 SideNote 빌드 결과에 포함한다.

---

## 14. MVP 완료 정의

다음 조건을 모두 만족하면 독립 에디터 MVP가 완료된 것으로 본다.

- `<wysiwyg-markdown>` 태그로 로드할 수 있다.
- Markdown 문자열을 설정하고 다시 읽을 수 있다.
- 기본 Markdown 문법을 WYSIWYG로 편집할 수 있다.
- `# ` 입력으로 제목을 만들 수 있다.
- 한글 입력, undo/redo, 붙여넣기가 정상 작동한다.
- 문서 더블클릭으로 전체 Markdown 소스를 수정할 수 있다.
- 사용자 정의 단축키와 input rule을 등록할 수 있다.
- 이미지 resolver와 이미지 붙여넣기 이벤트를 제공한다.
- Shadow DOM 밖에서 테마와 크기를 설정할 수 있다.
- 한 명령으로 실행 가능한 독립 데모 앱이 제공된다.
- 데모 앱에서 현재 Markdown, 이벤트, 활성 확장 상태를 확인할 수 있다.
- 데모 앱만으로 이미지 붙여넣기와 resolver를 시험할 수 있다.

다음 조건을 모두 만족하면 SideNote 통합 MVP가 완료된 것으로 본다.

- 기존 Markdown 노트를 그대로 열 수 있다.
- WYSIWYG 편집 결과가 기존 IndexedDB 구조에 Markdown으로 저장된다.
- 기존 이미지가 표시되고 새 이미지를 붙여넣을 수 있다.
- 체크리스트가 편집되고 저장된다.
- 글꼴 크기와 다크 모드가 적용된다.
- Chrome과 Firefox 빌드가 성공한다.
- 기존 import/export 파일 형식과 호환된다.
- 이전 노트를 편집하는 과정에서 데이터 손실이 발생하지 않는다.

---

## 15. 첫 번째 구현 목표

전체 기능을 한 번에 구현하지 않고 다음 세로 조각을 첫 번째 목표로 삼는다.

```text
HTML에서 컴포넌트 로드
  → Markdown 문서 표시
  → WYSIWYG에서 텍스트와 제목 편집
  → value 및 input 이벤트로 Markdown 전달
  → 문서 더블클릭 전체 소스 수정
  → 사용자 정의 제목 input rule 등록
```

이 흐름이 독립 데모에서 안정적으로 작동한 뒤 SideNote의 노트 열기와 자동 저장에 먼저 연결한다. 이미지, 체크박스, 코드 블록 고급 UI는 그 다음 단계에서 이전한다.

첫 번째 구현 결과는 코드만으로 판단하지 않고 데모 앱에서 다음 순서로 직접 확인한다.

```text
샘플 Markdown 불러오기
  → 일반 텍스트 입력
  → # + Space로 제목 변환
  → 문서 더블클릭 후 전체 소스 수정
  → 사용자 정의 확장 활성화
  → Markdown 패널과 이벤트 로그 확인
```
