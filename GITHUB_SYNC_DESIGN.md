# SideNote GitHub Sync 설계 메모

이 문서는 SideNote의 현재 저장 구조와 GitHub 기반 동기화 방향을 간단히 정리한다.

## 현재 저장 구조

SideNote의 실제 앱 데이터는 브라우저 IndexedDB에 저장된다.

```text
SimpleNotesDB
  notes
  images
```

`notes` store에는 노트 객체가 저장된다. Markdown 본문은 실제 `.md` 파일이 아니라 `content` 문자열로 저장된다.

```js
{
  id: "note-id",
  title: "Note title",
  content: "# Markdown\n\n![Image](images/image-id.png)",
  settings: {},
  metadata: {
    createdAt: 1710000000000,
    lastModified: 1710000100000,
    deletedAt: undefined
  },
  isPinned: false
}
```

`images` store에는 이미지 Blob이 저장된다.

```js
{
  id: "image-id",
  blob: Blob,
  deletedAt: null
}
```

노트 본문은 이미지 파일 자체를 포함하지 않고, `imageId`를 가진 Markdown 링크만 가진다.

```md
![Image](images/image-id.png)
```

따라서 서로 다른 노트가 같은 `imageId`를 참조하면 같은 이미지를 공유할 수 있다.

## Export 정책

### `.snote`

단일 노트 export는 독립성이 중요하므로 기존처럼 note 안에 필요한 이미지를 포함한다.

```text
metadata.json
note.md
images/
  image-id.png
```

### `.snotes`

전체 export도 기존 방식처럼 note별 폴더 안에 이미지를 포함한다. 같은 이미지가 여러 노트에서 쓰이면 zip 안에 중복 저장될 수 있다.

```text
note-id-1/
  metadata.json
  note.md
  images/
    shared-image-id.png

note-id-2/
  metadata.json
  note.md
  images/
    shared-image-id.png
```

이 방식은 용량 면에서는 비효율이 있을 수 있지만, 각 note 폴더가 독립적이라 백업/복원 포맷으로 단순하고 안전하다.

## GitHub Sync 정책

GitHub sync는 `.snotes` export와 다르게 shared image store를 사용한다. 같은 이미지는 repository에 한 번만 저장한다.

권장 repository 구조:

```text
global-settings.json
notes/
  note-id-1/
    note-id-1.md
    note-id-1.json
  note-id-2/
    note-id-2.md
    note-id-2.json
images/
  image-id-1.png
  image-id-2.png
tombstones/
  notes/
  images/
```

각 note 폴더의 `.md` 파일은 Markdown 본문만 담는다.

```text
notes/note-id-1/note-id-1.md
```

각 note 폴더의 `.json` 파일은 제목, 설정, timestamp, pin 상태 등 metadata를 담는다.

```text
notes/note-id-1/note-id-1.json
```

루트의 `images/` 폴더는 모든 노트가 공유하는 이미지 저장소다.

```text
images/image-id.png
```

노트 본문의 이미지 참조는 앱 내부 표현과 동일하게 유지한다.

```md
![Image](images/image-id.png)
```

sync importer/exporter가 이 참조를 shared `images/` 폴더와 매핑한다.

## isomorphic-git + LightningFS 방향

`isomorphic-git`과 `LightningFS`를 사용하면 브라우저 안에서 Git working tree를 운용할 수 있다.

권장 구조는 다음과 같다.

```text
IndexedDB
  앱의 실제 source of truth

LightningFS
  GitHub sync용 working tree/cache
```

즉, 앱은 평소처럼 IndexedDB를 읽고 쓴다. sync 시점에만 IndexedDB 데이터를 LightningFS 파일 트리로 materialize한다.

```text
IndexedDB notes/images
  -> LightningFS working tree 생성/갱신
  -> git add/commit/fetch/merge/push
  -> remote 변경사항을 다시 IndexedDB에 반영
```

이렇게 하면 현재 앱 구조를 크게 흔들지 않으면서 GitHub sync를 추가할 수 있다.

## 충돌 처리

초기 구현에서는 복잡한 merge UI보다 conflict copy 방식이 안전하다.

- 서로 다른 노트 수정: 자동 병합
- 같은 노트 한쪽만 수정: 자동 반영
- 같은 노트 양쪽 수정: 자동 merge 시도
- 자동 merge 실패: conflict copy 생성

예시:

```text
My Note
My Note (Conflict from Firefox)
```

사용자는 나중에 두 노트를 보고 직접 정리할 수 있다.

## 삭제 처리

이미지는 shared store를 쓰기 때문에 삭제 정책이 중요하다.

이미지를 삭제하기 전에는 모든 note content에서 해당 `imageId` 참조를 검사해야 한다.

- 참조 중인 노트가 있으면 삭제 금지 또는 경고
- 참조가 없으면 recycle bin으로 이동 가능
- sync에서는 삭제 tombstone을 남겨 다른 브라우저에도 삭제를 전파

현재 `preventUsedImageDeletion` 설정과 잘 맞는 방향이다.

## 권장 구현 순서

1. GitHub sync용 파일 트리 변환 함수 작성
   - IndexedDB note/image/globalSettings -> sync tree
   - sync tree -> IndexedDB note/image/globalSettings
2. shared `images/` 구조로 image deduplication 적용
3. LightningFS에 working tree 생성
4. isomorphic-git으로 commit 생성
5. GitHub fetch/pull/push 연결
6. 충돌 시 conflict copy 생성
7. 안정화 후 자동 sync 또는 주기 sync 추가

## 최종 방향

정리하면 export와 sync는 목적이 다르므로 구조를 분리한다.

```text
.snote
  단일 노트 독립 export
  note 내부 images 포함

.snotes
  전체 백업 export
  note별 images 중복 허용

GitHub sync
  shared images store
  global-settings.json
  notes/{noteId}/{noteId}.md
  notes/{noteId}/{noteId}.json
  images/{imageId}.png
```

이 방식이 단일 노트 이동성, 전체 백업 단순성, GitHub sync 효율을 모두 균형 있게 만족한다.
