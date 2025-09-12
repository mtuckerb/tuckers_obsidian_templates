#!/nix/store/7xqn2kis5gaa01r6p95zw700k4lw0lxp-bash-interactive-5.3p3/bin/bash

# Clean script for Tuckers Tools plugin

echo "Cleaning Tuckers Tools plugin..."

# Remove generated files
rm -rf node_modules
rm -rf releases
rm main.js
rm main.js.map

echo "Clean complete!"