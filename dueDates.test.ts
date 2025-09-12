// Test file for due dates parser

import { test, expect } from '@jest/globals';
import { DueDatesParser } from './dueDates';

// Mock App
const mockApp: any = {};

test('due dates parser initializes correctly', () => {
  const parser = new DueDatesParser(mockApp);
  
  expect(parser).toBeDefined();
  expect(parser.app).toBe(mockApp);
});

test('due dates parser can extract due dates from note content', () => {
  const parser = new DueDatesParser(mockApp);
  
  const noteContent = `
# Due Dates
| Date | Assignment | Status |
| ---- | ---------- | ------ |
| 2025-09-15 | Quiz 1 | pending |
| 2025-09-20 | Discussion Post | completed |

# Notes
This is a note with due dates.
`;

  const dueDates = parser.parseDueDatesFromNote(noteContent);
  
  expect(dueDates).toHaveLength(2);
  expect(dueDates[0]).toEqual({
    date: '2025-09-15',
    assignment: 'Quiz 1',
    status: 'pending'
  });
  expect(dueDates[1]).toEqual({
    date: '2025-09-20',
    assignment: 'Discussion Post',
    status: 'completed'
  });
});

test('due dates parser handles notes without due dates section', () => {
  const parser = new DueDatesParser(mockApp);
  
  const noteContent = `
# Notes
This is a note without due dates.
`;

  const dueDates = parser.parseDueDatesFromNote(noteContent);
  
  expect(dueDates).toEqual([]);
});