// Test file for backwards compatibility

import { test, expect } from '@jest/globals';
import { BackwardsCompatibility } from './compatibility';

// Mock App and Settings
const mockApp: any = {};
const mockSettings: any = {
  useEnhancedMetadata: true
};

test('ensureCompatibility adds new fields to old notes', () => {
  const compatibility = new BackwardsCompatibility(mockApp, mockSettings);
  
  const oldNoteContent = '# Old Note\nThis is an old note';
  const oldFrontmatter = {
    course_id: 'PSI-101',
    title: 'Introduction to Psychology'
  };
  
  const result = compatibility.ensureCompatibility(oldNoteContent, oldFrontmatter);
  
  expect(result.frontmatter.course_id).toBe('PSI-101');
  expect(result.frontmatter.course_name).toBe('Introduction to Psychology');
});

test('validateNote works with old and new note formats', () => {
  const compatibility = new BackwardsCompatibility(mockApp, mockSettings);
  
  // Test old format that should be valid
  const oldHomepageFrontmatter = {
    course_id: 'PSI-101',
    tags: ['course_home']
  };
  
  expect(compatibility.validateNote('', oldHomepageFrontmatter)).toBe(true);
  
  // Test new format that should be valid
  const newHomepageFrontmatter = {
    course_id: 'PSI-101',
    content_type: 'course_homepage'
  };
  
  expect(compatibility.validateNote('', newHomepageFrontmatter)).toBe(true);
});