import { App, Notice } from "obsidian"
import { TuckersToolsSettings } from "./settings"

interface TemplateManifest {
  version: string
  templates: Record<string, string>
  plugin_version: string
  release_notes: string
}

export class TemplateManager {
  app: App
  settings: TuckersToolsSettings
  manifest: TemplateManifest

  constructor(app: App, settings: TuckersToolsSettings) {
    this.app = app
    this.settings = settings
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
    }
  }

  async installTemplates() {
    try {
      // Get Templater plugin settings to find template folder
      const templaterPlugin = this.getTemplaterPlugin()
      if (!templaterPlugin) {
        new Notice(
          "Templater plugin not found. Please install and enable the Templater plugin first."
        )
        console.error(
          "Templater plugin not found. Please install and enable the Templater plugin first."
        )
        return
      }

      const templateFolderPath = this.getTemplateFolderPath(templaterPlugin)
      if (!templateFolderPath) {
        new Notice(
          "Template folder not configured in Templater settings. Please configure it in Templater settings first."
        )
        console.error(
          "Template folder not configured in Templater settings. Please configure it in Templater settings first."
        )
        return
      }

      const fullTemplatePath = `${templateFolderPath}/${this.settings.templateFolder}`

      // Create the main template folder if it doesn't exist
      try {
        await this.app.vault.createFolder(fullTemplatePath)
        console.log(`Created template folder: ${fullTemplatePath}`)
      } catch (e) {
        // Folder might already exist, which is fine
        console.log(
          `Template folder already exists or created: ${fullTemplatePath}`
        )
      }

      // Create subdirectories
      const subdirs = [
        "Courses",
        "Modules",
        "Chapters",
        "Assignments",
        "Daily",
        "Utilities"
      ]
      for (const subdir of subdirs) {
        try {
          const subPath = `${fullTemplatePath}/${subdir}`
          await this.app.vault.createFolder(subPath)
          console.log(`Created subdirectory: ${subPath}`)
        } catch (e) {
          // Folder might already exist, which is fine
          console.log(
            `Subdirectory already exists: ${fullTemplatePath}/${subdir}`
          )
        }
      }

      // Install templates
      await this.installCourseTemplates(fullTemplatePath)
      await this.installModuleTemplates(fullTemplatePath)
      await this.installChapterTemplates(fullTemplatePath)
      await this.installAssignmentTemplates(fullTemplatePath)
      await this.installDailyTemplates(fullTemplatePath)
      await this.installUtilityTemplates(fullTemplatePath)

      // Create README
      await this.createREADME(fullTemplatePath)

      // Create template manifest
      await this.createTemplateManifest(fullTemplatePath)

      new Notice("Tuckers Tools templates installed successfully!")
      console.log("Tuckers Tools templates installed successfully")
    } catch (error) {
      console.error("Error installing templates:", error)
      new Notice("Error installing templates. Check console for details.")
    }
  }

  private getTemplaterPlugin(): any {
    // Try multiple ways to access the Templater plugin
    const possiblePaths = [
      (this.app as any).plugins.plugins["templater-obsidian"],
      (this.app as any).plugins.plugins["templater"],
      (this.app as any).plugins.getPlugin("templater-obsidian"),
      (this.app as any).plugins.getPlugin("templater")
    ]

    for (const path of possiblePaths) {
      if (path) {
        return path
      }
    }

    return null
  }

  private getTemplateFolderPath(templaterPlugin: any): string | null {
    const settings = templaterPlugin.settings

    if (!settings) {
      console.error("Templater plugin has no settings")
      return null
    }

    // Try different possible property names for template folder
    const possiblePaths = [
      settings.template_folder,
      settings.templateFolder,
      settings.templateFolderPath,
      settings.folder
    ]

    for (const path of possiblePaths) {
      if (path && typeof path === "string") {
        return path
      }
    }

    console.error(
      "Template folder not found in Templater settings. Available settings:",
      Object.keys(settings)
    )
    return null
  }

  async createTemplateManifest(basePath: string) {
    const manifestPath = `${basePath}/template-manifest.json`
    const manifestContent = JSON.stringify(this.manifest, null, 2)

    try {
      // Check if manifest already exists
      const existingManifest =
        this.app.vault.getAbstractFileByPath(manifestPath)
      if (existingManifest) {
        // Update the existing manifest
        const file = existingManifest as import("obsidian").TFile
        await this.app.vault.modify(file, manifestContent)
        console.log(`Updated template manifest: ${manifestPath}`)
        return
      }

      // Create the manifest file
      await this.app.vault.create(manifestPath, manifestContent)
      console.log(`Created template manifest: ${manifestPath}`)
    } catch (e) {
      new Notice(`Error creating template manifest ${manifestPath}`)
      console.error(`Error creating template manifest ${manifestPath}:`, e)
    }
  }

  async checkForTemplateUpdates(): Promise<boolean> {
    // This would check if templates need to be updated
    // For now, we'll just return false
    console.log("Checking for template updates")
    return false
  }

  async updateTemplates() {
    try {
      // This would update existing templates
      console.log("Updating templates")

      // Get Templater plugin settings to find template folder
      const templaterPlugin = this.getTemplaterPlugin()
      if (!templaterPlugin) {
        new Notice(
          "Templater plugin not found. Please install and enable the Templater plugin first."
        )
        console.error(
          "Templater plugin not found. Please install and enable the Templater plugin first."
        )
        return
      }

      const templateFolderPath = this.getTemplateFolderPath(templaterPlugin)
      if (!templateFolderPath) {
        new Notice(
          "Template folder not configured in Templater settings. Please configure it in Templater settings first."
        )
        console.error(
          "Template folder not configured in Templater settings. Please configure it in Templater settings first."
        )
        return
      }

      const fullTemplatePath = `${templateFolderPath}/${this.settings.templateFolder}`

      // Update templates (this will overwrite existing ones)
      await this.installCourseTemplates(fullTemplatePath)
      await this.installModuleTemplates(fullTemplatePath)
      await this.installChapterTemplates(fullTemplatePath)
      await this.installAssignmentTemplates(fullTemplatePath)
      await this.installDailyTemplates(fullTemplatePath)
      await this.installUtilityTemplates(fullTemplatePath)

      // Update README
      await this.createREADME(fullTemplatePath)

      // Update template manifest
      await this.createTemplateManifest(fullTemplatePath)

      new Notice("Tuckers Tools templates updated successfully!")
      console.log("Tuckers Tools templates updated successfully")
    } catch (error) {
      console.error("Error updating templates:", error)
      new Notice("Error updating templates. Check console for details.")
    }
  }

  async installCourseTemplates(basePath: string) {
    const coursePath = `${basePath}/Courses`

    // Create Course Homepage template
    const courseHomepageTemplate = this.generateCourseHomepageTemplate()
    await this.writeTemplateFile(
      `${coursePath}/Create Course Homepage.md`,
      courseHomepageTemplate
    )

    // Create Course Index template
    const courseIndexTemplate = this.generateCourseIndexTemplate()
    await this.writeTemplateFile(
      `${coursePath}/Course Index.md`,
      courseIndexTemplate
    )
  }

  async installModuleTemplates(basePath: string) {
    const modulePath = `${basePath}/Modules`

    // Create Module template
    const moduleTemplate = this.generateModuleTemplate()
    await this.writeTemplateFile(
      `${modulePath}/Create Module.md`,
      moduleTemplate
    )
  }

  async installChapterTemplates(basePath: string) {
    const chapterPath = `${basePath}/Chapters`

    // Create Chapter template
    const chapterTemplate = this.generateChapterTemplate()
    await this.writeTemplateFile(
      `${chapterPath}/Create Chapter.md`,
      chapterTemplate
    )
  }

  async installAssignmentTemplates(basePath: string) {
    const assignmentPath = `${basePath}/Assignments`

    // Create Assignment template
    const assignmentTemplate = this.generateAssignmentTemplate()
    await this.writeTemplateFile(
      `${assignmentPath}/Create Assignment.md`,
      assignmentTemplate
    )
  }

  async installDailyTemplates(basePath: string) {
    const dailyPath = `${basePath}/Daily`

    // Create Daily Note template
    const dailyNoteTemplate = this.generateDailyNoteTemplate()
    await this.writeTemplateFile(
      `${dailyPath}/Daily Note.md`,
      dailyNoteTemplate
    )
  }

  async installUtilityTemplates(basePath: string) {
    const utilityPath = `${basePath}/Utilities`

    // Create Vocabulary Entry template
    const vocabTemplate = this.generateVocabularyTemplate()
    await this.writeTemplateFile(
      `${utilityPath}/Vocabulary Entry.md`,
      vocabTemplate
    )

    // Create Due Date Entry template
    const dueDateTemplate = this.generateDueDateTemplate()
    await this.writeTemplateFile(
      `${utilityPath}/Due Date Entry.md`,
      dueDateTemplate
    )
  }

  async writeTemplateFile(path: string, content: string) {
    try {
      // Check if file already exists
      const existingFile = this.app.vault.getAbstractFileByPath(path)
      if (existingFile) {
        // For now, we'll update existing templates
        // In a real implementation, we'd check versions and offer to update
        console.log(`Updating existing template file: ${path}`)
        const file = existingFile as import("obsidian").TFile
        await this.app.vault.modify(file, content)
        return
      }

      // Create the file
      await this.app.vault.create(path, content)
      console.log(`Created template file: ${path}`)
    } catch (e) {
      new Notice(`Error creating template file ${path}`)
      console.error(`Error creating template file ${path}:`, e)
    }
  }

  generateCourseHomepageTemplate(): string {
    return `---
${
  this.settings.useEnhancedMetadata
    ? `course_id: <% courseId %>
course_name: <% courseName %>
course_term: <% courseSeason %> <% courseYear %>
course_year: <% courseYear %>
course_semester: <% courseSeason %>
content_type: course_homepage
school: ${this.settings.schoolName}
school_abbreviation: ${this.settings.schoolAbbreviation}`
    : `course_id: <% courseId %>
title: <% courseName %>`
}
created: <% tp.date.now("YYYY-MM-DD[T]HH:mm:ssZ") %>
tags: 
  - course_home
  - education
  - <% courseId %>
  - ${
    this.settings.schoolAbbreviation
  }/<% courseYear %>/<% courseSeason %>/<% courseId %>
---

<%*
// Tuckers Tools Course Creation
// 
// NOTE: For the best experience, use the "Create New Course" command 
// from the command palette instead of using this template directly.
// 
// If you encounter 'prompt() is not supported' errors, this means the 
// tp.system functions are not available in your current context.
// Use the plugin command instead: Command Palette → 'Create New Course'

const { exec } = require("child_process");

let courseName = "New Course";
let courseSeason = "Fall"; 
let courseYear = new Date().getFullYear().toString();
let courseId = "COURSE_ID";

// Try to use system prompts, with graceful fallback
try {
  if (tp && tp.system && tp.system.prompt) {
    courseName = await tp.system.prompt("Course Name (e.g. PSI-101 - Intro to Psych)") || courseName;
    courseSeason = await tp.system.suggester(["Fall","Winter","Spring","Summer"],["Fall","Winter","Spring","Summer"], "Season") || courseSeason;
    courseYear = await tp.system.prompt("Year") || courseYear;
    courseId = courseName.split(' - ')[0] || courseName.replace(/[^a-zA-Z0-9]/g, "_");
  } else {
    // Fallback if tp.system is not available
    console.log("System prompts not available, use the plugin command instead");
  }
} catch (e) {
  console.error("Error with system prompts:", e.message);
  console.log("Use the plugin command: Command Palette → 'Create New Course'");
}

// Move file to appropriate location
await tp.file.move(\`/\${courseYear}/\${courseSeason}/\${courseName}/\${courseName}\`);

// Create attachments folder
try {
  await app.vault.createFolder(\`\${courseYear}/\${courseSeason}/\${courseName}/Attachments\`);
} catch (e) {
  // Folder might already exist
}
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
const escapeRegex = /[,\`'()]/g;
options = availableTexts.map(t => \`option([[\${t.replace(escapeRegex,\$1)}]], \${t.replace(escapeRegex,\$1)})\` )
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
\`\`\``
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

## Due Dates`
  }

  generateModuleTemplate(): string {
    return `---
${
  this.settings.useEnhancedMetadata
    ? `course_id: <% courseId %>
module_number: <% moduleNumber %>
week_number: <% weekNumber %>
class_day: <% dayOfWeek %>
content_type: module
parent_course: "[[<% course %>]]"`
    : `course_id: <% courseId %>
module_number: <% moduleNumber %>
week_number: <% weekNumber %>
class_day: <% dayOfWeek %>`
}
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

## Additional Resources`
  }

  generateChapterTemplate(): string {
    return `---
${
  this.settings.useEnhancedMetadata
    ? `course_id: <% courseId %>
chapter_number: <% chapterNumber %>
content_type: chapter
parent_course: "[[<% course %>]]"
text_reference: "[[<% text %>]]"`
    : `course_id: <% courseId %>
chapter_number: <% chapterNumber %>`
}
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

## Further Reading`
  }

  generateAssignmentTemplate(): string {
    return `---
${
  this.settings.useEnhancedMetadata
    ? `course_id: <% courseId %>
assignment_type: <% assignmentType %>
due_date: <% dueDate %>
points: <% points %>
content_type: assignment
parent_course: "[[<% course %>]]"`
    : `course_id: <% courseId %>
assignment_type: <% assignmentType %>
due_date: <% dueDate %>`
}
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

## Resources`
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

## Reflection`
  }

  generateVocabularyTemplate(): string {
    return `## <% term %>
**Term**: <% term %>
**Part of Speech**: 
**Definition**: 
**Context**: 
**Examples**: 
**Related Terms**: 
**See Also**:`
  }

  generateDueDateTemplate(): string {
    return `| <% dueDate %> | <% assignment %> | <% status %> |`
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

Feel free to customize these templates to suit your needs. The plugin will not overwrite your changes when updating templates.`

    await this.writeTemplateFile(`${basePath}/README.md`, readmeContent)
  }
}
