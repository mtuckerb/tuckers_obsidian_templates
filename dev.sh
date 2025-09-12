#!/nix/store/7xqn2kis5gaa01r6p95zw700k4lw0lxp-bash-interactive-5.3p3/bin/bash

# Development script for Tuckers Tools plugin

echo "Starting development environment for Tuckers Tools plugin..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start development build
echo "Starting development build..."
node esbuild.config.mjs

echo "Development build started!"
echo "Watching for changes..."