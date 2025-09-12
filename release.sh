#!/nix/store/7xqn2kis5gaa01r6p95zw700k4lw0lxp-bash-interactive-5.3p3/bin/bash

# Release script for Tuckers Tools plugin

echo "Creating release for Tuckers Tools plugin..."

# Get version from manifest.json
VERSION=$(grep -o '"version": "[^"]*"' manifest.json | cut -d'"' -f4)

echo "Current version: $VERSION"

# Create release directory
RELEASE_DIR="releases/tuckers-tools-$VERSION"
mkdir -p "$RELEASE_DIR"

# Copy necessary files
cp main.js "$RELEASE_DIR/"
cp manifest.json "$RELEASE_DIR/"
cp styles.css "$RELEASE_DIR/"
cp README.md "$RELEASE_DIR/"
cp -r Templates "$RELEASE_DIR/" 2>/dev/null || echo "No Templates directory to copy"

# Create zip file
cd releases
zip -r "tuckers-tools-$VERSION.zip" "tuckers-tools-$VERSION"

echo "Release created: releases/tuckers-tools-$VERSION.zip"