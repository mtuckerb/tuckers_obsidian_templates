// Test file for main plugin functionality

import { test, expect } from "@jest/globals"

// Mock Obsidian Plugin class
jest.mock("obsidian", () => ({
  Plugin: class {
    app: any
    constructor(app: any, manifest: any) {
      this.app = app
    }
    addSettingTab() {}
    addCommand() {}
    addStatusBarItem() {
      return { setText: () => {} }
    }
    loadData() {
      return Promise.resolve({})
    }
    saveData() {
      return Promise.resolve()
    }
  },
  PluginSettingTab: class {
    constructor(app: any, plugin: any) {
      this.app = app
      this.plugin = plugin
    }
    display() {}
    hide() {}
  }
}))

// Mock the modules
jest.mock("./settings", () => ({
  DEFAULT_SETTINGS: {},
  TuckersToolsSettingTab: class {}
}))

jest.mock("./templateManager", () => ({
  TemplateManager: class {
    installTemplates() {}
    updateTemplates() {}
  }
}))

// Now import the plugin
import TuckersToolsPlugin from "./main"

test("plugin loads without errors", () => {
  const mockApp: any = {
    plugins: {
      plugins: {
        "templater-obsidian": {
          settings: {
            template_folder: "Templates"
          }
        }
      }
    }
  }

  const mockManifest: any = {}

  expect(() => {
    new TuckersToolsPlugin(mockApp, mockManifest)
  }).not.toThrow()
})

test("plugin has required methods", () => {
  const mockApp: any = {
    plugins: {
      plugins: {
        "templater-obsidian": {
          settings: {
            template_folder: "Templates"
          }
        }
      }
    }
  }

  const mockManifest: any = {}

  const plugin = new TuckersToolsPlugin(mockApp, mockManifest)

  expect(typeof plugin.onload).toBe("function")
  expect(typeof plugin.onunload).toBe("function")
  expect(typeof plugin.loadSettings).toBe("function")
  expect(typeof plugin.saveSettings).toBe("function")
})
