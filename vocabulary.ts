// Vocabulary extraction for Tuckers Tools plugin

import { App, TFile } from "obsidian"
import { getCourseIdFromPath } from "./utils"

export class VocabularyExtractor {
  app: App

  constructor(app: App) {
    this.app = app
  }

  extractVocabularyFromNote(content: string): string[] {
    // Extract vocabulary section from note content
    const vocabRegex = /^#+ Vocabulary.*\n((?:.*?\n)*?)(?=^\s*#\s|$)/m
    const vocabMatches = content?.match(vocabRegex)

    if (vocabMatches) {
      const vocabData = vocabMatches[1].trim()
      const cleanedVocab = vocabData
        .replace(/\[\[.*?\]\]/g, "") // Remove wikilinks
        .replace(/^\s*-\s*/gm, "") // Remove bullet points
        .split("\n")
        .map((term) => term.trim())
        .filter((term) => term.length > 0)

      return cleanedVocab
    }

    return []
  }

  async extractVocabularyFromCourse(
    courseId: string
  ): Promise<Record<string, string[]>> {
    console.log(`Extracting vocabulary for course: ${courseId}`)

    try {
      // Find all notes related to the course
      const courseNotes = await this.findCourseNotes(courseId)

      if (courseNotes.length === 0) {
        console.log(`No notes found for course: ${courseId}`)
        return {}
      }

      // Extract vocabulary from each note
      const vocabularyData: Record<string, string[]> = {}

      for (const note of courseNotes) {
        try {
          const content = await this.app.vault.read(note)
          const vocabulary = this.extractVocabularyFromNote(content)

          if (vocabulary.length > 0) {
            vocabularyData[note.basename] = vocabulary
          }
        } catch (error) {
          console.error(`Error reading note ${note.path}:`, error)
        }
      }

      console.log(
        `Extracted vocabulary from ${
          Object.keys(vocabularyData).length
        } notes for course: ${courseId}`
      )
      return vocabularyData
    } catch (error) {
      console.error(
        `Error extracting vocabulary for course ${courseId}:`,
        error
      )
      return {}
    }
  }

  async findCourseNotes(courseId: string): Promise<TFile[]> {
    const notes: TFile[] = []

    // Get all markdown files in the vault
    const files = this.app.vault.getMarkdownFiles()

    for (const file of files) {
      // Check if the file path contains the course ID
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

  async generateVocabularyIndex(
    courseId: string,
    vocabularyData: Record<string, string[]>
  ): Promise<string> {
    const allTerms: string[] = []
    const termSources: Record<string, string[]> = {}

    // Collect all unique terms and their sources
    for (const [noteName, terms] of Object.entries(vocabularyData)) {
      for (const term of terms) {
        if (!allTerms.includes(term)) {
          allTerms.push(term)
          termSources[term] = []
        }
        termSources[term].push(noteName)
      }
    }

    // Sort terms alphabetically
    allTerms.sort()

    // Generate markdown content
    let content = `# Vocabulary Index - ${courseId}\n\n`
    content += `Total unique terms: ${allTerms.length}\n\n`

    for (const term of allTerms) {
      content += `## ${term}\n`
      content += `**Sources:** ${termSources[term].join(", ")}\n\n`
      content += `**Definition:**\n\n`
      content += `**Context:**\n\n`
      content += `**Examples:**\n\n`
      content += `---\n\n`
    }

    return content
  }

  async createVocabularyIndexFile(courseId: string): Promise<void> {
    try {
      const vocabularyData = await this.extractVocabularyFromCourse(courseId)

      if (Object.keys(vocabularyData).length === 0) {
        console.log(`No vocabulary found for course: ${courseId}`)
        return
      }

      const indexContent = await this.generateVocabularyIndex(
        courseId,
        vocabularyData
      )

      // Create the index file
      const fileName = `${courseId} - Vocabulary Index.md`
      const filePath = `Courses/${courseId}/${fileName}`

      try {
        await this.app.vault.create(filePath, indexContent)
        console.log(`Created vocabulary index file: ${filePath}`)
      } catch (error) {
        // File might already exist, try to update it
        const existingFile = this.app.vault.getAbstractFileByPath(filePath)
        if (existingFile && existingFile instanceof TFile) {
          await this.app.vault.modify(existingFile, indexContent)
          console.log(`Updated vocabulary index file: ${filePath}`)
        }
      }
    } catch (error) {
      console.error(
        `Error creating vocabulary index for course ${courseId}:`,
        error
      )
      throw error
    }
  }
}
