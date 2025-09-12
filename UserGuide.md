# Tuckers Tools User Guide

## Table of Contents
1. [Installation](#installation)
2. [Initial Setup](#initial-setup)
3. [Template System](#template-system)
4. [Course Management](#course-management)
5. [Vocabulary System](#vocabulary-system)
6. [Due Dates Management](#due-dates-management)
7. [Daily Notes Integration](#daily-notes-integration)
8. [Backwards Compatibility](#backwards-compatibility)

## Installation

### Prerequisites
Before installing Tuckers Tools, ensure you have the following plugins installed:
- Templater
- Meta Bind
- Dataview

### Installation Steps
1. Open Obsidian Settings
2. Navigate to "Community Plugins"
3. Disable "Safe Mode" if enabled
4. Click "Browse" and search for "Tuckers Tools"
5. Click "Install" and then "Enable"

## Initial Setup

### Configuring Plugin Settings
After installation, configure the plugin settings:
1. Open Obsidian Settings
2. Find "Tuckers Tools" in the plugin settings list
3. Configure the following options:
   - **Base Directory**: Root directory for your course content (default: "/")
   - **Semester Start Date**: Start date for current semester
   - **Semester End Date**: End date for current semester
   - **School Name**: Your institution's name
   - **School Abbreviation**: Short form of your institution's name
   - **Template Folder**: Subfolder for Tuckers Tools templates (default: "Tuckers Tools")
   - **Use Enhanced Metadata**: Enable enhanced metadata fields for new notes

### Installing Templates
1. Open the Command Palette (Ctrl/Cmd + P)
2. Search for "Tuckers Tools: Install/Update Tuckers Tools Templates"
3. Run the command
4. Templates will be installed in your Templater template folder under the specified subdirectory

## Template System

### Template Organization
Templates are organized into the following categories:
- **Courses**: For creating and organizing courses
- **Modules**: For course modules
- **Chapters**: For chapter notes
- **Assignments**: For assignments
- **Daily**: For daily notes
- **Utilities**: Helper templates

### Using Templates
1. Create a new note or open an existing note
2. Open the Command Palette (Ctrl/Cmd + P)
3. Search for "Templater: Insert Template"
4. Navigate to the Tuckers Tools folder
5. Select the appropriate template

### Customizing Templates
You can customize templates to suit your needs:
1. Navigate to your Templater template folder
2. Find the Tuckers Tools subfolder
3. Open any template file
4. Make your desired changes
5. Save the file

The plugin will not overwrite your customizations when updating templates.

## Course Management

### Creating a New Course
1. Use the "Courses/Create Course Homepage" template
2. Fill in the course details when prompted
3. The template will automatically:
   - Create the appropriate folder structure
   - Generate an Attachments folder
   - Set up basic course information

### Creating Modules
1. Use the "Modules/Create Module" template
2. Select your course
3. Enter module/week information
4. The template will:
   - Create module folders
   - Set up due dates table
   - Include vocabulary section

### Creating Chapters
1. Use the "Chapters/Create Chapter" template
2. Select your course and text
3. Enter chapter number
4. The template will:
   - Create chapter folders
   - Set up note structure
   - Include vocabulary section

## Vocabulary System

### Adding Vocabulary
1. In any note, use the "Utilities/Vocabulary Entry" template
2. Fill in the term details
3. Or manually add vocabulary in the "Vocabulary" section using the format:
   ```
   ## Term
   **Definition**: Brief definition
   **Context**: Usage context
   ```

### Viewing Vocabulary
Vocabulary is automatically aggregated in course homepages using DataviewJS.

## Due Dates Management

### Adding Assignments
1. In module notes, add assignments to the "Assignments" table
2. Use the format: `| YYYY-MM-DD | Assignment Name | Status |`

### Viewing Due Dates
Due dates are automatically aggregated in course homepages with color coding:
- Red: Due within 1 week
- Yellow: Due within 2 weeks
- No color: Due later

## Daily Notes Integration

### Daily Note Template
Use the "Daily/Daily Note" template for comprehensive daily tracking:
- Course work tracking
- Task completion
- Vocabulary review
- Assignment due dates
- Reflection section

## Backwards Compatibility

Tuckers Tools maintains full backwards compatibility with existing note structures:
- Existing notes will continue to work without changes
- Enhanced features are only added to new notes when enabled
- All existing Templater, Meta Bind, and Dataview functionality is preserved
- Templates use additive metadata that doesn't interfere with existing fields