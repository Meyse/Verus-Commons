/**
 * Utility functions for the Commons project
 * - stringToColor: Deterministic color from string
 * - getInitials: Extract initials from name
 * - timeAgo: Relative time display
 * 
 * Updated: Reduced saturation in stringToColor for less distracting generated icons
 */

/**
 * Generate a deterministic HSL color from a string
 * Uses muted saturation (35%) for subtle, non-distracting appearance
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 35%, 55%)`;
}

/**
 * Extract initials from a name (e.g., "Verus Desktop" → "VD")
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Convert a date string to relative time (e.g., "3d ago")
 */
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: [number, string][] = [
    [31536000, 'y'],
    [2592000, 'mo'],
    [86400, 'd'],
    [3600, 'h'],
    [60, 'm'],
  ];

  for (const [secondsInInterval, label] of intervals) {
    const interval = Math.floor(seconds / secondsInInterval);
    if (interval >= 1) {
      return `${interval}${label} ago`;
    }
  }

  return 'just now';
}
