#!/usr/bin/env bash

# All-in-one script for Tuckers Tools plugin

echo "Tuckers Tools Plugin Management Script"
echo "====================================="

case "$1" in
  install)
    echo "Installing dependencies..."
    ./install.sh
    ;;
  build)
    echo "Building plugin..."
    ./build.sh
    ;;
  dev)
    echo "Starting development environment..."
    ./dev.sh
    ;;
  test)
    echo "Running tests..."
    ./test.sh
    ;;
  clean)
    echo "Cleaning build artifacts..."
    ./clean.sh
    ;;
  release)
    echo "Creating release..."
    ./release.sh
    ;;
  github-release)
    echo "Creating GitHub release..."
    ./github-release.sh
    ;;
  install-gh)
    echo "Installing GitHub CLI..."
    ./install-gh.sh
    ;;
  *)
    echo "Usage: $0 {install|build|dev|test|clean|release|github-release|install-gh}"
    echo ""
    echo "Commands:"
    echo "  install        - Install dependencies"
    echo "  build          - Build the plugin"
    echo "  dev            - Start development environment"
    echo "  test           - Run tests"
    echo "  clean          - Clean build artifacts"
    echo "  release        - Create a release"
    echo "  github-release - Create a GitHub release"
    echo "  install-gh     - Install GitHub CLI"
    ;;
esac