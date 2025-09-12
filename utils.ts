// Utility functions for Tuckers Tools plugin

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isBetween(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getCourseIdFromPath(path: string): string | null {
  // Extract course ID from path like "2025/Fall/PSI-101/..."
  const parts = path.split('/');
  for (const part of parts) {
    if (part.match(/^[A-Z]{2,4}-\d{3}$/)) {
      return part;
    }
  }
  return null;
}

export function validateDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regex)) return false;
  
  const date = new Date(dateString);
  const timestamp = date.getTime();
  
  if (typeof timestamp !== 'number' || isNaN(timestamp)) return false;
  
  return dateString === date.toISOString().split('T')[0];
}