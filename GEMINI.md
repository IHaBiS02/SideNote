This program is about making a chrome browser extension of notes extension.  
The main purpose of this extension is using side pannel of browser as simple notes.  

Here is the list of files and folders you need to work :  

1. manifest.json : json file contains manifest information  
2. sidepanel.html : html file which used on the sidepanel on the browser  
3. sidepanel.js : js file which have codes need to run browser extension  
4. sidepanel.css : css file which used to set design of the extension  
5. dark_mode.css : css file which has css values for dark mode  
6. background.js : js file used for opening extensions  
7. LIBRARY_LICENSES.md : markdown file which has all license inforations of library used in this project  
8. images/ : folder which contain images for icon and browser extension  
9. vendor/ : folder which contain all external library used in this project  

For every changes, Change version number on the manifest.json, based on the amount of edit you write.  

After all changes, read STRUCTURE.md file and if there are any changes which makes difference with the information on STRUCTURE.md, then write changes in STRUCTURE.md and update the documents.

When committing changes, follow these steps:  

1. Use `git diff` to review the changes.  
2. Use `git log -n 5` to review recent commit messages.  
3. Propose a commit message.  
4. Write the message to a temporary file named `commit_message.txt`.  
5. Use `git commit -F commit_message.txt` to commit the changes.  
6. Use `del commit_message.txt` to remove the temporary file.  
