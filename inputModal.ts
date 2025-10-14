import { App, Modal, Setting } from "obsidian";

export class InputModal extends Modal {
  result: string | null;
  onSubmit: (result: string | null) => void;

  constructor(app: App, onSubmit: (result: string | null) => void) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h2", { text: "Enter Value" });

    new Setting(contentEl)
      .setName("Value")
      .addText((text) => 
        text
          .onChange((value) => {
            this.result = value;
          })
          .inputEl.focus()
      );

    new Setting(contentEl)
      .addButton((btn) =>
        btn
          .setButtonText("Submit")
          .setCta()
          .onClick(() => {
            this.close();
            this.onSubmit(this.result || "");
          })
      )
      .addButton((btn) =>
        btn.setButtonText("Cancel").onClick(() => {
          this.close();
          this.onSubmit(null);
        })
      );
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

export class SuggesterModal extends Modal {
  result: string | null;
  onSubmit: (result: string | null) => void;

  constructor(app: App, options: string[], onSubmit: (result: string | null) => void) {
    super(app);
    this.onSubmit = onSubmit;

    // Create a dropdown with the provided options
    const dropdownOptions: { [key: string]: string } = {};
    options.forEach(option => {
      dropdownOptions[option] = option;
    });
    
    this.createDropdown(dropdownOptions);
  }

  createDropdown(options: { [key: string]: string }) {
    const { contentEl } = this;

    contentEl.createEl("h2", { text: "Select Option" });

    let selectedValue = Object.keys(options)[0] || null; // Default to first option or null

    const dropdown = contentEl.createEl("select");
    Object.entries(options).forEach(([key, value]) => {
      const option = dropdown.createEl("option", {
        value: key,
        text: value
      });
      if (key === selectedValue) {
        option.selected = true;
      }
    });

    dropdown.addEventListener("change", (event) => {
      selectedValue = (event.target as HTMLSelectElement).value;
      this.result = selectedValue;
    });

    new Setting(contentEl)
      .addButton((btn) =>
        btn
          .setButtonText("Submit")
          .setCta()
          .onClick(() => {
            this.close();
            this.onSubmit(selectedValue);
          })
      )
      .addButton((btn) =>
        btn.setButtonText("Cancel").onClick(() => {
          this.close();
          this.onSubmit(null);
        })
      );
  }

  onOpen() {
    // The dropdown is already created in constructor
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}