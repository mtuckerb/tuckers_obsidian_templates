import { App } from 'obsidian';
import { TuckersToolsSettings } from './settings';

interface TemplateManifest {
  version: string;
  templates: Record<string, string>;
  plugin_version: string;
  release_notes: string;
}

export class TemplateManager {
  app: App;
  settings: TuckersToolsSettings;
  manifest: TemplateManifest;

  constructor(app: App, settings: TuckersToolsSettings) {
    this.app = app;
    this.settings = settings;
    this.manifest = {
      version: "1.0.0",
      templates: {
        "Courses/Create Course Homepage.md": "1.0.0",
        "Courses/Course Index.md": "1.0.0",
        "Modules/Create Module.md": "1.0.0",
        "Chapters/Create Chapter.md": "1.0.0",
        "Assignments/Create Assignment.md": "1.0.0",
        "Daily/Daily Note.md": "1.0.0",
        "Utilities/Vocabulary Entry.md": "1.0.0",
        "Utilities/Due Date Entry.md": "1.0.0"
      },
      plugin_version: "1.0.0",
      release_notes: "Initial release of Tuckers Tools templates"
    };
  }

  async installTemplates() {
    // Get Templater plugin settings to find template folder
    const templaterPlugin = (this.app as any).plugins.plugins['templater-obsidian'];
    if (!templaterPlugin) {
      console.error('Templater plugin not found');
      return;
    }

    const templaterSettings = templaterPlugin.settings;
    const templateFolderPath = templaterSettings['template_folder'];

    if (!templateFolderPath) {
      console.error('Template folder not configured in Templater settings');
      return;
    }

    const fullTemplatePath = `${templateFolderPath}/${this.settings.templateFolder}`;
    
    // Create the main template folder if it doesn't exist
    try {
      await this.app.vault.createFolder(fullTemplatePath);
    } catch (e) {
      // Folder might already exist, which is fine
    }

    // Create subdirectories
    const subdirs = ['Courses', 'Modules', 'Chapters', 'Assignments', 'Daily', 'Utilities'];
    for (const subdir of subdirs) {
      try {
        await this.app.vault.createFolder(`${fullTemplatePath}/${subdir}`);
      } catch (e) {
        // Folder might already exist, which is fine
      }
    }

    // Install templates
    await this.installCourseTemplates(fullTemplatePath);
    await this.installModuleTemplates(fullTemplatePath);
    await this.installChapterTemplates(fullTemplatePath);
    await this.installAssignmentTemplates(fullTemplatePath);
    await this.installDailyTemplates(fullTemplatePath);
    await this.installUtilityTemplates(fullTemplatePath);
    
    // Create README
    await this.createREADME(fullTemplatePath);
    
    // Create template manifest
    await this.createTemplateManifest(fullTemplatePath);
    
    console.log('Tuckers Tools templates installed successfully');
  }

  async createTemplateManifest(basePath: string) {
    const manifestPath = `${basePath}/template-manifest.json`;
    const manifestContent = JSON.stringify(this.manifest, null, 2);
    
    try {
      // Check if manifest already exists
      const existingManifest = this.app.vault.getAbstractFileByPath(manifestPath);
      if (existingManifest) {
        // For now, we won't overwrite the manifest
        // In a real implementation, we'd check versions and offer to update
        return;
      }
      
      // Create the manifest file
      await this.app.vault.create(manifestPath, manifestContent);
    } catch (e) {
      console.error(`Error creating template manifest ${manifestPath}:`, e);
    }
  }

  async checkForTemplateUpdates(): Promise<boolean> {
    // This would check if templates need to be updated
    // For now, we'll just return false
    console.log("Checking for template updates");
    return false;
  }

  async updateTemplates() {
    // This would update existing templates
    // For now, we'll just log that it would be called
    console.log("Updating templates");
    
    // In a real implementation, this would:
    // 1. Check template manifest for version information
    // 2. Compare with current template versions
    // 3. Update templates that have newer versions
    // 4. Preserve user customizations
  }

  async installCourseTemplates(basePath: string) {
    const coursePath = `${basePath}/Courses`;
    
    // Create Course Homepage template
    const courseHomepageTemplate = this.generateCourseHomepageTemplate();
    await this.writeTemplateFile(`${coursePath}/Create Course Homepage.md`, courseHomepageTemplate);
    
    // Create Course Index template
    const courseIndexTemplate = this.generateCourseIndexTemplate();
    await this.writeTemplateFile(`${coursePath}/Course Index.md`, courseIndexTemplate);
  }

  async installModuleTemplates(basePath: string) {
    const modulePath = `${basePath}/Modules`;
    
    // Create Module template
    const moduleTemplate = this.generateModuleTemplate();
    await this.writeTemplateFile(`${modulePath}/Create Module.md`, moduleTemplate);
  }

