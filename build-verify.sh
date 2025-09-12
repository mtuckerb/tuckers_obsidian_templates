#!/nix/store/7xqn2kis5gaa01r6p95zw700k4lw0lxp-bash-interactive-5.3p3/bin/bash

# Simple build verification script

echo "Verifying Tuckers Tools plugin build..."

# Check if main.js exists
if [ ! -f "main.js" ]; then
  echo "✗ main.js not found"
  exit 1
fi

# Check if main.js has content
if [ ! -s "main.js" ]; then
  echo "✗ main.js is empty"
  exit 1
fi

# Check if manifest.json exists
if [ ! -f "manifest.json" ]; then
  echo "✗ manifest.json not found"
  exit 1
fi

# Check if styles.css exists
if [ ! -f "styles.css" ]; then
  echo "✗ styles.css not found"
  exit 1
fi

echo "✓ All required build files present"
echo "✓ Build verification successful"

echo ""
echo "Build Summary:"
echo "- main.js: $(ls -lh main.js | awk '{print $5}')"
echo "- manifest.json: $(ls -lh manifest.json | awk '{print $5}')"
echo "- styles.css: $(ls -lh styles.css | awk '{print $5}')"