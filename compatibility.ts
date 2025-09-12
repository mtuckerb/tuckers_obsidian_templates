// Backwards compatibility layer for Tuckers Tools plugin

import { App } from 'obsidian';
import { TuckersToolsSettings } from './settings';

export class BackwardsCompatibility {
  app: App;
  settings: TuckersToolsSettings;

  constructor(app: App, settings: TuckersToolsSettings) {
    this.app = app;
    this.settings = settings;
  }

  // Ensure old notes work with new features
  ensureCompatibility(noteContent: string, frontmatter: any): {content: string, frontmatter: any} {
    // Add new metadata fields to old notes if they don't exist
    const updatedFrontmatter = {...frontmatter};
    
    // If using enhanced metadata and old fields exist, map them to new fields
    if (this.settings.useEnhancedMetadata) {
      if (frontmatter.course_id && !frontmatter.course_name) {
        updatedFrontmatter.course_name = frontmatter.title || frontmatter.course_id;
      }
      
      if (!updatedFrontmatter.content_type) {
        // Try to infer content type from existing data
        if (frontmatter.course_id && frontmatter.module_number) {
          updatedFrontmatter.content_type = 'module';
        } else if (frontmatter.course_id && frontmatter.chapter_number) {
          updatedFrontmatter.content_type = 'chapter';
        } else if (frontmatter.course_id && frontmatter.tags?.includes('course_home')) {
          updatedFrontmatter.content_type = 'course_homepage';
        }
      }
    }
    
    return {
      content: noteContent,
      frontmatter: updatedFrontmatter
    };
  }

  // Convert old template syntax to new template syntax
  convertTemplateSyntax(oldContent: string): string {
    // This would convert old template syntax to new syntax
    // For now, we'll just return the content unchanged
    return oldContent;
  }

  // Validate that a note meets minimum requirements
  validateNote(noteContent: string, frontmatter: any): boolean {
    // Check if note has required fields based on content type
    if (frontmatter.content_type === 'course_homepage') {
      return !!frontmatter.course_id;
    } else if (frontmatter.content_type === 'module') {
      return !!(frontmatter.course_id && (frontmatter.module_number || frontmatter.week_number));
    } else if (frontmatter.content_type === 'chapter') {
      return !!(frontmatter.course_id && frontmatter.chapter_number);
    }
    
    // For other note types or when content_type is not specified, consider valid
    return true;
  }
}