#!/nix/store/7xqn2kis5gaa01r6p95zw700k4lw0lxp-bash-interactive-5.3p3/bin/bash

# Build script for Tuckers Tools plugin

echo "Building Tuckers Tools plugin..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Run TypeScript compiler
echo "Compiling TypeScript files..."
npx tsc --noEmit --skipLibCheck

# Run esbuild to create the main.js file
echo "Bundling plugin..."
node esbuild.config.mjs

echo "Build complete!"