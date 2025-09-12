# Development Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Building the Plugin](#building-the-plugin)
5. [Testing](#testing)
6. [Contributing](#contributing)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Obsidian (for testing)

### Setup
1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server

## Project Structure

```
tuckers-tools/
├── main.ts              # Main plugin file
├── settings.ts          # Plugin settings
├── templateManager.ts   # Template management system
├── manifest.json        # Plugin manifest
├── package.json         # NPM package file
├── tsconfig.json        # TypeScript configuration
├── esbuild.config.mjs   # Build configuration
├── styles.css           # Plugin styles
├── README.md            # Project README
├── UserGuide.md         # User guide
├── ExampleTemplates.md  # Example templates
├── TODO.md              # Development TODO list
└── versions.json        # Plugin versions
```

## Development Workflow

1. Create a feature branch for your changes
2. Make your modifications
3. Test your changes in Obsidian
4. Update the TODO.md file to reflect your progress
5. Submit a pull request

## Building the Plugin

### Development Build
```bash
npm run dev
```

This will compile the TypeScript files and watch for changes.

### Production Build
```bash
npm run build
```

This will create a production-ready build of the plugin.

## Testing

### Manual Testing
1. Use the development build of the plugin in Obsidian
2. Test all features
3. Verify backwards compatibility
4. Check template functionality

### Automated Testing
(To be implemented)

## Contributing

### Reporting Issues
1. Check existing issues before creating a new one
2. Provide detailed information about the issue
3. Include steps to reproduce
4. Mention your Obsidian version and plugin version

### Submitting Pull Requests
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

### Code Style
- Follow TypeScript best practices
- Use clear, descriptive variable names
- Comment complex logic
- Maintain backwards compatibility