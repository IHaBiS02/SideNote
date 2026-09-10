# SideNote 노트 체험 사이트

SideNote의 실제 Lit/ProseMirror 에디터를 사용합니다. WYSIWYG 화면에서 직접
입력하고, 더블클릭하면 전체 Markdown을 메모장처럼 수정할 수 있습니다.
Edit/WYSIWYG 버튼, Ctrl/Cmd+Enter 또는 소스 모드의 Shift+Enter/Escape로 돌아옵니다.

수정한 내용과 붙여넣은 이미지는 노트 전환 중 유지되지만 새로고침하면
게시된 원본으로 초기화됩니다. 핀 변경도 동일하게 초기화됩니다.
디스크·다운로드 버튼은 체험 중인 수정본이 아닌 게시된 원본 .snote를 받습니다.
확장프로그램 저장소나 서버에 수정 사항을 저장하지 않습니다.

체크박스·제목·목록·코드 언어 수정·복사는 SideNote 에디터의 실제 기능입니다.
[한국어 기능 문서](WYSIWYG_INPUT_BEHAVIORS.ko.md)를 참고하세요.

## 게시 방법

SideNote에서 .snote로 내보낸 뒤 notes 폴더에 넣고 notes/index.json에 추가합니다.

```json
{ "id": "my-note", "title": "내 노트", "file": "notes/my-note.snote", "pinned": false }
```

id는 영문 소문자·숫자·하이픈을 사용하며 중복될 수 없습니다.
파일명은 영문·숫자·하이픈·밑줄을 사용합니다. 고정 노트가 먼저 나오고
각 그룹 안에서는 JSON 배열 순서를 유지합니다. 목록 제목은 JSON에서,
본문 제목은 .snote에서 읽습니다. 수정 시 .snote를 교체하면 됩니다.
게시 파일과 첨부 이미지는 모두 공개됩니다.

## 원본 코드 자동 동기화

이 gh-pages 작업 폴더에서 다음 명령을 실행합니다.

```powershell
npm run sync:sidenote -- C:\Users\justp\Documents\SideNote
npm run test:run
npm run build
```

경로는 의존성이 설치된 SideNote 확장프로그램 원본 폴더입니다.
에디터를 빌드하고 CSS·테마·구문 강조·라이브러리·라이선스·영문/한국어
기능 문서를 가져옵니다. 원본 버전과 커밋은 vendor/sidenote-source.json에 기록합니다.
게시용 .snote는 건드리지 않습니다. 원본 구조가 달라지면 동기화가 오류로
멈출 수 있으며, 확장 API와 연결된 새 기능은 사이트용 연결 작업이 필요할 수 있습니다.

명령으로 갱신하는 방식이며 main 변경마다 자동 push하는 방식은 아닙니다.
검토와 테스트 후 생성 파일을 커밋·push하세요.

## 실행과 배포

Node.js 24에서 npm ci로 테스트 의존성을 설치합니다.
npm run dev 후 http://127.0.0.1:4173 을 열면 됩니다.
npm run build는 생성물 dist 폴더를 교체합니다.
GitHub Pages 설정은 Deploy from a branch / gh-pages / 루트입니다.

목록은 원본 CSS와 아이콘·행 여백·51px 헤더·41px 하단 도구 모음을 재사용합니다.
톱니바퀴로 테마 설정을 열고 핀은 클릭해서 바꿉니다.
추가·가져오기·삭제는 비활성입니다. 브라우저 자체의 패널 제목 표시줄과
둥근 프레임은 포함되지 않습니다. 모바일에서는 목록이 본문 위에 배치됩니다.
외부 URL 이미지는 인터넷이 필요합니다.

예시 파일을 직접 바꾼 뒤 npm run samples를 실행하면 예시가 덮어써집니다.
구조는 [README.md](README.md), 라이선스는 [LIBRARY_LICENSES.md](LIBRARY_LICENSES.md)에 있습니다.
