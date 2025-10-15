// Course creation wizard for Tuckers Tools plugin

import { App, Notice, TFile } from "obsidian"
import { TuckersToolsSettings } from "./settings"
import { slugify } from "./utils"
import { InputModal, SuggesterModal } from "./inputModal"

export class CourseCreationWizard {
  app: App
  settings: TuckersToolsSettings

  constructor(app: App, settings: TuckersToolsSettings) {
    this.app = app
    this.settings = settings
  }

  async createCourseHomepage() {
    try {
      // Prompt user for course details
      const courseDetails = await this.promptCourseDetails()

      if (!courseDetails) {
        return false // User cancelled
      }

      // Create folder structure
      const folderPath = await this.createCourseFolderStructure(courseDetails)

      // Generate course homepage note
      await this.createCourseHomepageNote(courseDetails, folderPath)

      // Create attachments folder
      await this.createAttachmentsFolder(folderPath)

      new Notice(`Course "${courseDetails.courseName}" created successfully!`)
      console.log(
        `Course created: ${courseDetails.courseName} at ${folderPath}`
      )

      return true
    } catch (error) {
      console.error("Error creating course:", error)
      new Notice(`Error creating course: ${error.message}`)
      return false
    }
  }

  private async promptCourseDetails(): Promise<{
    courseName: string
    courseSeason: string
    courseYear: string
    courseId: string
  } | null> {
    try {
      const courseName = await this.promptWithValidation(
        "Course Name",
        "Enter course name (e.g., PSI-101 - Intro to Psychology)",
        (value) => value.trim().length > 0,
        "Course name is required"
      )

      if (!courseName) return null

      const courseSeason = await this.promptWithOptions(
        "Season",
        "Select semester/season",
        ["Fall", "Winter", "Spring", "Summer"]
      )

      if (!courseSeason) return null

      const courseYear = await this.promptWithValidation(
        "Year",
        "Enter academic year (e.g., 2025)",
        (value) => /^\d{4}$/.test(value.trim()),
        "Please enter a valid 4-digit year"
      )

      if (!courseYear) return null

      const courseId = courseName.split(" - ")[0]?.trim() || slugify(courseName)

      return {
        courseName,
        courseSeason,
        courseYear,
        courseId
      }
    } catch (error) {
      console.error("Error prompting for course details:", error)
      return null
    }
  }

  private async promptWithValidation(
    title: string,
    message: string,
    validator: (value: string) => boolean,
    errorMessage: string
  ): Promise<string | null> {
    return new Promise((resolve) => {
      const modal = new InputModal(this.app, (result) => {
        if (result === null) {
          // User cancelled
          resolve(null);
          return;
        }

        if (!validator(result)) {
          new Notice(errorMessage);
          // Recursively call again if validation fails
          this.promptWithValidation(title, message, validator, errorMessage)
            .then(resolve);
          return;
        }

        resolve(result.trim());
      });

      // Set the title and message differently since our modal is simple
      modal.titleEl.setText(title);
      const messageEl = modal.contentEl.createDiv();
      messageEl.setText(message);

      modal.open();
    });
  }

  private async promptWithOptions(
    title: string,
    message: string,
    options: string[]
  ): Promise<string | null> {
    return new Promise((resolve) => {
      const modal = new SuggesterModal(this.app, options, (result) => {
        if (result === null) {
          // User cancelled
          resolve(null);
          return;
        }

        if (options.includes(result)) {
          resolve(result);
        } else {
          new Notice(`Please select one of: ${options.join(", ")}`);
          // Recursively call again if choice is invalid
          this.promptWithOptions(title, message, options)
            .then(resolve);
        }
      });

      // Set the title
      modal.titleEl.setText(title);
      const messageEl = modal.contentEl.createDiv();
      messageEl.setText(message);

      modal.open();
    });
  }

  private async createCourseFolderStructure(courseDetails: {
    courseName: string
    courseSeason: string
    courseYear: string
    courseId: string
  }): Promise<string> {
    const folderPath = `${courseDetails.courseYear}/${courseDetails.courseSeason}/${courseDetails.courseName}`

    try {
      await this.app.vault.createFolder(folderPath)
      console.log(`Created course folder: ${folderPath}`)
      return folderPath
    } catch (error) {
      // Folder might already exist, which is fine for now
      console.log(`Course folder already exists or created: ${folderPath}`)
      return folderPath
    }
  }

  private async createCourseHomepageNote(
    courseDetails: {
      courseName: string
      courseSeason: string
      courseYear: string
      courseId: string
    },
    folderPath: string
  ): Promise<void> {
    const notePath = `${folderPath}/${courseDetails.courseName}.md`
    const content = this.generateCourseHomepageContent(courseDetails)

    try {
      await this.app.vault.create(notePath, content)
      console.log(`Created course homepage: ${notePath}`)
    } catch (error) {
      console.error(`Error creating course homepage: ${error}`)
      throw error
    }
  }

  private async createAttachmentsFolder(folderPath: string): Promise<void> {
    const attachmentsPath = `${folderPath}/Attachments`

    try {
      await this.app.vault.createFolder(attachmentsPath)
      console.log(`Created attachments folder: ${attachmentsPath}`)
    } catch (error) {
      // Folder might already exist, which is fine
      console.log(`Attachments folder already exists: ${attachmentsPath}`)
    }
  }

