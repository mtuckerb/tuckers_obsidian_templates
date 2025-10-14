#!/usr/bin/env bash

# GitHub release script for Tuckers Tools plugin

# Get version from manifest.json
VERSION=$(grep -o '"version": "[^"]*"' manifest.json | cut -d'"' -f4)

if [ -z "$VERSION" ]; then
    echo "Error: Could not determine version from manifest.json"
    exit 1
fi

echo "Creating GitHub release for version $VERSION..."

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) is not installed."
    echo ""
    echo "To install GitHub CLI:"
    echo "  macOS: brew install gh"
    echo "  Ubuntu/Debian: sudo apt install gh"
    echo "  Fedora: sudo dnf install gh"
    echo "  Windows: winget install GitHub.cli"
    echo "  Or visit: https://cli.github.com/"
    echo ""
    echo "After installation, authenticate with:"
    echo "  gh auth login"
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Error: Not in a git repository"
    exit 1
fi

# Check if we're on the main branch (or master)
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$CURRENT_BRANCH" != "main" && "$CURRENT_BRANCH" != "master" ]]; then
    echo "Warning: You are not on the main or master branch. Current branch: $CURRENT_BRANCH"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborting release."
        exit 1
    fi
fi

# Check if working directory is clean
if [[ -n "$(git status --porcelain)" ]]; then
    echo "Warning: Working directory is not clean. Uncommitted changes:"
    git status --porcelain
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborting release."
        exit 1
    fi
fi

# Create release directory and files if they don't exist
if [ ! -d "releases/tuckers-tools-$VERSION" ]; then
    echo "Release directory doesn't exist. Creating release first..."
    ./release.sh
fi

# Check if release files exist
if [ ! -f "releases/tuckers-tools-$VERSION.zip" ] && [ ! -f "releases/tuckers-tools-$VERSION.tar.gz" ] && [ ! -d "releases/tuckers-tools-$VERSION" ]; then
    echo "Error: Release files not found for version $VERSION"
    exit 1
fi

# Create git tag if it doesn't exist
if ! git rev-parse "v$VERSION" >/dev/null 2>&1; then
    echo "Creating git tag v$VERSION..."
    git tag -a "v$VERSION" -m "Release version $VERSION"
    git push origin "v$VERSION"
else
    echo "Git tag v$VERSION already exists"
fi

# Check if release already exists
if gh release view "v$VERSION" >/dev/null 2>&1; then
    echo "GitHub release v$VERSION already exists"
    read -p "Do you want to update it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborting release."
        exit 1
    fi
    UPDATE_RELEASE=true
else
    UPDATE_RELEASE=false
fi

# Determine release file
if [ -f "releases/tuckers-tools-$VERSION.zip" ]; then
    RELEASE_FILE="releases/tuckers-tools-$VERSION.zip"
elif [ -f "releases/tuckers-tools-$VERSION.tar.gz" ]; then
    RELEASE_FILE="releases/tuckers-tools-$VERSION.tar.gz"
else
    RELEASE_FILE=""
fi

# Create release notes
RELEASE_NOTES_FILE="releases/release-notes-v$VERSION.md"
if [ ! -f "$RELEASE_NOTES_FILE" ]; then
    echo "Creating release notes..."
    cat > "$RELEASE_NOTES_FILE" << EOF
# Tuckers Tools v$VERSION

## What's Changed

- 

## New Features

- 

## Bug Fixes

- 

## Templates

This release includes embedded templates that can be used with the Tuckers Tools plugin.

## Installation

1. Download the \`tuckers-tools-$VERSION.zip\` or \`tuckers-tools-$VERSION.tar.gz\` file
2. Extract it to your Obsidian plugins directory
3. Enable the plugin in Obsidian settings
4. Configure the plugin settings according to the documentation

## Requirements

- Obsidian v0.15.0 or higher
- Templater plugin
- Meta Bind plugin
- Dataview plugin
EOF
fi

# Create or update GitHub release
if [ "$UPDATE_RELEASE" = true ]; then
    echo "Updating GitHub release v$VERSION..."
    if [ -n "$RELEASE_FILE" ]; then
        gh release edit "v$VERSION" \
            --title "v$VERSION" \
            --notes-file "$RELEASE_NOTES_FILE" \
            --draft=false \
            --prerelease=false
        gh release upload "v$VERSION" "$RELEASE_FILE" --clobber
    else
        gh release edit "v$VERSION" \
            --title "v$VERSION" \
            --notes-file "$RELEASE_NOTES_FILE" \
            --draft=false \
            --prerelease=false
        # Upload directory contents
        find "releases/tuckers-tools-$VERSION" -type f | while read file; do
            gh release upload "v$VERSION" "$file" --clobber
        done
    fi
else
    echo "Creating GitHub release v$VERSION..."
    if [ -n "$RELEASE_FILE" ]; then
        gh release create "v$VERSION" \
            "$RELEASE_FILE" \
            --title "v$VERSION" \
            --notes-file "$RELEASE_NOTES_FILE" \
            --draft=false \
            --prerelease=false
    else
        # Upload directory contents
        find "releases/tuckers-tools-$VERSION" -type f | head -1 | xargs -I {} gh release create "v$VERSION" \
            --title "v$VERSION" \
            --notes-file "$RELEASE_NOTES_FILE" \
            --draft=false \
            --prerelease=false \
            {}
        find "releases/tuckers-tools-$VERSION" -type f | tail -n +2 | while read file; do
            gh release upload "v$VERSION" "$file" --clobber
        done
    fi
fi

echo "GitHub release v$VERSION created successfully!"
echo "Release notes: $RELEASE_NOTES_FILE"