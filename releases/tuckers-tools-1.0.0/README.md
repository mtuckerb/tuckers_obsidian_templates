# Tuckers Tools

An Obsidian plugin for academic organization and course management.

## Features

Tuckers Tools is designed to help students and educators organize their academic materials within Obsidian. The plugin provides a comprehensive system for managing courses, tracking vocabulary, monitoring assignments, and integrating with daily productivity tracking.

### Core Features

1. **Course Management**
   - Create and organize courses with hierarchical structure
   - Generate modules and chapters with consistent naming
   - Automatic folder structure creation

2. **Vocabulary Aggregation**
   - Extract and display vocabulary from course materials
   - Centralized vocabulary views
   - Cross-reference capabilities

3. **Due Dates Management**
   - Track assignment due dates
   - Color-coded date indicators
   - Filtering and alert system

4. **Daily Notes Integration**
   - Connect academic activities with daily tracking
   - Health and wellness monitoring
   - Task management features

5. **Template System**
   - Pre-built templates for courses, modules, and chapters
   - Customizable template folder location
   - Versioned templates with update mechanism

## Requirements

This plugin requires the following Obsidian plugins:
- Templater
- Meta Bind
- Dataview

## Installation

1. Install the required plugins: Templater, Meta Bind, and Dataview
2. Install Tuckers Tools from the Obsidian plugin marketplace
3. Configure the plugin settings
4. Install templates using the "Install/Update Tuckers Tools Templates" command

## Configuration

The plugin can be configured through the Obsidian settings tab:
- Base directory for course content
- Semester start and end dates
- School name and abbreviation
- Naming conventions
- Tagging preferences

## Usage

After installation and configuration:
1. Use the template installation command to set up templates
2. Create courses using the course creation wizard
3. Generate modules and chapters as needed
4. Track vocabulary and due dates within your notes
5. Connect with daily notes for comprehensive tracking

## Templates

Templates are installed in your Templater template folder under a "Tuckers Tools" subdirectory:
- Course templates for creating new courses
- Module templates for organizing course content
- Chapter templates for detailed note-taking
- Daily note integration templates

## Backwards Compatibility

Tuckers Tools maintains full backwards compatibility with existing note structures while providing enhanced features for new content. The plugin uses additive metadata and graceful degradation to ensure all existing functionality continues to work.

## Development

This plugin is built with TypeScript and uses the following tools:
- esbuild for bundling
- Jest for testing
- ESLint and Prettier for code quality

### Scripts

- `npm run dev` - Start development build
- `npm run build` - Create production build
- `npm test` - Run tests
- `npm run lint` - Check code style
- `npm run format` - Format code

### Directory Structure

The plugin follows a modular architecture with separate files for each feature:
- Core plugin logic in `main.ts`
- Settings management in `settings.ts`
- Template system in `templateManager.ts`
- Feature modules for courses, vocabulary, due dates, and daily notes
- Comprehensive test suite
- Documentation and examples

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT License