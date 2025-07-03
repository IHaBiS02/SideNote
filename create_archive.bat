@echo off
setlocal

REM Define the name of the output archive
set "ARCHIVE_NAME=simple_note.zip"

REM Define the files and directories to include
set "SOURCE_FILES=."

REM Define the files and directories to exclude
set "EXCLUDE_FILES=@('.git*', '*.zip', 'create_archive.*', 'Error.txt', 'temp.txt', '*.aseprite', '*.png', '*.md', '*.txt')"

REM Use PowerShell to create the archive
powershell -NoProfile -ExecutionPolicy Bypass -Command "Compress-Archive -Path '%SOURCE_FILES%' -DestinationPath '%ARCHIVE_NAME%' -Force -Update"

echo Project archived as %ARCHIVE_NAME%
endlocal
