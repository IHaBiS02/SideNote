export const sampleMarkdown = `# WYSIWYG Markdown

일반 텍스트처럼 입력하면서 **굵게**, *기울임*, \`인라인 코드\`를 사용할 수 있습니다.

## 빠른 입력

- 줄 시작에서 \`# \`을 입력하면 제목으로 바뀝니다.
- 줄 시작에서 \`- \`을 입력하면 목록으로 바뀝니다.
- 문서를 더블클릭하면 전체 Markdown 소스를 plain text로 편집할 수 있습니다.

> 에디터는 Markdown 문자열을 외부 API로 전달합니다.

\`\`\`js
const editor = document.querySelector('wysiwyg-markdown');
editor.value = '# Hello';
\`\`\`
`;
