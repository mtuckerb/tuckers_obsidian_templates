// Course creation wizard for Tuckers Tools plugin

import { App, Notice, TFile } from "obsidian"
import { TuckersToolsSettings } from "./settings"
import { slugify } from "./utils"

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
    // Use a simple prompt for now - in a real implementation, this would use a proper modal
    const value = prompt(`${title}: ${message}`)

    if (!value) return null // User cancelled

    if (!validator(value)) {
      new Notice(errorMessage)
      return await this.promptWithValidation(
        title,
        message,
        validator,
        errorMessage
      )
    }

    return value.trim()
  }

  private async promptWithOptions(
    title: string,
    message: string,
    options: string[]
  ): Promise<string | null> {
    // Use a simple confirm dialog for now - in a real implementation, this would use a proper modal
    const choice = prompt(
      `${title}: ${message}\nOptions: ${options.join(", ")}\nEnter your choice:`
    )

    if (!choice) return null // User cancelled

    const trimmedChoice = choice.trim()
    if (options.includes(trimmedChoice)) {
      return trimmedChoice
    }

    new Notice(`Please select one of: ${options.join(", ")}`)
    return await this.promptWithOptions(title, message, options)
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
course_name: ${courseDetails.courseName}
course_term: ${courseDetails.courseSeason} ${courseDetails.courseYear}
course_year: ${courseDetails.courseYear}
course_semester: ${courseDetails.courseSeason}
content_type: course_homepage
school: ${this.settings.schoolName}
school_abbreviation: ${this.settings.schoolAbbreviation}`
    : `course_id: ${courseDetails.courseId}
title: ${courseDetails.courseName}`
}
created: ${new Date().toISOString()}
tags:
 - course_home
 - education
 - ${courseDetails.courseId}
 - ${this.settings.schoolAbbreviation}/${courseDetails.courseYear}/${
      courseDetails.courseSeason
    }/${courseDetails.courseId}
---


# ${courseDetails.courseName}

## Course Information
**Course ID**: ${courseDetails.courseId}
**Term**: ${courseDetails.courseSeason} ${courseDetails.courseYear}
**School**: ${this.settings.schoolName}

## Instructor
**Name**:
**Email**:
**Office Hours**:

## Course Description

## Learning Objectives

## Required Texts

## Schedule

## Assignments

## Resources

## Vocabulary

## Due Dates`
  }
}
