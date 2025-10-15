import { App, PluginSettingTab, Setting } from 'obsidian';
import TuckersToolsPlugin from './main';
import { validateDate } from './utils';

export interface TuckersToolsSettings {
  baseDirectory: string;
  semesterStartDate: string;
  semesterEndDate: string;
  schoolName: string;
  schoolAbbreviation: string;
  templateFolder: string;
  useEnhancedMetadata: boolean;
  dataviewJsPath: string;
}

export const DEFAULT_SETTINGS: TuckersToolsSettings = {
  baseDirectory: '/',
  semesterStartDate: new Date().toISOString().split('T')[0],
  semesterEndDate: new Date(new Date().setMonth(new Date().getMonth() + 4)).toISOString().split('T')[0],
  schoolName: 'University',
  schoolAbbreviation: 'U',
  templateFolder: 'Tuckers Tools',
  useEnhancedMetadata: false,
  dataviewJsPath: '/Supporting/dataview-functions'
}

export class TuckersToolsSettingTab extends PluginSettingTab {
  plugin: TuckersToolsPlugin;

  constructor(app: App, plugin: TuckersToolsPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Tuckers Tools Settings' });

    new Setting(containerEl)
      .setName('Base Directory')
      .setDesc('Root directory for course content organization')
      .addText(text => text
        .setPlaceholder('/')
        .setValue(this.plugin.settings.baseDirectory)
        .onChange(async (value) => {
          this.plugin.settings.baseDirectory = value;
          await this.plugin.saveSettings();
        }));

    const startDateSetting = new Setting(containerEl)
      .setName('Semester Start Date')
      .setDesc('Start date for the current semester')
      .addText(text => text
        .setPlaceholder('YYYY-MM-DD')
        .setValue(this.plugin.settings.semesterStartDate)
        .onChange(async (value) => {
          if (value && !validateDate(value)) {
            startDateSetting.setDesc('Start date for the current semester (Invalid date format)');
          } else {
            startDateSetting.setDesc('Start date for the current semester');
          }
          this.plugin.settings.semesterStartDate = value;
          await this.plugin.saveSettings();
        }));

    const endDateSetting = new Setting(containerEl)
      .setName('Semester End Date')
      .setDesc('End date for the current semester')
      .addText(text => text
        .setPlaceholder('YYYY-MM-DD')
        .setValue(this.plugin.settings.semesterEndDate)
        .onChange(async (value) => {
          if (value && !validateDate(value)) {
            endDateSetting.setDesc('End date for the current semester (Invalid date format)');
          } else {
            endDateSetting.setDesc('End date for the current semester');
          }
          this.plugin.settings.semesterEndDate = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('School Name')
      .setDesc('Name of your institution')
      .addText(text => text
        .setPlaceholder('University')
        .setValue(this.plugin.settings.schoolName)
        .onChange(async (value) => {
          this.plugin.settings.schoolName = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('School Abbreviation')
      .setDesc('Abbreviation for your institution')
      .addText(text => text
        .setPlaceholder('U')
        .setValue(this.plugin.settings.schoolAbbreviation)
        .onChange(async (value) => {
          this.plugin.settings.schoolAbbreviation = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Template Folder')
      .setDesc('Subfolder within your Templater template folder for Tuckers Tools templates')
      .addText(text => text
        .setPlaceholder('Tuckers Tools')
        .setValue(this.plugin.settings.templateFolder)
        .onChange(async (value) => {
          this.plugin.settings.templateFolder = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Use Enhanced Metadata')
      .setDesc('Enable enhanced metadata fields for new notes (existing notes remain unchanged)')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.useEnhancedMetadata)
        .onChange(async (value) => {
          this.plugin.settings.useEnhancedMetadata = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Dataview Functions Path')
      .setDesc('Path to the dataview functions file (without extension)')
      .addText(text => text
        .setPlaceholder('/Supporting/dataview-functions')
        .setValue(this.plugin.settings.dataviewJsPath)
        .onChange(async (value) => {
          this.plugin.settings.dataviewJsPath = value;
          await this.plugin.saveSettings();
        }));
  }
}