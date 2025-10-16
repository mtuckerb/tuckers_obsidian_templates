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

import { processCourseVocabulary, processDueDates } from "./Supporting/dataview-functions";

export default class TuckersToolsPlugin extends Plugin {
  settings: TuckersToolsSettings
  templateManager: TemplateManager
  courseWizard: CourseCreationWizard
  vocabularyExtractor: VocabularyExtractor
  dueDatesParser: DueDatesParser
  dailyNotesIntegration: DailyNotesIntegration
  dataviewFunctions: any;

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
    this.dataviewFunctions = { processCourseVocabulary, processDueDates };

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

    // Course creation is handled by Templater templates - no custom command needed

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
    // Register our custom templater functions in the global namespace
      // This approach survives template execution unlike direct function registration
      try {
        // Create our global namespace under app.globals to store our functions
        if (!(this.app as any).globals) {
          (this.app as any).globals = {};
        }
        if (!(this.app as any).globals.tuckersTools) {
          (this.app as any).globals.tuckersTools = {};
        }
        
        // Register our functions in the global namespace
        (this.app as any).globals.tuckersTools.new_module = async (app: any, tp: any, year: any) => {
          return this.newModuleFunction(app, tp, year);
        };
        
        (this.app as any).globals.tuckersTools.new_chapter = async (tp: any) => {
          return this.newChapterFunction(tp);
        };
        
        console.log("Tuckers Tools global functions registered successfully");
      } catch (e) {
        console.error("Error registering Tuckers Tools global functions:", e);
      }
  }

  async newModuleFunction(app: any, tp: any, year: string) {
    // Prompt user for module details in the correct order
    let moduleNumber: string | null = "";
    let weekNumber: string | null = "";
    let course = "";
    let courseId = "";
    let discipline = "GEN";
    let dayOfWeek = "";
    let season = "";

    try {
      // Attempt prompts with fallback
      if (tp && tp.system && tp.system.prompt) {
        // First, ask for the course (filtered by current semester)
        // Get current date for filtering
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear().toString();
        const currentMonth = currentDate.getMonth(); // 0-11
        let currentSemester = "Fall";
        
        // Determine current semester based on month
        if (currentMonth >= 0 && currentMonth <= 4) {
          currentSemester = "Spring";
        } else if (currentMonth >= 5 && currentMonth <= 7) {
          currentSemester = "Summer";
        } else {
          currentSemester = "Fall";
        }
        
        console.log(`Filtering courses for ${currentSemester} ${currentYear}`);

        // Look for course files from the current semester only
        const courseFiles = app.vault.getMarkdownFiles().filter((f: any) => {
          const cache = app.metadataCache.getFileCache(f);
          if (!cache) return false;
          
          // Check if it's a course file
          const isCourseFile = cache && (
            (cache.tags && cache.tags.some((tag: any) => tag.tag === "#course_home")) ||
            (cache.frontmatter && cache.frontmatter.contentType === "Course") ||
            (cache.frontmatter && cache.frontmatter.tags && 
             (Array.isArray(cache.frontmatter.tags) 
               ? cache.frontmatter.tags.includes("course_home")
               : cache.frontmatter.tags === "course_home"))
          );
          
          if (!isCourseFile) return false;
          
          // Check if it's from the current semester
          const isCurrentSemester = cache && (
            (cache.frontmatter && cache.frontmatter.course_year === currentYear && cache.frontmatter.course_season === currentSemester) ||
            (cache.frontmatter && cache.frontmatter.course_year === currentYear && cache.frontmatter.course_season === currentSemester)
          );
          
          // If we can't determine semester, include it (fallback)
          if (!cache.frontmatter || (!cache.frontmatter.course_year && !cache.frontmatter.course_season)) {
            return isCourseFile; // Include course files even if we can't filter by semester
          }
          
          return isCourseFile && isCurrentSemester;
        });
        
        console.log(`Found ${courseFiles.length} course files for ${currentSemester} ${currentYear}`);

        if (courseFiles.length === 0) {
          // If no courses found for current semester, show all courses
          console.log("No courses found for current semester, showing all courses");
          const allCourseFiles = app.vault.getMarkdownFiles().filter((f: any) => {
            const cache = app.metadataCache.getFileCache(f);
            return cache && (
              (cache.tags && cache.tags.some((tag: any) => tag.tag === "#course_home")) ||
              (cache.frontmatter && cache.frontmatter.contentType === "Course") ||
              (cache.frontmatter && cache.frontmatter.tags && 
               (Array.isArray(cache.frontmatter.tags) 
                 ? cache.frontmatter.tags.includes("course_home")
                 : cache.frontmatter.tags === "course_home"))
            );
          });
          
          if (allCourseFiles.length > 0) {
            course = await tp.system.suggester(
              allCourseFiles.map((f: any) => f.basename), // Display labels
              allCourseFiles, // Actual values
              "Select Course (All Semesters)"
            );
          } else {
            // No courses found at all, fall back to prompt
            course = await tp.system.prompt("Course Name", "New Course");
          }
        } else {
          course = await tp.system.suggester(
            courseFiles.map((f: any) => f.basename), // Display labels
            courseFiles, // Actual values
            `Select Course (${currentSemester} ${currentYear})`
          );
        }

        // Now ask for module details
        const tempModuleNumber = await tp.system.prompt("Module Number (optional)", "");
        moduleNumber = tempModuleNumber ? tempModuleNumber : null;
        
        const tempWeekNumber = await tp.system.prompt("Week Number (optional)", "");
        weekNumber = tempWeekNumber ? tempWeekNumber : null;
        
        dayOfWeek = await tp.system.suggester(
          ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], // Display labels
          ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], // Actual values
          "Day of Week"
        );
        
        // Set season to current semester
        season = currentSemester;
      } else {
        // Fallback values
        moduleNumber = null;
        weekNumber = null;
        course = "New Course";
        dayOfWeek = "Monday";
        season = "Fall"; // Default fallback
      }
    } catch (e) {
      console.error("Error in new_module prompts:", e);
      // Default values on error
      moduleNumber = null;
      weekNumber = null;
      course = "New Course";
      dayOfWeek = "Monday";
      season = "Fall";
    }

    // Calculate derived values
    courseId = course ? course.split(" - ")[0] || course : "";
    discipline = course ? (course.split(" - ")[0]?.substring(0, 3) || "GEN") : "GEN";

    return {
      season,
      moduleNumber,
      weekNumber,
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
        // Look for files with course_home tag or contentType: Course instead of hardcoded path
        const courseFiles = tp.app.vault.getMarkdownFiles().filter((f: any) => {
          const cache = tp.app.metadataCache.getFileCache(f);
          return cache && (
            (cache.tags && cache.tags.some((tag: any) => tag.tag === "#course_home")) ||
            (cache.frontmatter && cache.frontmatter.contentType === "Course") ||
            (cache.frontmatter && cache.frontmatter.tags && 
             (Array.isArray(cache.frontmatter.tags) 
               ? cache.frontmatter.tags.includes("course_home")
               : cache.frontmatter.tags === "course_home"))
          );
        });
        
        course = await tp.system.suggester(
          () => courseFiles.map((f: any) => f.basename),
          courseFiles
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
