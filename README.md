# Tuckers Tools

An Obsidian plugin for academic organization and course management.

## Features

Tuckers Tools is designed to help students and educators organize their academic materials within Obsidian. The plugin provides a comprehensive system for managing courses, tracking vocabulary, monitoring assignments, and integrating with daily productivity tracking.

### Core Features

1. **Course Management**
    - Interactive course creation wizard with folder structure generation
    - Hierarchical course organization with consistent naming
    - Automatic course homepage and attachments folder creation

2. **Vocabulary Aggregation**
    - Extract vocabulary from course notes and materials
    - Generate comprehensive vocabulary indexes
    - Centralized vocabulary management and cross-referencing

3. **Due Dates Management**
    - Parse due dates from markdown tables
    - Generate due dates summaries with filtering options
    - Track assignment statuses and deadlines

4. **Daily Notes Integration**
    - Connect academic activities with daily tracking
    - Generate daily academic activity summaries
    - Monitor course progress and achievements

5. **Template System**
    - Pre-built templates for courses, modules, and chapters
    - Customizable template folder location
    - Versioned templates with update mechanism

## Requirements

This plugin requires the following Obsidian plugins:
- **Templater** - For template processing and dynamic content
- **Meta Bind** - For interactive form elements
- **Dataview** - For data querying and visualization

## Installation

### Option 1: BRAT (Beta Reviewer's Auto-update Tool) - RECOMMENDED

1. Install the BRAT plugin in Obsidian
2. Open the command palette and run "BRAT: Add a beta plugin for testing"
3. Enter the repository URL: `https://github.com/tucker/obsidian-tuckers-tools`
4. Enable the plugin in Obsidian settings
5. Configure the plugin settings (see Configuration section)

### Option 2: Manual Installation

1. Download the latest release from the [releases page](https://github.com/tucker/obsidian-tuckers-tools/releases)
2. Extract the ZIP file to your Obsidian plugins directory
3. Enable the plugin in Obsidian settings
4. Configure the plugin settings (see Configuration section)

### Option 3: From Obsidian Community Plugins

1. Open Obsidian Settings
2. Go to "Community Plugins" and disable "Safe Mode"
3. Search for "Tuckers Tools" and install
4. Enable the plugin and configure settings

## Configuration

The plugin can be configured through the Obsidian settings tab:

### Basic Settings
- **Base Directory**: Root directory for course content organization (default: "/")
- **Semester Start Date**: Start date for the current semester (YYYY-MM-DD format)
- **Semester End Date**: End date for the current semester (YYYY-MM-DD format)

### Institution Settings
- **School Name**: Name of your institution (default: "University")
- **School Abbreviation**: Abbreviation for your institution (default: "U")

### Template Settings
- **Template Folder**: Subfolder within your Templater template folder (default: "Tuckers Tools")
- **Use Enhanced Metadata**: Enable enhanced metadata fields for new notes

## Usage

After installation and configuration:

### Getting Started
1. Use the "Install/Update Tuckers Tools Templates" command to set up templates
2. Configure your settings in the plugin settings tab
3. Start creating courses using the course creation wizard

### Available Commands

#### Course Management
- **Create New Course**: Launch the interactive course creation wizard
- **Install/Update Templates**: Set up or update plugin templates

#### Academic Tools
- **Extract Course Vocabulary**: Generate vocabulary index for a specific course
- **Generate Due Dates Summary**: Create due dates overview for a course
- **Generate Daily Academic Summary**: Track daily academic activities

### Creating a Course

1. Use the "Create New Course" command from the command palette
2. Enter course details:
   - Course name (e.g., "PSI-101 - Intro to Psychology")
   - Academic term/semester
   - Year
3. The plugin will automatically:
   - Create organized folder structure
   - Generate course homepage note
   - Set up attachments folder

### Working with Vocabulary

1. Add vocabulary sections to your course notes using the format:
   ```
   ## Vocabulary
   - Term 1: Definition 1
   - Term 2: Definition 2
   ```

2. Use the "Extract Course Vocabulary" command to generate a comprehensive vocabulary index

### Managing Due Dates

1. Create due dates tables in your notes:
   ```
   ## Due Dates
   | Date | Assignment | Status |
   | ---- | ---------- | ------ |
   | 2025-02-15 | Research Paper | pending |
   | 2025-02-20 | Midterm Exam | pending |
   ```

2. Use the "Generate Due Dates Summary" command to create organized summaries

## Templates

Templates are installed in your Templater template folder under a "Tuckers Tools" subdirectory:

### Course Templates
- **Create Course Homepage.md**: Interactive course creation template
- **Course Index.md**: Course overview and navigation template

### Module Templates
- **Create Module.md**: Course module organization template

### Chapter Templates
- **Create Chapter.md**: Chapter note-taking template

### Assignment Templates
- **Create Assignment.md**: Assignment tracking template

### Daily Templates
- **Daily Note.md**: Academic activity tracking template

### Utility Templates
- **Vocabulary Entry.md**: Individual vocabulary term template
- **Due Date Entry.md**: Due date tracking template

## Advanced Usage

### Template Customization

Feel free to customize templates to suit your needs. The plugin will not overwrite your changes when updating templates.

### Course Organization Structure

```
Courses/
└── 2025/
    └── Fall/
        └── PSI-101 - Intro to Psychology/
            ├── PSI-101 - Intro to Psychology.md (homepage)
            ├── Attachments/
            │   └── [course materials]
            ├── Modules/
            │   └── [module notes]
            └── Chapters/
                └── [chapter notes]
```

### Integration with Other Plugins

Tuckers Tools works seamlessly with:
- **Templater**: For dynamic template processing
- **Meta Bind**: For interactive forms and inputs
- **Dataview**: For querying and displaying course data

## Backwards Compatibility

Tuckers Tools maintains full backwards compatibility with existing note structures while providing enhanced features for new content. The plugin uses additive metadata and graceful degradation to ensure all existing functionality continues to work.

## Troubleshooting

### Common Issues

1. **Templates not appearing**: Ensure Templater is installed and configured
2. **Course creation fails**: Check that the base directory is writable
3. **Vocabulary extraction not working**: Verify vocabulary sections follow the expected format

### Debug Information

Enable console logging to troubleshoot issues:
- Open Obsidian Developer Console (Ctrl+Shift+I)
- Look for "Tuckers Tools" log messages
- Report issues with relevant log information

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the plugin: `npm run build`
4. Test in development: `npm run dev`

### Release Process

The plugin uses automated releases through GitHub Actions:

1. Update the version in `manifest.json`
2. Commit and push changes to the main branch
3. GitHub Actions will automatically:
   - Build the plugin
   - Run tests
   - Create a new release
   - Update BRAT compatibility

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section above
- Review the user guide in your vault (after installation)

## Changelog

See the [releases page](https://github.com/tucker/obsidian-tuckers-tools/releases) for detailed changelog information.