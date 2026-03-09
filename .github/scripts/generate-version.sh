#!/usr/bin/env bash
set -euo pipefail

# Generate a CalVer tag (YYYY.MM.DD[.N]) based on existing git tags.
# Outputs: version=<tag> to $GITHUB_OUTPUT

TODAY=$(date -u +"%Y.%m.%d")

EXISTING=$(git tag --list "${TODAY}.*" | sort -t. -k4 -n | tail -1)

if [ -z "$EXISTING" ]; then
  if git tag --list "$TODAY" | grep -q .; then
    VERSION="${TODAY}.1"
  else
    VERSION="$TODAY"
  fi
else
  COUNTER=$(echo "$EXISTING" | awk -F. '{print $4}')
  VERSION="${TODAY}.$((COUNTER + 1))"
fi

echo "version=$VERSION" >> "$GITHUB_OUTPUT"
echo "Version: $VERSION"
