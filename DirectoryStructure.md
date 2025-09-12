# Tuckers Tools Plugin Directory Structure

```
tuckers-tools/
├── main.ts                 # Main plugin file
├── main.js                 # Compiled plugin file (generated)
├── main.test.ts            # Tests for main plugin file
├── settings.ts             # Plugin settings
├── settings.test.ts        # Tests for settings
├── templateManager.ts      # Template management system
├── templateManager.test.ts # Tests for template manager
├── courseWizard.ts         # Course creation wizard
├── courseWizard.test.ts    # Tests for course wizard
├── vocabulary.ts           # Vocabulary extraction system
├── vocabulary.test.ts      # Tests for vocabulary system
├── dueDates.ts            # Due dates parsing system
├── dueDates.test.ts       # Tests for due dates system
├── dailyNotes.ts          # Daily notes integration
├── dailyNotes.test.ts     # Tests for daily notes integration
├── compatibility.ts       # Backwards compatibility layer
├── compatibility.test.ts  # Tests for compatibility layer
├── utils.ts               # Utility functions
├── utils.test.ts          # Tests for utility functions
├── manifest.json          # Plugin manifest
├── versions.json          # Plugin versions
├── styles.css             # Plugin styles
├── package.json           # NPM package file
├── package-lock.json      # NPM lock file (generated)
├── tsconfig.json          # TypeScript configuration
├── esbuild.config.mjs     # Build configuration
├── jest.config.js         # Jest configuration
├── version-bump.mjs       # Version bump script
├── template-manifest.json # Template version manifest
├── build.sh               # Build script
├── dev.sh                 # Development script
├── test.sh                # Test script
├── release.sh             # Release script
├── README.md              # Project README
├── UserGuide.md           # User guide
├── DevelopmentGuide.md    # Development guide
├── ExampleTemplates.md    # Example templates
├── DevelopmentSummary.md  # Development summary
├── TODO.md                # Development TODO list
├── .gitignore             # Git ignore file
├── node_modules/          # NPM dependencies (generated)
│   └── ...
└── releases/              # Release builds (generated)
    └── ...
```

## Key Directories and Files

### Core Plugin Files
- `main.ts` - Entry point for the plugin
- `settings.ts` - Configuration management
- `templateManager.ts` - Template system management

### Feature Modules
- `courseWizard.ts` - Course creation functionality
- `vocabulary.ts` - Vocabulary extraction and management
- `dueDates.ts` - Assignment tracking
- `dailyNotes.ts` - Daily note integration
- `compatibility.ts` - Backwards compatibility

### Utility Files
- `utils.ts` - Common helper functions
- `styles.css` - Plugin styling

### Configuration Files
- `manifest.json` - Plugin metadata
- `versions.json` - Plugin version tracking
- `tsconfig.json` - TypeScript configuration
- `esbuild.config.mjs` - Build configuration
- `jest.config.js` - Test configuration

### Documentation
- `README.md` - Project overview
- `UserGuide.md` - User instructions
- `DevelopmentGuide.md` - Developer documentation
- `ExampleTemplates.md` - Template examples
- `DevelopmentSummary.md` - Development summary
- `TODO.md` - Development progress tracking

### Scripts
- `build.sh` - Build automation
- `dev.sh` - Development environment
- `test.sh` - Test automation
- `release.sh` - Release packaging
- `version-bump.mjs` - Version management