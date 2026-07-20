# SideNote GitHub Release

`package.json`에 기록된 버전으로 Git 태그를 만들고 GitHub Actions 릴리스 워크플로에 전달하는 최소 절차입니다.

## 태그 생성 및 전송

Windows PowerShell에서 저장소 루트 디렉터리로 이동한 뒤 실행합니다.

```powershell
$version = (Get-Content -LiteralPath package.json | ConvertFrom-Json).version
$manifestVersion = (Get-Content -LiteralPath manifest.json | ConvertFrom-Json).version

if ($version -ne $manifestVersion) {
    throw "package.json과 manifest.json의 버전이 다릅니다."
}

$tag = "v$version"

git fetch origin --tags
git tag -a $tag -m "Release $tag"
git push origin $tag
```

태그가 푸시되면 [`.github/workflows/release.yml`](.github/workflows/release.yml)이 자동으로 실행되어 다음 작업을 수행합니다.

1. 의존성 설치
2. 전체 테스트 실행
3. WYSIWYG 에디터와 Chrome/Firefox 확장프로그램 빌드
4. Firefox AMO 검증용 원본 소스 ZIP 생성
5. GitHub Release 생성 및 ZIP 파일 3개 첨부

로컬에서 같은 산출물을 만들려면 저장소 루트에서 다음 명령을 실행합니다.

```powershell
npm.cmd ci
npm.cmd run test:run
npm.cmd run build
```

`build/`에 다음 파일이 생성됩니다.

```text
chrome-<version_with_underscores>.zip
firefox-<version_with_underscores>.zip
sidenote-<version>-source.zip
```

Firefox AMO에는 `firefox-*.zip`과 `sidenote-*-source.zip`을 제출합니다.

진행 상태는 다음 페이지에서 확인합니다.

```text
https://github.com/IHaBiS02/SideNote/actions/workflows/release.yml
```

완성된 릴리스는 다음 형식의 주소에서 확인합니다.

```text
https://github.com/IHaBiS02/SideNote/releases/tag/v<version>
```

예를 들어 버전이 `4.2.14`이면 `v4.2.14` 태그를 사용합니다.

> 같은 버전 태그가 이미 원격에 있으면 새 태그를 만들지 않습니다. 먼저 버전을 올린 뒤 다시 실행합니다.