  async installChapterTemplates(basePath: string) {
    const chapterPath = `${basePath}/Chapters`;
    
    // Create Chapter template
    const chapterTemplate = this.generateChapterTemplate();
    await this.writeTemplateFile(`${chapterPath}/Create Chapter.md`, chapterTemplate);
  }

  async installAssignmentTemplates(basePath: string) {
    const assignmentPath = `${basePath}/Assignments`;
    
    // Create Assignment template
    const assignmentTemplate = this.generateAssignmentTemplate();
    await this.writeTemplateFile(`${assignmentPath}/Create Assignment.md`, assignmentTemplate);
  }

  async installDailyTemplates(basePath: string) {
    const dailyPath = `${basePath}/Daily`;
    
    // Create Daily Note template
    const dailyNoteTemplate = this.generateDailyNoteTemplate();
    await this.writeTemplateFile(`${dailyPath}/Daily Note.md`, dailyNoteTemplate);
  }

  async installUtilityTemplates(basePath: string) {
    const utilityPath = `${basePath}/Utilities`;
    
    // Create Vocabulary Entry template
    const vocabTemplate = this.generateVocabularyTemplate();
    await this.writeTemplateFile(`${utilityPath}/Vocabulary Entry.md`, vocabTemplate);
    
    // Create Due Date Entry template
    const dueDateTemplate = this.generateDueDateTemplate();
    await this.writeTemplateFile(`${utilityPath}/Due Date Entry.md`, dueDateTemplate);
  }

  async writeTemplateFile(path: string, content: string) {
    try {
      // Check if file already exists
      const existingFile = this.app.vault.getAbstractFileByPath(path);
      if (existingFile) {
        // For now, we won't overwrite existing templates
        // In a real implementation, we'd check versions and offer to update
        return;
      }
      
      // Create the file
      await this.app.vault.create(path, content);
    } catch (e) {
      console.error(`Error creating template file ${path}:`, e);
    }
  }

  generateCourseHomepageTemplate(): string {
    return `---
${this.settings.useEnhancedMetadata ? `course_id: <% courseId %>
course_name: <% courseName %>
course_term: <% courseSeason %> <% courseYear %>
course_year: <% courseYear %>
course_semester: <% courseSeason %>
content_type: course_homepage
school: ${this.settings.schoolName}
school_abbreviation: ${this.settings.schoolAbbreviation}` : `course_id: <% courseId %>
title: <% courseName %>`}
created: <% tp.date.now("YYYY-MM-DD[T]HH:mm:ssZ") %>
tags: 
  - course_home
  - education
  - <% courseId %>
  - ${this.settings.schoolAbbreviation}/<% courseYear %>/<% courseSeason %>/<% courseId %>
---

<%*
const { exec } = require("child_process");
let courseName = await tp.system.prompt("Course Name (e.g. PSI-101 - Intro to Psych)")
let courseSeason = await tp.system.suggester(["Fall","Winter","Spring","Summer"],["Fall","Winter","Spring","Summer"], "Season")
let courseYear = await tp.system.prompt("Year")
let courseId = courseName.split(' - ')[0]
await tp.file.move(\`/\${courseYear}/\${courseSeason}/\${courseName}/\${courseName}\`)
try {await app.vault.createFolder(\`\${courseYear}/\${courseSeason}/\${courseName}/Attachments\`)} catch (e) {}
%>

# <% courseName %>

## Course Information
**Course ID**: <% courseId %>
**Term**: <% courseSeason %> <% courseYear %>
**School**: ${this.settings.schoolName}

## Instructor
**Name**: 
**Email**: 
**Office Hours**: 

## Course Description

## Learning Objectives

## Required Texts
\`\`\`meta-bind-js-view
{texts} as texts
---
const availableTexts = app.vault.getFiles().filter(file => file.extension == 'pdf').map(f => f?.name)
const escapeRegex = /[,\"\`'()]/g;
options = availableTexts.map(t => \`option([[\${t.replace(escapeRegex,\`\\\\$1\`)}]], \${t.replace(escapeRegex,\`\\\\$1\`)})\` )
const str = \\\`INPUT[inlineListSuggester(\${options.join(", ")}):texts]\\\`
return engine.markdown.create(str)
\`\`\`

## Schedule

## Assignments

## Resources

## Vocabulary
\`\`\`dataviewjs
// Vocabulary aggregation code would go here
\`\`\`

## Due Dates
\`\`\`dataviewjs
// Due dates aggregation code would go here
\`\`\``;
  }

  generateCourseIndexTemplate(): string {
    return `---
content_type: course_index
tags:
  - index
---

# Course Index

## Modules

## Chapters

## Assignments

## Resources

## Vocabulary

## Due Dates`;
  }

