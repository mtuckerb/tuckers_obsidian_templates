// Test file for daily notes integration

import { test, expect } from '@jest/globals';
import { DailyNotesIntegration } from './dailyNotes';

// Mock App
const mockApp: any = {};

test('daily notes integration initializes correctly', () => {
  const integration = new DailyNotesIntegration(mockApp);
  
  expect(integration).toBeDefined();
  expect(integration.app).toBe(mockApp);
});

test('daily notes integration has required methods', () => {
  const integration = new DailyNotesIntegration(mockApp);
  
  expect(typeof integration.getTodaysActivities).toBe('function');
  expect(typeof integration.getCourseActivityForDate).toBe('function');
});