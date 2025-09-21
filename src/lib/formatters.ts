export function toTitleCase(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate a safe slug for file paths with a maximum length
 * @param name - The contributor name
 * @param maxLength - Maximum length for the slug (default: 50)
 * @returns A slug-safe string
 */
export function generateSafeSlug(name: string, maxLength: number = 50): string {
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '') // Remove any non-alphanumeric characters except hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  // If the slug is still too long, truncate it
  if (slug.length > maxLength) {
    return slug.substring(0, maxLength).replace(/-$/, ''); // Remove trailing hyphen if present
  }

  return slug;
} 