  generateModuleTemplate(): string {
    return `---
${this.settings.useEnhancedMetadata ? `course_id: <% courseId %>
module_number: <% moduleNumber %>
week_number: <% weekNumber %>
class_day: <% dayOfWeek %>
content_type: module
parent_course: "[[<% course %>]]"` : `course_id: <% courseId %>
module_number: <% moduleNumber %>
week_number: <% weekNumber %>
class_day: <% dayOfWeek %>`}
created: <% tp.date.now("YYYY-MM-DD[T]HH:mm:ssZ") %>
tags:
  - education
  - <% courseId %>
  - module
---

<%*
const { season, moduleNumber, weekNumber, course, courseId, discipline, dayOfWeek } = await tp.user.new_module(app, tp, "2025");
let title = courseId
if (moduleNumber && weekNumber) { title = \`M\${moduleNumber}/W\${weekNumber}\`}
else if (moduleNumber) { title = \`M\${moduleNumber}\` } 
else if (weekNumber) { title = \`W\${weekNumber}\`}
%>

# [[<% course %>]] - <% title %> - <% dayOfWeek %>

## Learning Objectives

## Reading Assignment

## Lecture Notes

## Discussion Questions

## Assignments
| Date | Assignment | Status |
| ---- | ---------- | ------ |
|      |            |        |

## Vocabulary

## Additional Resources`;
  }

  generateChapterTemplate(): string {
    return `---
${this.settings.useEnhancedMetadata ? `course_id: <% courseId %>
chapter_number: <% chapterNumber %>
content_type: chapter
parent_course: "[[<% course %>]]"
text_reference: "[[<% text %>]]"` : `course_id: <% courseId %>
chapter_number: <% chapterNumber %>`}
created: <% tp.date.now("YYYY-MM-DD[T]HH:mm:ssZ") %>
tags:
  - education
  - <% courseId %>
  - chapter
---

<%*
const { chapterNumber, course, courseId, discipline, text} = await tp.user.new_chapter(tp);
%>

# [[<% text %>]] - Chapter <% chapterNumber %>

## Summary

## Key Concepts

## Vocabulary
- 

## Notes

## Discussion Questions

## Further Reading`;
  }

  generateAssignmentTemplate(): string {
    return `---
${this.settings.useEnhancedMetadata ? `course_id: <% courseId %>
assignment_type: <% assignmentType %>
due_date: <% dueDate %>
points: <% points %>
content_type: assignment
parent_course: "[[<% course %>]]"` : `course_id: <% courseId %>
assignment_type: <% assignmentType %>
due_date: <% dueDate %>`}
created: <% tp.date.now("YYYY-MM-DD[T]HH:mm:ssZ") %>
status: pending
tags:
  - education
  - <% courseId %>
  - assignment
---

# <% assignmentName %> - <% courseId %>

## Description

## Instructions

## Due Date
**Assigned**: <% tp.date.now("YYYY-MM-DD") %>
**Due**: <% dueDate %>

## Submission

## Grading Criteria

## Resources`;
  }

  generateDailyNoteTemplate(): string {
    return `---
content_type: daily_note
date: <% tp.date.now("YYYY-MM-DD") %>
tags:
  - daily
  - <% tp.date.now("YYYY") %>
  - <% tp.date.now("MM") %>
  - <% tp.date.now("DD") %>
---

# <% tp.date.now("YYYY-MM-DD - dddd") %>

<< [[<% tp.date.yesterday("YYYY-MM-DD") %>]] | [[<% tp.date.tomorrow("YYYY-MM-DD") %>]] >>

## Today's Focus

## Courses Worked On
- 

## Tasks Completed
- [ ] 

## Vocabulary Reviewed
- 

## Assignments Due
- 

## Learning Achievements

## Challenges

## Tomorrow's Plan

## Reflection`;
  }

  generateVocabularyTemplate(): string {
    return `## <% term %>
**Term**: <% term %>
**Part of Speech**: 
**Definition**: 
**Context**: 
**Examples**: 
**Related Terms**: 
**See Also**:`;
  }

  generateDueDateTemplate(): string {
    return `| <% dueDate %> | <% assignment %> | <% status %> |`;
  }

  async createREADME(basePath: string) {
    const readmeContent = `# Tuckers Tools Templates

This directory contains templates for the Tuckers Tools Obsidian plugin.

## Template Categories

- **Courses**: Templates for creating and organizing courses
- **Modules**: Templates for course modules
- **Chapters**: Templates for chapter notes
- **Assignments**: Templates for assignments
- **Daily**: Templates for daily notes
- **Utilities**: Helper templates

## Usage

These templates are designed to work with the Tuckers Tools plugin. To use them:

1. Install the Tuckers Tools plugin
2. Configure your settings in the plugin settings tab
3. Use the "Insert Template" command to apply these templates to new notes

## Customization

Feel free to customize these templates to suit your needs. The plugin will not overwrite your changes when updating templates.`;

    await this.writeTemplateFile(`${basePath}/README.md`, readmeContent);
  }
}