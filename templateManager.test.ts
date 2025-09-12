// Test file for template functionality

import { test, expect } from '@jest/globals';
import { TemplateManager } from './templateManager';

// Mock App and Settings
const mockApp: any = {
  vault: {
    getAbstractFileByPath: jest.fn().mockReturnValue(null),
    create: jest.fn().mockResolvedValue(undefined),
    createFolder: jest.fn().mockResolvedValue(undefined)
  },
  plugins: {
    plugins: {
      'templater-obsidian': {
        settings: {
          template_folder: 'Templates'
        }
      }
    }
  }
};

const mockSettings: any = {
  templateFolder: 'Tuckers Tools',
  schoolName: 'University of Southern Maine',
  schoolAbbreviation: 'USM',
  useEnhancedMetadata: true
};

test('template manager generates correct course homepage template', () => {
  const templateManager = new TemplateManager(mockApp, mockSettings);
  const template = templateManager.generateCourseHomepageTemplate();
  
  expect(template).toContain('course_id:');
  expect(template).toContain('course_name:');
  expect(template).toContain('University of Southern Maine');
});

test('template manager generates correct module template', () => {
  const templateManager = new TemplateManager(mockApp, mockSettings);
  const template = templateManager.generateModuleTemplate();
  
  expect(template).toContain('module_number:');
  expect(template).toContain('week_number:');
});

test('template manager generates correct chapter template', () => {
  const templateManager = new TemplateManager(mockApp, mockSettings);
  const template = templateManager.generateChapterTemplate();
  
  expect(template).toContain('chapter_number:');
});