// Test file for vocabulary extractor

import { test, expect } from '@jest/globals';
import { VocabularyExtractor } from './vocabulary';

// Mock App
const mockApp: any = {};

test('vocabulary extractor initializes correctly', () => {
  const extractor = new VocabularyExtractor(mockApp);
  
  expect(extractor).toBeDefined();
  expect(extractor.app).toBe(mockApp);
});

test('vocabulary extractor can extract vocabulary from note content', () => {
  const extractor = new VocabularyExtractor(mockApp);
  
  const noteContent = `
# Vocabulary

- Psychology
- Behavior
- Mental processes

# Notes
This is a note about psychology.
`;

  const vocab = extractor.extractVocabularyFromNote(noteContent);
  
  expect(vocab).toContain('Psychology');
  expect(vocab).toContain('Behavior');
  expect(vocab).toContain('Mental processes');
});

test('vocabulary extractor handles notes without vocabulary section', () => {
  const extractor = new VocabularyExtractor(mockApp);
  
  const noteContent = `
# Notes
This is a note without vocabulary.
`;

  const vocab = extractor.extractVocabularyFromNote(noteContent);
  
  expect(vocab).toEqual([]);
});