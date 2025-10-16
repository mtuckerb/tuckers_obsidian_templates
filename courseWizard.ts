// Course creation wizard for Tuckers Tools plugin

import { App, Notice, TFile } from "obsidian"
import { TuckersToolsSettings } from "./settings"
import { slugify } from "./utils"
import { InputModal, SuggesterModal } from "./inputModal"
import { TemplateManager } from "./templateManager"

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
    // Use the templateManager to get the template content and replace values
    const templateManager = new TemplateManager(this.app, this.settings);
    const templateContent = templateManager.generateCourseHomepageTemplate();
    
    // Replace template variables with actual values
    return templateContent
      .replace(/<% courseName %>/g, courseDetails.courseName)
      .replace(/<% courseSeason %>/g, courseDetails.courseSeason)
      .replace(/<% courseYear %>/g, courseDetails.courseYear)
      .replace(/<% courseId %>/g, courseDetails.courseId)
      .replace(/<% tp\.date\.now\("YYYY-MM-DD\[T\]HH:mm:ssZ"\) %>/g, new Date().toISOString())
      .replace(/<% tp\.date\.now\("YYYY-MM-DD\[T\]hh:mm:SSSSZZ"\) %>/g, new Date().toISOString());
  }
}
