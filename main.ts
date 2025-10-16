import { Plugin, Notice, TFile } from "obsidian"
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
import { AssignmentsModal } from "./assignmentsModal"

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

    // Initialize templater functions if templater is available
    this.initializeTemplaterFunctions()

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
      callback: async () => {
        // Get the templater plugin instance
        const templaterPlugin: any = (this.app as any).plugins.getPlugin("templater-obsidian");
        if (!templaterPlugin) {
          new Notice("Templater plugin is required for course creation. Please install and enable it.");
          return;
        }

        // Get the course homepage template from templateManager
        const templateManager = new TemplateManager(this.app, this.settings);
        const templateContent = templateManager.generateCourseHomepageTemplate();
        
        // Create a temporary file to apply templater
        const date = new Date();
        const tempFilename = `New Course ${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}.md`;
        
        // Create the temporary file in the root vault
        await this.app.vault.create(tempFilename, templateContent);
        
        // Open the file 
        const newFile = this.app.vault.getAbstractFileByPath(tempFilename);
        if (newFile instanceof TFile) {
          const leaf = this.app.workspace.getLeaf(true);
          await leaf.openFile(newFile);
          
          // Execute templater on the file to trigger the prompts
          try {
            await templaterPlugin.templater.execute_template_on_file(newFile);
          } catch (error) {
            console.error("Error executing templater on new course file:", error);
            new Notice("Error executing templater on new course file. Please run 'Templater: Replace templates in the current file' manually.");
          }
        } else {
          new Notice("Error: Could not create course file");
        }
      }
    })

    this.addCommand({
      id: "create-multiple-assignments",
      name: "Create Multiple Assignments for Course",
      callback: async () => {
        // Get the current course context or prompt for it
        const currentFile = this.app.workspace.getActiveFile();
        let courseId = "";
        let courseName = "";

        // Try to determine the course from the current file
        if (currentFile) {
          const cache = this.app.metadataCache.getFileCache(currentFile);
          if (cache && cache.frontmatter) {
            courseId = cache.frontmatter.course_id || "";
            courseName = cache.frontmatter.course_name || cache.frontmatter.title || currentFile.basename;
          }
        }

        // If we couldn't determine the course, prompt for it
        if (!courseId) {
          const promptedCourseId = await this.promptForCourseId("Enter course ID for assignments");
          if (!promptedCourseId) return;
          courseId = promptedCourseId;
          courseName = courseId; // Fallback if we don't have a better name
        }

        // Show the assignments modal
        new AssignmentsModal(
          this.app,
          courseName,
          courseId,
          async (assignments, courseName, courseId) => {
            // Process the assignments - for now, we'll create individual assignment files
            for (const assignment of assignments) {
              if (assignment.name.trim() === "") continue; // Skip empty assignments

              // Create an assignment file
              const assignmentContent = this.generateAssignmentFileContent(
                assignment,
                courseName,
                courseId
              );
              const fileName = `${courseId} - ${assignment.name.replace(/[<>:"/\\|?*]/g, "_")}.md`;
              const filePath = `${courseId}/${fileName}`;

              try {
                await this.app.vault.create(filePath, assignmentContent);
                console.log(`Created assignment file: ${filePath}`);
              } catch (error) {
                console.error(`Error creating assignment file ${filePath}:`, error);
              }
            }
          }
        ).open();
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

  generateAssignmentFileContent(assignment: any, courseName: string, courseId: string): string {
    // Create the assignment file content using the assignment template structure
    return `---
course_id: ${courseId}
assignment_type: ${assignment.type || "Assignment"}
due_date: ${assignment.dueDate}
points: ${assignment.points || ""}
content_type: assignment
created: ${new Date().toISOString()}
status: pending
tags:
  - education
  - ${courseId}
  - assignment
---

# ${assignment.name} - ${courseId}

## Description
${assignment.description}

## Instructions


## Due Date
**Assigned**: ${new Date().toISOString().split('T')[0]}
**Due**: ${assignment.dueDate}

## Submission


## Grading Criteria


## Resources


# Due Dates
| ${assignment.dueDate} | ${assignment.name} | pending |
`;
  }

  onunload() {
    console.log("Unloading Tuckers Tools plugin")
  }

  async initializeTemplaterFunctions() {
    // Check if Templater plugin is available
    const templaterPlugin = (this.app as any).plugins.getPlugin("templater-obsidian");
    if (!templaterPlugin) {
      console.log("Templater plugin not found. Course templates will not work properly.");
      return;
    }

    // Register user functions with Templater
    try {
      // Try to add functions via different methods depending on the Templater version
      if (templaterPlugin && templaterPlugin.templater) {
        // Create a user function manager object if it doesn't exist
        if (!templaterPlugin.templater.functions) {
          templaterPlugin.templater.functions = {};
        }

        // Add our custom functions directly to the templater functions object
        templaterPlugin.templater.functions["new_module"] = async (app: any, tp: any, year: any) => {
          return this.newModuleFunction(app, tp, year);
        };

        templaterPlugin.templater.functions["new_chapter"] = async (tp: any) => {
          return this.newChapterFunction(tp);
        };

        console.log("Tuckers Tools templater functions registered successfully");
      } else {
        console.error("Could not register templater functions - templater object not found");
      }
    } catch (e) {
      console.error("Error registering templater functions:", e);
    }
  }

  async newModuleFunction(app: any, tp: any, year: string) {
    // Prompt user for module details
    let moduleNumber: string | null = "";
    let weekNumber: string | null = "";
    let course = "";
    let courseId = "";
    let discipline = "GEN";
    let dayOfWeek = "";

    try {
      // Attempt prompts with fallback
      if (tp && tp.system && tp.system.prompt) {
        const tempModuleNumber = await tp.system.prompt("Module Number (optional)", "");
        moduleNumber = tempModuleNumber ? tempModuleNumber : null;
        
        const tempWeekNumber = await tp.system.prompt("Week Number (optional)", "");
        weekNumber = tempWeekNumber ? tempWeekNumber : null;
        
        course = await tp.system.suggester(
          () => app.vault.getMarkdownFiles().filter((f: any) => f.path.includes("Courses")).map((f: any) => f.basename),
          app.vault.getMarkdownFiles().filter((f: any) => f.path.includes("Courses"))
        );
        
        dayOfWeek = await tp.system.suggester(
          ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "Day of Week"
        );
      } else {
        // Fallback values
        moduleNumber = null;
        weekNumber = null;
        course = "New Course";
        dayOfWeek = "Monday";
      }
    } catch (e) {
      console.error("Error in new_module prompts:", e);
      // Default values on error
      moduleNumber = null;
      weekNumber = null;
      course = "New Course";
      dayOfWeek = "Monday";
    }

    // Calculate derived values
    courseId = course ? course.split(" - ")[0] || course : "";
    discipline = course ? (course.split(" - ")[0]?.substring(0, 3) || "GEN") : "GEN";

    return {
      season: "Fall", // This would normally be dynamically determined
      moduleNumber: moduleNumber,
      weekNumber: weekNumber,
      course,
      courseId,
      discipline,
      dayOfWeek
    };
  }

  async newChapterFunction(tp: any) {
    let chapterNumber = "";
    let course = "";
    let courseId = "";
    let discipline = "GEN";
    let text = "";

    try {
      if (tp && tp.system && tp.system.prompt) {
        chapterNumber = await tp.system.prompt("Chapter Number", "") || "";
        course = await tp.system.suggester(
          () => tp.app.vault.getMarkdownFiles().filter((f: any) => f.path.includes("Courses")).map((f: any) => f.basename),
          tp.app.vault.getMarkdownFiles().filter((f: any) => f.path.includes("Courses"))
        );
        const textOptions = tp.app.vault.getFiles().filter((f: any) => f.extension === "pdf").map((f: any) => f.basename);
        text = await tp.system.suggester(textOptions, textOptions, "Textbook");
      } else {
        // Fallback values
        chapterNumber = "";
        course = "New Course";
        text = "New Textbook";
      }
    } catch (e) {
      console.error("Error in new_chapter prompts:", e);
      // Default values on error
      chapterNumber = "";
      course = "New Course";
      text = "New Textbook";
    }

    // Calculate derived values
    courseId = course ? course.split(" - ")[0] || course : "";
    discipline = course ? (course.split(" - ")[0]?.substring(0, 3) || "GEN") : "GEN";

    return {
      chapterNumber,
      course,
      courseId,
      discipline,
      text
    };
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }
}