  private generateCourseHomepageContent(courseDetails: {
    courseName: string
    courseSeason: string
    courseYear: string
    courseId: string
  }): string {
    const enhancedMetadata = this.settings.useEnhancedMetadata

    return `---
${
  enhancedMetadata
    ? `course_id: ${courseDetails.courseId}
course_season: ${courseDetails.courseSeason}
course_year: ${courseDetails.courseYear}
instructor_name: TBD
instructor_phone: TBD
instructor_email: TBD
instructor_office_location: TBD
course_time: TBD
course_location: TBD
course_home: TBD
texts: []
created: ${new Date().toISOString()}
tags: 
  - ${courseDetails.courseId}
  - ${this.settings.schoolAbbreviation}/${courseDetails.courseYear}/${courseDetails.courseSeason}/${courseDetails.courseId}/
  - course_home
  - education
  - ${this.settings.schoolName.replace(/\s+/g, '_')}
banner:
cssclasses:
  - whiteboard-course`
    : `course_id: ${courseDetails.courseId}
course_name: ${courseDetails.courseName}
course_season: ${courseDetails.courseSeason}
course_year: ${courseDetails.courseYear}
created: ${new Date().toISOString()}
tags:
  - ${courseDetails.courseId}
  - course_home
  - education`
}
---


# ${courseDetails.courseName}

## Course Information
**Course**: ${courseDetails.courseName}
**Course ID**: ${courseDetails.courseId}
**Term**: ${courseDetails.courseSeason} ${courseDetails.courseYear}
**School**: ${this.settings.schoolName}

## Instructor
**Name**: \`\`INPUT[text(instructor_name)]\`\`
**Phone**: \`\`INPUT[text(instructor_phone)]\`\`
**Email**: \`\`INPUT[text(instructor_email)]\`\`
**Office Location**: \`\`INPUT[text(instructor_office_location)]\`\`

## Course Time & Location
**Time**: \`\`INPUT[text(course_time)]\`\`
**Location**: \`\`INPUT[text(course_location)]\`\`
**Course Home**: \`\`INPUT[text(course_home)]\`\`

## Course Description
\`\`INPUT[multiline(10x50)(course_description)]\`\`

## Learning Objectives
\`\`INPUT[multiline(10x50)(learning_objectives)]\`\`

## Required Texts
\`\`\`meta-bind-js-view
{texts} as texts
---
const availableTexts = app.vault.getFiles().filter(file => file.extension == 'pdf').map(f => f?.name)
const escapeRegex = /[,\`'()]/g;
options = availableTexts.map(t => \`option([[\\\${t.replace(escapeRegex,\\\$1)}]], \\\${t.replace(escapeRegex,\\\$1)})\` )
const str = \`INPUT[inlineListSuggester(\\\${options.join(", ")}):texts]\`
return engine.markdown.create(str)
\`\`\`

## Course Schedule
\`\`INPUT[multiline(20x50)(course_schedule)]\`\`

## Assignments
\`\`INPUT[multiline(15x50)(assignments)]\`\`

## Resources
\`\`INPUT[multiline(10x50)(resources)]\`\`

## Vocabulary
\`\`\`dataviewjs
const {processCourseVocabulary} = require("/Supporting/dataview-functions");
processCourseVocabulary(dv, '${courseDetails.courseId}');
\`\`\`

## Due Dates
\`\`\`dataviewjs
function processDueDates(dv, tag) {
  // Find all pages with the specified tag
  const pages = dv.pages(tag).file;

  // Array to store all rows
  const allRows = [];

  // For each page, extract the "Due Dates" section
  for (const page of pages.values()) {
    const content = app.vault.cachedRead(app.vault.getAbstractFileByPath(page.path));
    const regex = /# Due Dates\\s*
((?:.|
)*?)(?=
#|\\\$)/;
    const match = content.match(regex);
    
    if (match && match[1]) {
      const tableContent = match[1];
      // Split content into lines and process table rows
      const lines = tableContent.split('\\n');
      
      for (const line of lines) {
        // Check if the line looks like a table row (contains | characters)
        if (line.includes('|')) {
          const columns = line.split('|').map(col => col.trim()).filter(col => col !== '');
          
          if (columns.length >= 2) { // Ensure there are at least 2 columns (due date, task)
            // Parse the date to check if it's valid
            const dueDate = columns[0];
            if (!Date.parse(dueDate)) continue; // Skip if not a valid date
            
            // Add the row data to the collection
            allRows.push([columns[0], columns[1], \`[[\\\${page.path}|\\\${page.name}]]\`]);
          }
        }
      }
    }
  }

  // Function to remove duplicate rows based on the first two columns
  const deduplicateFirstTwoColumns = (rows) => {
    const seen = new Set();
    return rows.filter(row => {
      const key = JSON.stringify([row[0], row[1]]); // Combine first two columns as a key
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };
  
  // Remove duplicates based on first two columns
  const allUniqueRows = deduplicateFirstTwoColumns(allRows);

  // Sort rows by date (parse the date string for comparison)
  const sortedRows = allUniqueRows.sort((a, b) => new Date(a[0]) - new Date(b[0]));

  // Create the table with the collected data
  const table = dv.markdownTable(
    ["Due Date", "Task Description", "File"], 
    sortedRows
  );

  return table;
}

processDueDates(dv,'#${courseDetails.courseId}');
\`\`\`

## Class Materials
\`\`INPUT[multiline(10x50)(class_materials)]\`\`

## Classmates
\`\`INPUT[multiline(15x50)(classmates)]\`\`
`
  }
}
