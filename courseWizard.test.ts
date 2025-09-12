// Test file for course wizard

import { test, expect } from '@jest/globals';
import { CourseCreationWizard } from './courseWizard';

// Mock App and Settings
const mockApp: any = {};
const mockSettings: any = {
  baseDirectory: '/',
  schoolName: 'University of Southern Maine',
  schoolAbbreviation: 'USM'
};

test('course wizard initializes correctly', () => {
  const wizard = new CourseCreationWizard(mockApp, mockSettings);
  
  expect(wizard).toBeDefined();
  expect(wizard.app).toBe(mockApp);
  expect(wizard.settings).toBe(mockSettings);
});

test('course wizard has createCourseHomepage method', () => {
  const wizard = new CourseCreationWizard(mockApp, mockSettings);
  
  expect(typeof wizard.createCourseHomepage).toBe('function');
});