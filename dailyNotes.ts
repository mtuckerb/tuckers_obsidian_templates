// Daily notes integration for Tuckers Tools plugin

import { App, TFile } from "obsidian"

export class DailyNotesIntegration {
  app: App

  constructor(app: App) {
    this.app = app
  }

  async getTodaysActivities(): Promise<
    Array<{ file: string; type: string; course?: string }>
  > {
    console.log("Getting today's academic activities")

    try {
      const today = new Date()
      const todayString = today.toISOString().split("T")[0]

      // Find files created or modified today
      const files = this.app.vault.getMarkdownFiles()
      const todaysFiles: TFile[] = []

      for (const file of files) {
        const fileDate = this.extractDateFromPath(file.path)
        if (fileDate === todayString) {
          todaysFiles.push(file)
        }
      }

      // Analyze activities
      const activities: Array<{ file: string; type: string; course?: string }> =
        []

      for (const file of todaysFiles) {
        const activity = await this.analyzeFileActivity(file)
        if (activity) {
          activities.push(activity)
        }
      }

      console.log(`Found ${activities.length} academic activities for today`)
      return activities
    } catch (error) {
      console.error("Error getting today's activities:", error)
      return []
    }
  }

  async getCourseActivityForDate(
    courseId: string,
    date: string
  ): Promise<Array<{ file: string; type: string }>> {
    console.log(`Getting activity for course ${courseId} on date ${date}`)

    try {
      // Find files related to the course modified on the date
      const courseFiles = await this.findCourseFilesForDate(courseId, date)

      const activities: Array<{ file: string; type: string }> = []

      for (const file of courseFiles) {
        const content = await this.app.vault.read(file)
        const fileType = this.determineFileType(file, content)

        activities.push({
          file: file.basename,
          type: fileType
        })
      }

      console.log(
        `Found ${activities.length} activities for course ${courseId} on ${date}`
      )
      return activities
    } catch (error) {
      console.error(
        `Error getting course activity for ${courseId} on ${date}:`,
        error
      )
      return []
    }
  }

  private extractDateFromPath(filePath: string): string | null {
    // Try to extract date from file path (e.g., "Daily/2025-01-15.md" -> "2025-01-15")
    const dateRegex = /(\d{4}-\d{2}-\d{2})/g
    const matches = filePath.match(dateRegex)
    return matches ? matches[matches.length - 1] : null
  }

  private async analyzeFileActivity(
    file: TFile
  ): Promise<{ file: string; type: string; course?: string } | null> {
    try {
      const content = await this.app.vault.read(file)

      // Determine file type based on content and path
      const fileType = this.determineFileType(file, content)

      // Extract course ID if applicable
      const courseId =
        this.extractCourseIdFromContent(content) ||
        this.extractCourseIdFromPath(file.path)

      return {
        file: file.basename,
        type: fileType,
        course: courseId || undefined
      }
    } catch (error) {
      console.error(`Error analyzing file ${file.path}:`, error)
      return null
    }
  }

  private determineFileType(file: TFile, content: string): string {
    const path = file.path.toLowerCase()

    // Check for daily notes
    if (
      path.includes("daily") ||
      content.includes("content_type: daily_note")
    ) {
      return "daily_note"
    }

    // Check for course-related files
    if (path.includes("courses") || content.includes("course_id:")) {
      if (content.includes("content_type: course_homepage")) {
        return "course_homepage"
      }
      if (content.includes("content_type: module")) {
        return "module"
      }
      if (content.includes("content_type: chapter")) {
        return "chapter"
      }
      if (content.includes("content_type: assignment")) {
        return "assignment"
      }
      return "course_note"
    }

    // Check for vocabulary entries
    if (content.includes("## ") && content.match(/^\*\*Term\*\*:/m)) {
      return "vocabulary_entry"
    }

    return "other"
  }

  private extractCourseIdFromContent(content: string): string | null {
    const courseIdRegex = /course_id:\s*([A-Z]{2,4}-\d{3})/
    const match = content.match(courseIdRegex)
    return match ? match[1] : null
  }

