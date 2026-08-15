const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function pad2(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

export function formatTime(
  epochSeconds: number | null | undefined,
  timezoneOffsetSeconds = 0,
  options: { hour12?: boolean } = {}
): string {
  if (epochSeconds === null || epochSeconds === undefined) return "—";
  const date = new Date((epochSeconds + timezoneOffsetSeconds) * 1000);
  const hour12 = options.hour12 ?? true;
  if (hour12) {
    let hours = date.getUTCHours() % 12;
    if (hours === 0) hours = 12;
    const minutes = pad2(date.getUTCMinutes());
    const ampm = date.getUTCHours() >= 12 ? "PM" : "AM";
    return `${hours}:${minutes} ${ampm}`;
  }
  return `${pad2(date.getUTCHours())}:${pad2(date.getUTCMinutes())}`;
}

export function formatDate(
  epochSeconds: number | null | undefined,
  timezoneOffsetSeconds = 0,
  options: { long?: boolean; includeYear?: boolean } = {}
): string {
  if (epochSeconds === null || epochSeconds === undefined) return "—";
  const date = new Date((epochSeconds + timezoneOffsetSeconds) * 1000);
  const months = options.long ? MONTHS : MONTHS_SHORT;
  const yearPart = options.includeYear ? `, ${date.getUTCFullYear()}` : "";
  return `${months[date.getUTCMonth()]} ${date.getUTCDate()}${yearPart}`;
}

export function formatWeekday(epochSeconds: number | null | undefined, timezoneOffsetSeconds = 0): string {
  if (epochSeconds === null || epochSeconds === undefined) return "—";
  const date = new Date((epochSeconds + timezoneOffsetSeconds) * 1000);
  return DAYS_LONG[date.getUTCDay()];
}

export function formatWeekdayShort(epochSeconds: number | null | undefined, timezoneOffsetSeconds = 0): string {
  if (epochSeconds === null || epochSeconds === undefined) return "—";
  const date = new Date((epochSeconds + timezoneOffsetSeconds) * 1000);
  return DAYS_SHORT[date.getUTCDay()];
}

export function formatRelativeTime(epochMs: number, nowMs = Date.now()): string {
  const diffSeconds = Math.max(0, Math.floor((nowMs - epochMs) / 1000));
  if (diffSeconds < 10) return "just now";
  if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

export function formatCoordinates(lat: number, lon: number): string {
  const latStr = `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? "N" : "S"}`;
  const lonStr = `${Math.abs(lon).toFixed(2)}°${lon >= 0 ? "E" : "W"}`;
  return `${latStr}, ${lonStr}`;
}

export function formatUtcOffset(offsetSeconds: number): string {
  const totalMinutes = Math.round(offsetSeconds / 60);
  const sign = totalMinutes < 0 ? "-" : "+";
  const abs = Math.abs(totalMinutes);
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;
  return `UTC${sign}${hours}${minutes ? `:${pad2(minutes)}` : ""}`;
}

export function aqiLabel(aqi: number): string {
  const labels = ["—", "Good", "Moderate", "Unhealthy", "Very Unhealthy", "Hazardous"];
  if (aqi < 1 || aqi > 5) return "Unknown";
  return labels[aqi];
}
