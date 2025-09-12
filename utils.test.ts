// Test file for utility functions

import { test, expect } from '@jest/globals';
import { formatDate, addDays, isBetween, slugify, getCourseIdFromPath, validateDate } from './utils';

test('formatDate function', () => {
  const date = new Date('2025-09-11T10:30:00Z');
  expect(formatDate(date)).toBe('2025-09-11');
});

test('addDays function', () => {
  const date = new Date('2025-09-11T10:30:00Z');
  const newDate = addDays(date, 5);
  expect(formatDate(newDate)).toBe('2025-09-16');
});

test('isBetween function', () => {
  const date = new Date('2025-09-11');
  const start = new Date('2025-09-01');
  const end = new Date('2025-09-30');
  
  expect(isBetween(date, start, end)).toBe(true);
  
  const outsideDate = new Date('2025-10-01');
  expect(isBetween(outsideDate, start, end)).toBe(false);
});

test('slugify function', () => {
  expect(slugify('Hello World')).toBe('hello-world');
  expect(slugify('PSI-101 - Intro to Psych')).toBe('psi-101-intro-to-psych');
  expect(slugify('Test!!!')).toBe('test');
});

test('getCourseIdFromPath function', () => {
  expect(getCourseIdFromPath('2025/Fall/PSI-101/Module 1')).toBe('PSI-101');
  expect(getCourseIdFromPath('PSI-101 - Intro to Psych.md')).toBe('PSI-101');
  expect(getCourseIdFromPath('random/path/without/course/id')).toBeNull();
});

test('validateDate function', () => {
  expect(validateDate('2025-09-11')).toBe(true);
  expect(validateDate('2025-13-45')).toBe(false);
  expect(validateDate('not-a-date')).toBe(false);
  expect(validateDate('')).toBe(false);
});