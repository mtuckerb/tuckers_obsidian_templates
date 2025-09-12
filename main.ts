import { Plugin } from 'obsidian';
import { TuckersToolsSettings, DEFAULT_SETTINGS, TuckersToolsSettingTab } from './settings';
import { TemplateManager } from './templateManager';

export default class TuckersToolsPlugin extends Plugin {
  settings: TuckersToolsSettings;
  templateManager: TemplateManager;

  async onload() {
    console.log('Loading Tuckers Tools plugin');

    // Load settings
    await this.loadSettings();

    // Initialize template manager
    this.templateManager = new TemplateManager(this.app, this.settings);

    // Add settings tab
    this.addSettingTab(new TuckersToolsSettingTab(this.app, this));

    // Add commands
    this.addCommand({
      id: 'install-templates',
      name: 'Install/Update Tuckers Tools Templates',
      callback: () => {
        this.templateManager.installTemplates();
      }
    });

    this.addCommand({
      id: 'update-templates',
      name: 'Update Tuckers Tools Templates',
      callback: () => {
        this.templateManager.updateTemplates();
      }
    });

    // Add status bar item
    this.addStatusBarItem().setText('Tuckers Tools');
  }

  onunload() {
    console.log('Unloading Tuckers Tools plugin');
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}