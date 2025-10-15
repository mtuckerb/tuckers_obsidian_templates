import { App, Modal, Setting, TextAreaComponent } from "obsidian";

interface Assignment {
  name: string;
  dueDate: string;
  type: string;
  points: string;
  description: string;
}

export class AssignmentsModal extends Modal {
  assignments: Assignment[];
  courseName: string;
  courseId: string;
  onSubmit: (assignments: Assignment[], courseName: string, courseId: string) => void;

  constructor(
    app: App,
    courseName: string,
    courseId: string,
    onSubmit: (assignments: Assignment[], courseName: string, courseId: string) => void
  ) {
    super(app);
    this.assignments = [{ name: "", dueDate: "", type: "", points: "", description: "" }];
    this.courseName = courseName;
    this.courseId = courseId;
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("tuckers-tools-assignments-modal");

    contentEl.createEl("h2", { text: "Create Multiple Assignments" });

    // Course information display
    new Setting(contentEl)
      .setName("Course")
      .setDesc(`${this.courseName} (${this.courseId})`)
      .setDisabled(true);

    // Container for assignment list
    const assignmentsContainer = contentEl.createDiv({ cls: "assignments-container" });

    // Add first assignment
    this.addAssignmentSection(assignmentsContainer, 0);

    // Add assignment button
    new Setting(contentEl)
      .addButton((btn) =>
        btn
          .setButtonText("Add Assignment")
          .setCta()
          .onClick(() => {
            const newIndex = this.assignments.length;
            this.assignments.push({ name: "", dueDate: "", type: "", points: "", description: "" });
            this.addAssignmentSection(assignmentsContainer, newIndex);
          })
      );

    // Submit button
    new Setting(contentEl)
      .addButton((btn) =>
        btn
          .setButtonText("Create Assignments")
          .setCta()
          .onClick(() => {
            // Filter out empty assignments
            const validAssignments = this.assignments.filter(
              (a) => a.name.trim() !== "" || a.dueDate.trim() !== ""
            );
            this.onSubmit(validAssignments, this.courseName, this.courseId);
            this.close();
          })
      );
  }

  addAssignmentSection(container: HTMLElement, index: number) {
    const section = container.createDiv({ cls: "assignment-section" });
    section.createEl("h3", { text: `Assignment #${index + 1}` });

    new Setting(section)
      .setName("Assignment Name")
      .addText((text) =>
        text
          .setPlaceholder("Enter assignment name")
          .setValue(this.assignments[index].name)
          .onChange((value) => {
            this.assignments[index].name = value;
          })
      );

    new Setting(section)
      .setName("Due Date")
      .setDesc("Format: YYYY-MM-DD")
      .addText((text) =>
        text
          .setPlaceholder("2024-01-15")
          .setValue(this.assignments[index].dueDate)
          .onChange((value) => {
            this.assignments[index].dueDate = value;
          })
      );

    new Setting(section)
      .setName("Assignment Type")
      .addText((text) =>
        text
          .setPlaceholder("e.g., Homework, Quiz, Exam")
          .setValue(this.assignments[index].type)
          .onChange((value) => {
            this.assignments[index].type = value;
          })
      );

    new Setting(section)
      .setName("Points")
      .addText((text) =>
        text
          .setPlaceholder("e.g., 100")
          .setValue(this.assignments[index].points)
          .onChange((value) => {
            this.assignments[index].points = value;
          })
      );

    new Setting(section)
      .setName("Description")
      .addTextArea((text) =>
        text
          .setPlaceholder("Enter assignment description")
          .setValue(this.assignments[index].description)
          .onChange((value) => {
            this.assignments[index].description = value;
          })
      );

    // Add remove button if there's more than one assignment
    if (this.assignments.length > 1) {
      new Setting(section)
        .addButton((btn) =>
          btn
            .setButtonText("Remove")
            .onClick(() => {
              this.assignments.splice(index, 1);
              section.remove();
              this.renumberAssignments();
            })
        );
    }
  }

  renumberAssignments() {
    const sections = this.contentEl.querySelectorAll(".assignment-section");
    sections.forEach((section, index) => {
      const header = section.querySelector("h3");
      if (header) {
        header.textContent = `Assignment #${index + 1}`;
      }
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}