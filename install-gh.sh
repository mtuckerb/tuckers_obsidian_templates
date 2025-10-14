#!/usr/bin/env bash

# Install GitHub CLI based on the operating system

echo "Installing GitHub CLI..."

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v apt &> /dev/null; then
        # Ubuntu/Debian
        sudo apt update
        sudo apt install gh
    elif command -v dnf &> /dev/null; then
        # Fedora
        sudo dnf install gh
    elif command -v yum &> /dev/null; then
        # CentOS/RHEL
        sudo yum install gh
    else
        echo "Unsupported Linux distribution. Please install GitHub CLI manually."
        echo "Visit: https://cli.github.com/"
        exit 1
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    if command -v brew &> /dev/null; then
        brew install gh
    else
        echo "Homebrew not found. Please install Homebrew first or install GitHub CLI manually."
        echo "Visit: https://cli.github.com/"
        exit 1
    fi
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    if command -v winget &> /dev/null; then
        winget install GitHub.cli
    else
        echo "winget not found. Please install GitHub CLI manually."
        echo "Visit: https://cli.github.com/"
        exit 1
    fi
else
    echo "Unsupported operating system. Please install GitHub CLI manually."
    echo "Visit: https://cli.github.com/"
    exit 1
fi

echo "GitHub CLI installed successfully!"
echo "Please run 'gh auth login' to authenticate."