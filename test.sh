#!/nix/store/7xqn2kis5gaa01r6p95zw700k4lw0lxp-bash-interactive-5.3p3/bin/bash

# Test script for Tuckers Tools plugin

echo "Running tests for Tuckers Tools plugin..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Run tests
echo "Running unit tests..."
npm test

echo "Tests completed!"