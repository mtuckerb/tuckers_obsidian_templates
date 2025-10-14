import { App, TFile } from "obsidian"
import { isBetween } from "./utils"

export class DueDatesParser {
  app: App

  constructor(app: App) {
    this.app = app
  }

  parseDueDatesFromNote(
    content: string
  ): Array<{ date: string; assignment: string; status: string }> {
    // Extract due dates section from note content
    const dueDatesRegex = /# Due Dates[\s\S]*?(?=\n#|$)/
    const matches = content?.match(dueDatesRegex)

    if (!matches) {
      return []
    }

    const dueDatesSection = matches[0]
    const dueDates = []

    // Look for markdown tables in the due dates section
    const tableRegex = /\|[\s\S]*?\n/g
    const tableMatches = dueDatesSection.match(tableRegex)

    if (tableMatches) {
      for (const table of tableMatches) {
        const rows = table
          .trim()
          .split("\n")
          .filter((row) => row.startsWith("|"))
        const parsedRows = this.parseTableRows(rows)
        dueDates.push(...parsedRows)
      }
    }

    return dueDates
  }

  private parseTableRows(
    rows: string[]
  ): Array<{ date: string; assignment: string; status: string }> {
    if (rows.length < 2) return [] // Need at least header + 1 data row

    const dueDates = []

    for (let i = 1; i < rows.length; i++) {
      // Skip header row
      const row = rows[i]
      const columns = row
        .split("|")
        .map((col) => col.trim())
        .filter((col) => col)

      if (columns.length >= 2) {
        const [date, assignment, status = "pending"] = columns
        if (date && assignment && this.isValidDate(date)) {
          dueDates.push({ date, assignment, status })
        }
      }
    }

    return dueDates
  }

  private isValidDate(dateString: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    return dateRegex.test(dateString) && !isNaN(Date.parse(dateString))
  }

  async parseDueDatesFromCourse(
    courseId: string,
    startDate?: string,
    endDate?: string
  ): Promise<
    Array<{ date: string; assignment: string; status: string; source: string }>
  > {
    console.log(`Parsing due dates for course: ${courseId}`)

    try {
      // Find all notes related to the course
      const courseNotes = await this.findCourseNotes(courseId)

      if (courseNotes.length === 0) {
        console.log(`No notes found for course: ${courseId}`)
        return []
      }

      // Parse due dates from each note
      const allDueDates: Array<{
        date: string
        assignment: string
        status: string
        source: string
      }> = []

      for (const note of courseNotes) {
        try {
          const content = await this.app.vault.read(note)
          const dueDates = this.parseDueDatesFromNote(content)

          // Add source information
          const dueDatesWithSource = dueDates.map((dueDate) => ({
            ...dueDate,
            source: note.basename
          }))

          allDueDates.push(...dueDatesWithSource)
        } catch (error) {
          console.error(`Error reading note ${note.path}:`, error)
        }
      }

      // Filter by date range if provided
      let filteredDueDates = allDueDates
      if (startDate || endDate) {
        filteredDueDates = this.filterByDateRange(
          allDueDates,
          startDate,
          endDate
        )
      }

      // Sort by date
      filteredDueDates.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )

      console.log(
        `Found ${filteredDueDates.length} due dates for course: ${courseId}`
      )
      return filteredDueDates
    } catch (error) {
      console.error(`Error parsing due dates for course ${courseId}:`, error)
      return []
    }
  }

  private async findCourseNotes(courseId: string): Promise<TFile[]> {
    const notes: TFile[] = []

    // Get all markdown files in the vault
    const files = this.app.vault.getMarkdownFiles()

    for (const file of files) {
      // Check if the file path contains the course ID or belongs to the course
      if (
        file.path.includes(courseId) ||
        (await this.noteBelongsToCourse(file, courseId))
      ) {
        notes.push(file)
      }
    }

    return notes
  }

  private async noteBelongsToCourse(
    file: TFile,
    courseId: string
  ): Promise<boolean> {
    try {
      const content = await this.app.vault.read(file)
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)

      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1]
        // Check if course_id is in the frontmatter
        return (
          frontmatter.includes(`course_id: ${courseId}`) ||
          frontmatter.includes(`course_id:${courseId}`)
        )
      }

      return false
    } catch (error) {
      console.error(
        `Error checking if note ${file.path} belongs to course ${courseId}:`,
        error
      )
      return false
    }
  }

  private filterByDateRange(
    dueDates: Array<{
      date: string
      assignment: string
      status: string
      source: string
    }>,
    startDate?: string,
    endDate?: string
  ): Array<{
    date: string
    assignment: string
    status: string
    source: string
  }> {
    return dueDates.filter((dueDate) => {
      const dueDateTime = new Date(dueDate.date).getTime()

      if (startDate && dueDateTime < new Date(startDate).getTime()) {
        return false
      }

      if (endDate && dueDateTime > new Date(endDate).getTime()) {
        return false
      }

      return true
    })
  }

  async generateDueDatesSummary(
    courseId: string,
    dueDates: Array<{
      date: string
      assignment: string
      status: string
      source: string
    }>
  ): Promise<string> {
    if (dueDates.length === 0) {
      return `# Due Dates Summary - ${courseId}\n\nNo due dates found.\n`
    }

    // Group by status
    const byStatus = dueDates.reduce((acc, dueDate) => {
      if (!acc[dueDate.status]) {
        acc[dueDate.status] = []
      }
      acc[dueDate.status].push(dueDate)
      return acc
    }, {} as Record<string, typeof dueDates>)

    let content = `# Due Dates Summary - ${courseId}\n\n`
    content += `Total assignments: ${dueDates.length}\n\n`

    // Add summary by status
    for (const [status, items] of Object.entries(byStatus)) {
      content += `## ${status.charAt(0).toUpperCase() + status.slice(1)} (${
        items.length
      })\n\n`
      content += `| Date | Assignment | Source |\n`
      content += `| ---- | ---------- | ------ |\n`

      for (const item of items) {
        content += `| ${item.date} | ${item.assignment} | ${item.source} |\n`
      }
      content += `\n`
    }

    return content
  }

  async createDueDatesSummaryFile(
    courseId: string,
    startDate?: string,
    endDate?: string
  ): Promise<void> {
    try {
      const dueDates = await this.parseDueDatesFromCourse(
        courseId,
        startDate,
        endDate
      )

      const summaryContent = await this.generateDueDatesSummary(
        courseId,
        dueDates
      )

      // Create the summary file
      const fileName = `${courseId} - Due Dates Summary.md`
      const filePath = `Courses/${courseId}/${fileName}`

      try {
        await this.app.vault.create(filePath, summaryContent)
        console.log(`Created due dates summary file: ${filePath}`)
      } catch (error) {
        // File might already exist, try to update it
        const existingFile = this.app.vault.getAbstractFileByPath(filePath)
        if (existingFile && existingFile instanceof TFile) {
          await this.app.vault.modify(existingFile, summaryContent)
          console.log(`Updated due dates summary file: ${filePath}`)
        }
      }
    } catch (error) {
      console.error(
        `Error creating due dates summary for course ${courseId}:`,
        error
      )
      throw error
    }
  }
}
