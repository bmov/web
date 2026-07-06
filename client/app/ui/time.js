/**
 * Convert an ISO 8601 UTC date string to a human-readable relative time.
 *
 * - 0–2 minutes  → "a moment ago"
 * - 3–59 minutes → "X minutes ago"
 * - 1–23 hours   → "X hour ago" / "X hours ago"
 * - 1+ days      → "July 2, 2026" (format: Month Day, Year)
 *
 * All calculations use UTC to avoid local timezone discrepancies.
 */

function parseUtc(str) {
  // Match ISO 8601: 2026-07-06T05:24:00.000Z or 2026-07-06 05:24:00
  const m = str?.match(
    /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/,
  );
  if (!m) return null;
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6] || 0);
}

export function formatRelativeTime(isoString) {
  const utcMs = parseUtc(isoString);
  if (utcMs == null) return '';

  const diffMs = Date.now() - utcMs;
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 0) {
    // Future date – format in UTC
    const m = isoString.match(
      /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})/,
    );
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return `${months[+m[2] - 1]} ${+m[3]}, ${m[1]}`;
  }

  if (diffMinutes <= 2) {
    return 'a moment ago';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  }

  // 1+ days – format in UTC
  const m = isoString.match(
    /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})/,
  );
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return `${months[+m[2] - 1]} ${+m[3]}, ${m[1]}`;
}