  private extractCourseIdFromPath(filePath: string): string | null {
    const courseIdRegex = /([A-Z]{2,4}-\d{3})/g
    const matches = filePath.match(courseIdRegex)
    return matches ? matches[matches.length - 1] : null
  }

  private async findCourseFilesForDate(
    courseId: string,
    date: string
  ): Promise<TFile[]> {
    const files: TFile[] = []

    // Get all files and filter by course ID and date
    const allFiles = this.app.vault.getMarkdownFiles()

    for (const file of allFiles) {
      // Check if file belongs to the course
      if (
        file.path.includes(courseId) ||
        (await this.fileBelongsToCourse(file, courseId))
      ) {
        // Check if file was modified on the specified date
        const fileDate = this.extractDateFromPath(file.path)
        if (fileDate === date) {
          files.push(file)
        }
      }
    }

    return files
  }

  private async fileBelongsToCourse(
    file: TFile,
    courseId: string
  ): Promise<boolean> {
    try {
      const content = await this.app.vault.read(file)
      return this.extractCourseIdFromContent(content) === courseId
    } catch (error) {
      console.error(
        `Error checking if file ${file.path} belongs to course ${courseId}:`,
        error
      )
      return false
    }
  }

  async generateDailySummary(date?: string): Promise<string> {
    const targetDate = date || new Date().toISOString().split("T")[0]
    const activities = await this.getCourseActivityForDate("", targetDate)

    if (activities.length === 0) {
      return `# Academic Activities - ${targetDate}\n\nNo academic activities recorded for this date.\n`
    }

    // Group activities by course
    const byCourse: Record<string, typeof activities> = {}
    const noCourse: typeof activities = []

    for (const activity of activities) {
      if (activity.file.includes("Courses/")) {
        // Extract course ID from path
        const pathParts = activity.file.split("/")
        const courseIndex = pathParts.findIndex((part) => part.includes("-"))
        if (courseIndex >= 0) {
          const courseId = pathParts[courseIndex]
          if (!byCourse[courseId]) {
            byCourse[courseId] = []
          }
          byCourse[courseId].push(activity)
        } else {
          noCourse.push(activity)
        }
      } else {
        noCourse.push(activity)
      }
    }

    let content = `# Academic Activities - ${targetDate}\n\n`
    content += `Total activities: ${activities.length}\n\n`

    // Add activities by course
    for (const [courseId, courseActivities] of Object.entries(byCourse)) {
      content += `## ${courseId}\n\n`
      content += `| File | Type |\n`
      content += `| ---- | ---- |\n`

      for (const activity of courseActivities) {
        content += `| ${activity.file} | ${activity.type} |\n`
      }
      content += `\n`
    }

    // Add activities without specific course
    if (noCourse.length > 0) {
      content += `## Other Activities\n\n`
      content += `| File | Type |\n`
      content += `| ---- | ---- |\n`

      for (const activity of noCourse) {
        content += `| ${activity.file} | ${activity.type} |\n`
      }
      content += `\n`
    }

    return content
  }

  async createDailySummaryFile(date?: string): Promise<void> {
    try {
      const targetDate = date || new Date().toISOString().split("T")[0]
      const summaryContent = await this.generateDailySummary(targetDate)

      // Create the summary file
      const fileName = `${targetDate} - Academic Summary.md`
      const filePath = `Daily/${fileName}`

      try {
        await this.app.vault.create(filePath, summaryContent)
        console.log(`Created daily summary file: ${filePath}`)
      } catch (error) {
        // File might already exist, try to update it
        const existingFile = this.app.vault.getAbstractFileByPath(filePath)
        if (existingFile && existingFile instanceof TFile) {
          await this.app.vault.modify(existingFile, summaryContent)
          console.log(`Updated daily summary file: ${filePath}`)
        }
      }
    } catch (error) {
      console.error(`Error creating daily summary for ${date}:`, error)
      throw error
    }
  }
}
