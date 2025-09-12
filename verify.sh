#!/nix/store/7xqn2kis5gaa01r6p95zw700k4lw0lxp-bash-interactive-5.3p3/bin/bash

# Verification script for Tuckers Tools plugin structure

echo "Verifying Tuckers Tools plugin structure..."

# Check for required files
REQUIRED_FILES=(
  "main.ts"
  "settings.ts"
  "templateManager.ts"
  "courseWizard.ts"
  "vocabulary.ts"
  "dueDates.ts"
  "dailyNotes.ts"
  "compatibility.ts"
  "utils.ts"
  "manifest.json"
  "versions.json"
  "styles.css"
  "package.json"
  "tsconfig.json"
  "esbuild.config.mjs"
  "jest.config.js"
  "README.md"
  "TODO.md"
)

MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    MISSING_FILES+=("$file")
  fi
done

if [ ${#MISSING_FILES[@]} -eq 0 ]; then
  echo "✓ All required files present"
else
  echo "✗ Missing files:"
  for file in "${MISSING_FILES[@]}"; do
    echo "  - $file"
  done
  exit 1
fi

# Check for required directories
REQUIRED_DIRS=(
  "releases"
)

for dir in "${REQUIRED_DIRS[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "Creating missing directory: $dir"
    mkdir -p "$dir"
  fi
done

echo "✓ Directory structure verified"

# Check for required scripts
REQUIRED_SCRIPTS=(
  "build.sh"
  "dev.sh"
  "test.sh"
  "install.sh"
  "clean.sh"
  "release.sh"
  "tuckers-tools.sh"
)

for script in "${REQUIRED_SCRIPTS[@]}"; do
  if [ ! -f "$script" ]; then
    echo "✗ Missing script: $script"
    exit 1
  fi
  
  if [ ! -x "$script" ]; then
    echo "✗ Script not executable: $script"
    exit 1
  fi
done

echo "✓ All scripts present and executable"

echo "Plugin structure verification complete!"