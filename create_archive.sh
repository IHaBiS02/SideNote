#!/bin/bash

# Define the name of the output archive
ARCHIVE_NAME="simple_note.zip"

# Use tar to create the archive, excluding unnecessary files
tar -czf "$ARCHIVE_NAME" \
  --exclude=".git" \
  --exclude="*.zip" \
  --exclude="create_archive.sh" \
  --exclude="Error.txt" \
  --exclude="temp.txt" \
  --exclude="*.aseprite" \
  --exclude="*.png" \
  --exclude="*.md" \
  --exclude="*.txt" \
  .

echo "Project archived as $ARCHIVE_NAME"

