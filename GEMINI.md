This program is about making a chrome browser extension of notes extension.
The main purpose of this extension is using side pannel of browser as simple notes.

For every changes, Change version number on the manifest.json, based on the amount of edit you write.

When committing changes, follow these steps:
1. Use `git diff --staged` to review the changes.
2. Use `git log -n 3` to review recent commit messages.
3. Propose a commit message.
4. If the user approves, write the message to a temporary file named `commit_message.txt`.
5. Use `git commit -F commit_message.txt` to commit the changes.
6. Use `del commit_message.txt` to remove the temporary file.