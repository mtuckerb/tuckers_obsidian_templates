import { Plugin } from "obsidian"
import {
  TuckersToolsSettings,
  DEFAULT_SETTINGS,
  TuckersToolsSettingTab
} from "./settings"
import { TemplateManager } from "./templateManager"
import { CourseCreationWizard } from "./courseWizard"
import { VocabularyExtractor } from "./vocabulary"
import { DueDatesParser } from "./dueDates"
import { DailyNotesIntegration } from "./dailyNotes"

export default class TuckersToolsPlugin extends Plugin {
  settings: TuckersToolsSettings
  templateManager: TemplateManager
  courseWizard: CourseCreationWizard
  vocabularyExtractor: VocabularyExtractor
  dueDatesParser: DueDatesParser
  dailyNotesIntegration: DailyNotesIntegration

  async onload() {
    console.log("Loading Tuckers Tools plugin")

    // Load settings
    await this.loadSettings()

    // Initialize components
    this.templateManager = new TemplateManager(this.app, this.settings)
    this.courseWizard = new CourseCreationWizard(this.app, this.settings)
    this.vocabularyExtractor = new VocabularyExtractor(this.app)
    this.dueDatesParser = new DueDatesParser(this.app)
    this.dailyNotesIntegration = new DailyNotesIntegration(this.app)

    // Add settings tab
    this.addSettingTab(new TuckersToolsSettingTab(this.app, this))

    // Add commands
    this.addCommand({
      id: "install-templates",
      name: "Install/Update Tuckers Tools Templates",
      callback: () => {
        this.templateManager.installTemplates()
      }
    })

    this.addCommand({
      id: "update-templates",
      name: "Update Tuckers Tools Templates",
      callback: () => {
        this.templateManager.updateTemplates()
      }
    })

    this.addCommand({
      id: "create-course",
      name: "Create New Course",
      callback: () => {
        this.courseWizard.createCourseHomepage()
      }
    })

    this.addCommand({
      id: "extract-vocabulary",
      name: "Extract Course Vocabulary",
      callback: async () => {
        const courseId = await this.promptForCourseId(
          "Enter course ID to extract vocabulary from"
        )
        if (courseId) {
          await this.vocabularyExtractor.createVocabularyIndexFile(courseId)
        }
      }
    })

    this.addCommand({
      id: "generate-due-dates-summary",
      name: "Generate Due Dates Summary",
      callback: async () => {
        const courseId = await this.promptForCourseId(
          "Enter course ID to generate due dates summary for"
        )
        if (courseId) {
          await this.dueDatesParser.createDueDatesSummaryFile(courseId)
        }
      }
    })

    this.addCommand({
      id: "generate-daily-summary",
      name: "Generate Daily Academic Summary",
      callback: async () => {
        const date = await this.promptForDate(
          "Enter date (YYYY-MM-DD) or leave empty for today"
        )
        await this.dailyNotesIntegration.createDailySummaryFile(
          date || undefined
        )
      }
    })

    // Add status bar item
    this.addStatusBarItem().setText("Tuckers Tools")
  }

  private async promptForCourseId(message: string): Promise<string | null> {
    const courseId = prompt(message + "\n\nExample: PSI-101")
    return courseId ? courseId.trim() : null
  }

  private async promptForDate(message: string): Promise<string | null> {
    const date = prompt(
      message + "\n\nExample: 2025-01-15 or leave empty for today"
    )
    return date ? date.trim() : null
  }

  onunload() {
    console.log("Unloading Tuckers Tools plugin")
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }
}
