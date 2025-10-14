// Jest setup file to mock Obsidian modules for testing

// Manually mock obsidian by overriding require cache
const mockObsidian = {
  App: jest.fn().mockImplementation(() => ({
    vault: {
      create: jest.fn().mockResolvedValue(undefined),
      createFolder: jest.fn().mockResolvedValue(undefined),
      getAbstractFileByPath: jest.fn().mockReturnValue(null),
      createNew: jest.fn()
    },
    workspace: {
      getActiveFile: jest.fn().mockReturnValue(null)
    }
  })),
  TFile: jest.fn().mockImplementation(() => ({
    path: "",
    name: "",
    basename: "",
    extension: "md",
    parent: null,
    stat: {
      ctime: 0,
      mtime: 0,
      size: 0
    }
  })),
  Notice: jest.fn().mockImplementation((message) => {
    console.log("Notice:", message)
  }),
  Plugin: class {
    constructor(app, manifest) {
      this.app = app
      this.manifest = manifest
    }
  },
  PluginSettingTab: class {
    constructor(app, plugin) {
      this.app = app
      this.plugin = plugin
      this.containerEl = {
        createEl: jest.fn().mockReturnValue({
          createEl: jest.fn().mockReturnThis(),
          createDiv: jest.fn().mockReturnThis(),
          setText: jest.fn().mockReturnThis(),
          addClass: jest.fn().mockReturnThis()
        }),
        createDiv: jest.fn().mockReturnValue({
          createEl: jest.fn().mockReturnThis(),
          createDiv: jest.fn().mockReturnThis(),
          setText: jest.fn().mockReturnThis(),
          addClass: jest.fn().mockReturnThis()
        })
      }
    }
    display() {}
    hide() {}
  },
  Setting: class {
    constructor(containerEl) {
      this.containerEl = containerEl
    }
    setName(name) {
      this.name = name
      return this
    }
    setDesc(desc) {
      this.desc = desc
      return this
    }
    addText(cb) {
      const mockText = {
        setPlaceholder: jest.fn().mockReturnThis(),
        setValue: jest.fn().mockReturnThis(),
        onChange: jest.fn().mockReturnThis()
      }
      cb(mockText)
      return this
    }
    addToggle(cb) {
      const mockToggle = {
        setValue: jest.fn().mockReturnThis(),
        onChange: jest.fn().mockReturnThis()
      }
      cb(mockToggle)
      return this
    }
    addDropdown(cb) {
      const mockDropdown = {
        addOption: jest.fn().mockReturnThis(),
        setValue: jest.fn().mockReturnThis(),
        onChange: jest.fn().mockReturnThis()
      }
      cb(mockDropdown)
      return this
    }
  },
  TFolder: jest.fn().mockImplementation(() => ({
    path: "",
    name: "",
    parent: null,
    children: []
  })),
  normalizePath: jest.fn((path) => path),
  debounce: jest.fn((func) => func),
  requestUrl: jest.fn().mockResolvedValue({
    status: 200,
    text: "{}"
  })
}))
